import { cdgPlan } from "@/lib/cdg";
import { cdgOnlineSnapshots, percentFeeCents, formulaLabel, type RateSource } from "@/lib/payment-costs";

/**
 * The example account behind the homepage Payments section (ticket #45, spec
 * #41). The volume and the mix are illustration with fictional figures, the
 * way the hero's invoice is: they show a merchant what the section is about.
 *
 * The CDG side is not illustration. The band, the markup formula, and the
 * dollar markup are read from the rates module through the calculator, so a
 * rate change in src/lib/cdg.ts moves this section and no number is typed in
 * two places (decision 0021, product rule).
 */
export const exampleAccount = {
  /** All invoiced volume over the trailing quarter, as a monthly figure. */
  monthlyVolumeCents: 2_418_000,
  /** How the example account's clients paid. Percentages of the volume above. */
  mix: [
    { rail: "card", label: "Paid by card", percent: 41 },
    { rail: "bank_transfer", label: "Paid by bank transfer", percent: 52 },
    { rail: "other", label: "Paid by check or cash", percent: 7 },
  ],
  /** Never present these figures as a quote or a prediction. */
  illustrative: true,
} as const;

export type ExampleMarkup = {
  /** Monthly card volume in cents: the card share of the example's total. */
  cardVolumeCents: number;
  /**
   * The percentage part of CDG's published markup on that volume. The fixed
   * part is per payment, and the example does not claim a payment count, so
   * it is named beside this figure rather than folded into it.
   */
  percentMarkupCents: number;
  /** The fixed part of the published markup, per card payment. */
  fixedPerPaymentCents: number;
  /** CDG's published band for the plan, for example "$10,000 to $200,000 a month". */
  band: string;
  /** The published markup as a person reads it, for example "0.35% + $0.15". */
  formula: string;
  source: RateSource;
};

/**
 * What CDG's published interchange-plus markup would have come to on the
 * example account's card volume. Two figures, never one: the percentage part,
 * which the volume alone determines, and the fixed part, which is per payment
 * and so cannot be totalled without inventing a payment count. This is the
 * markup only. Interchange itself varies by card and is never estimated here,
 * which is why the copy beside these numbers says "markup" and not "cost".
 */
export function exampleAccountMarkup(): ExampleMarkup {
  const snapshot = cdgOnlineSnapshots().find((s) => s.id === "cdg_interchange_plus_online");
  if (!snapshot) {
    throw new Error("payments-example: the CDG interchange-plus online rate is missing from the rates module");
  }
  const cardShare = exampleAccount.mix.find((m) => m.rail === "card")?.percent;
  if (cardShare === undefined) {
    throw new Error("payments-example: the example account has no card row to take a markup on");
  }
  const cardVolumeCents = percentFeeCents(exampleAccount.monthlyVolumeCents, cardShare * 100);
  return {
    cardVolumeCents,
    percentMarkupCents: percentFeeCents(cardVolumeCents, snapshot.percentBps),
    fixedPerPaymentCents: snapshot.fixedCents,
    band: cdgPlan("interchangePlus").band,
    formula: formulaLabel(snapshot),
    source: snapshot.source,
  };
}
