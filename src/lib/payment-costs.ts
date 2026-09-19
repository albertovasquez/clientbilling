import { CDG_CHECKED, cdgPlans, type CdgPlanKey } from "@/lib/cdg";

/**
 * Payment-cost calculator (decision 0021, product rule). Pure: an amount and a
 * list of rate snapshots in, one row per rail out, with the known fee, any
 * component that cannot be known in advance, and the net when every component
 * is known. Nothing is estimated silently: interchange-plus returns a null net.
 *
 * The homepage hero uses this first; the invoice page and the API reuse it in
 * epic #32 with the merchant's own snapshots.
 */

export type Rail = "card" | "bank_transfer" | "pay_link";

export type VariableComponent = {
  /** What is unknown, for example "interchange". */
  type: string;
  /** How the row should describe it, for example "varies by card". */
  label: string;
};

export type RateSource = {
  name: string;
  href?: string;
  /** ISO date the source was checked or the value was entered. */
  checkedAt: string;
};

export type RateSnapshot = {
  id: string;
  rail: Rail;
  label: string;
  /** Percentage as basis points: 350 is 3.50%. */
  percentBps: number;
  /** Fixed part per transaction in cents. */
  fixedCents: number;
  /** Parts of the cost that cannot be known before the payment. Empty when the fee is exact. */
  variable: VariableComponent[];
  source: RateSource;
};

export type PaymentCost = {
  rateId: string;
  rail: Rail;
  label: string;
  /** The formula as a person would read it, for example "3.50% + $0.30". */
  formula: string;
  knownFeeCents: number;
  variableComponents: (VariableComponent & { amountCents: null })[];
  /** Amount minus the known fee, or null when a component is unknown. May be negative on tiny amounts. */
  netCents: number | null;
  source: RateSource;
};

/** Half-up rounding of amount times basis points, in integer arithmetic. */
export function percentFeeCents(amountCents: number, percentBps: number): number {
  return Math.floor((amountCents * percentBps + 5000) / 10_000);
}

export function formulaLabel(snapshot: Pick<RateSnapshot, "percentBps" | "fixedCents">): string {
  const percent = (snapshot.percentBps / 100).toFixed(2) + "%";
  const fixed = "$" + (snapshot.fixedCents / 100).toFixed(2);
  if (snapshot.percentBps > 0 && snapshot.fixedCents > 0) return `${percent} + ${fixed}`;
  if (snapshot.percentBps > 0) return percent;
  return `${fixed} flat`;
}

export function paymentCosts(amountCents: number, snapshots: RateSnapshot[]): PaymentCost[] {
  const amount = Math.round(Number.isFinite(amountCents) ? amountCents : 0);
  return snapshots.map((s) => {
    const knownFeeCents = percentFeeCents(amount, s.percentBps) + s.fixedCents;
    const variableComponents = s.variable.map((v) => ({ ...v, amountCents: null }));
    return {
      rateId: s.id,
      rail: s.rail,
      label: s.label,
      formula: formulaLabel(s),
      knownFeeCents,
      variableComponents,
      netCents: variableComponents.length === 0 ? amount - knownFeeCents : null,
      source: s.source,
    };
  });
}

/** Parses a published figure such as "3.50% + $0.30" into basis points and cents. */
export function parseFigure(figure: string): { percentBps: number; fixedCents: number } | null {
  const percent = figure.match(/(\d+(?:\.\d+)?)\s*%/);
  const fixed = figure.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (!percent && !fixed) return null;
  return {
    percentBps: percent ? Math.round(parseFloat(percent[1]) * 100) : 0,
    fixedCents: fixed ? Math.round(parseFloat(fixed[1]) * 100) : 0,
  };
}

/**
 * CDG's published online card rates as snapshots, read from the CDG rates
 * module so a rate change there is the only edit. Flat rate is an exact fee;
 * interchange-plus carries interchange as a variable component.
 */
export function cdgOnlineSnapshots(): RateSnapshot[] {
  const pick = (key: CdgPlanKey, labelMatch: RegExp) => {
    const plan = cdgPlans.find((p) => p.key === key);
    const rate = plan?.rates.find((r) => labelMatch.test(r.label));
    const parsed = rate ? parseFigure(rate.figure) : null;
    if (!plan || !rate || !parsed) return null;
    return { plan, rate, parsed };
  };
  const flat = pick("flatRate", /^online/i);
  const icp = pick("interchangePlus", /^online/i);
  const out: RateSnapshot[] = [];
  if (flat) {
    out.push({
      id: "cdg_flat_online",
      rail: "card",
      label: "Card, flat rate",
      ...flat.parsed,
      variable: [],
      source: { name: "CDG Commerce published pricing", href: flat.plan.source.href, checkedAt: CDG_CHECKED },
    });
  }
  if (icp) {
    out.push({
      id: "cdg_interchange_plus_online",
      rail: "card",
      label: "Card, interchange-plus",
      ...icp.parsed,
      variable: [{ type: "interchange", label: "varies by card" }],
      source: { name: "CDG Commerce published pricing", href: icp.plan.source.href, checkedAt: CDG_CHECKED },
    });
  }
  return out;
}

/** A bank-transfer snapshot from the merchant's own setting. Until epic #32 stores one, callers pass an example and say so. */
export function bankTransferSnapshot(feeCents: number, opts: { example: boolean; asOf: string }): RateSnapshot {
  return {
    id: opts.example ? "ach_example" : "ach_setting",
    rail: "bank_transfer",
    label: "ACH bank transfer",
    percentBps: 0,
    fixedCents: Math.max(0, Math.round(feeCents)),
    variable: [],
    source: { name: opts.example ? "Your setting, example" : "Your setting", checkedAt: opts.asOf },
  };
}
