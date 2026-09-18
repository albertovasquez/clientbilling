/**
 * Pure fee math for /tools/fee-calculator.
 * CDG numbers come only from src/lib/cdg.ts. Competitor presets are labeled
 * ESTIMATE from public fee schedules and must be attributed with SourceNote.
 *
 * Examples (round to cents in formatMoney, not here):
 *   estimateFlatMonthly({ volume: 10000, transactions: 200, percent: 2.9, perTxn: 0.3, monthlyFee: 0 })
 *     => 10000*0.029 + 200*0.3 + 0 = 350
 *   estimateIcPlusMonthly({ volume: 50000, transactions: 1000, interchangePercent: 1.8, markupPercent: 0.35, markupPerTxn: 0.15 })
 *     => 50000*(0.018+0.0035) + 1000*0.15 = 1225
 */

import { cdgPlan } from "@/lib/cdg";

export type Channel = "card_present" | "card_not_present";
export type ProcessorPreset = "stripe" | "square" | "paypal" | "custom";
export type VolumeBand = "flatRate" | "interchangePlus" | "wholesale";

export type FlatFeeSchedule = {
  percent: number;
  perTxn: number;
  monthlyFee: number;
  label: string;
};

export type ProcessorPresetDef = {
  key: ProcessorPreset;
  name: string;
  /** Public schedule rates by channel. ESTIMATE only. */
  rates: Record<Channel, FlatFeeSchedule>;
  source: { label: string; href: string };
  note: string;
};

/** Date competitor public pages were last checked for this calculator. */
export const PROCESSOR_FEES_CHECKED = "2026-09-18";

/**
 * Published flat rates used as ESTIMATES. Confirm against each source page.
 * Square Free plan (no monthly software fee). PayPal standard domestic cards
 * and card-present POS. Stripe standard US online and Terminal card-present.
 */
export const processorPresets: Record<
  Exclude<ProcessorPreset, "custom">,
  ProcessorPresetDef
> = {
  stripe: {
    key: "stripe",
    name: "Stripe",
    rates: {
      card_not_present: {
        percent: 2.9,
        perTxn: 0.3,
        monthlyFee: 0,
        label: "2.9% + $0.30 online (domestic cards)",
      },
      card_present: {
        percent: 2.7,
        perTxn: 0.05,
        monthlyFee: 0,
        label: "2.7% + $0.05 in person (Terminal)",
      },
    },
    source: {
      label: "Stripe pricing",
      href: "https://stripe.com/pricing",
    },
    note: "ESTIMATE from Stripe's public US standard schedule. International cards, keyed entry, and custom plans differ.",
  },
  square: {
    key: "square",
    name: "Square",
    rates: {
      card_not_present: {
        percent: 3.3,
        perTxn: 0.3,
        monthlyFee: 0,
        label: "3.3% + $0.30 online (Square Free)",
      },
      card_present: {
        percent: 2.6,
        perTxn: 0.15,
        monthlyFee: 0,
        label: "2.6% + $0.15 tap, dip, or swipe (Square Free)",
      },
    },
    source: {
      label: "Square pricing",
      href: "https://squareup.com/us/en/pricing",
    },
    note: "ESTIMATE from Square Free plan public fees. Plus and Premium lower processing rates and add a monthly software fee per location.",
  },
  paypal: {
    key: "paypal",
    name: "PayPal",
    rates: {
      card_not_present: {
        percent: 2.99,
        perTxn: 0.49,
        monthlyFee: 0,
        label: "2.99% + $0.49 standard credit and debit cards",
      },
      card_present: {
        percent: 2.29,
        perTxn: 0.09,
        monthlyFee: 0,
        label: "2.29% + $0.09 card-present (PayPal Point of Sale)",
      },
    },
    source: {
      label: "PayPal merchant fees",
      href: "https://www.paypal.com/us/business/paypal-business-fees",
    },
    note: "ESTIMATE from PayPal's US commercial / Point of Sale public fee tables. Checkout, Venmo, and Pay Later use other rates.",
  },
};

/** Default assumed interchange for IC+ illustrations. Not a quote. */
export const DEFAULT_INTERCHANGE: Record<Channel, number> = {
  card_not_present: 1.8,
  card_present: 1.5,
};

export function parsePercentPlusFee(figure: string): {
  percent: number;
  perTxn: number;
} {
  const m = figure.match(/([\d.]+)%\s*\+\s*\$([\d.]+)/);
  if (!m) {
    throw new Error(`Unparseable rate figure: ${figure}`);
  }
  return { percent: Number(m[1]), perTxn: Number(m[2]) };
}

export function parseDollars(text: string): number {
  const m = text.match(/\$([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

/** CDG Flat Rate schedule for a channel, from cdg.ts only. */
export function cdgFlatSchedule(channel: Channel): FlatFeeSchedule {
  const plan = cdgPlan("flatRate");
  const label =
    channel === "card_present" ? "Swiped and mobile" : "Online";
  const rate = plan.rates.find((r) => r.label === label);
  if (!rate) {
    throw new Error(`Missing CDG flat rate for ${label}`);
  }
  const parsed = parsePercentPlusFee(rate.figure);
  return {
    ...parsed,
    monthlyFee: parseDollars(plan.monthlyFee),
    label: `${rate.figure} (${rate.label})`,
  };
}

/** CDG Interchange Plus markup for a channel, from cdg.ts only. */
export function cdgIcPlusMarkup(channel: Channel): {
  percent: number;
  perTxn: number;
  label: string;
} {
  const plan = cdgPlan("interchangePlus");
  const label =
    channel === "card_present"
      ? "Retail, above interchange"
      : "Online, above interchange";
  const rate = plan.rates.find((r) => r.label === label);
  if (!rate) {
    throw new Error(`Missing CDG IC+ markup for ${label}`);
  }
  const parsed = parsePercentPlusFee(rate.figure);
  return { ...parsed, label: rate.figure };
}

export function volumeBand(monthlyVolume: number): VolumeBand {
  if (monthlyVolume < 10_000) return "flatRate";
  if (monthlyVolume < 200_000) return "interchangePlus";
  return "wholesale";
}

export function deriveTransactions(
  volume: number,
  avgTicket: number,
): number {
  if (volume <= 0 || avgTicket <= 0) return 0;
  return volume / avgTicket;
}

export function deriveAvgTicket(volume: number, transactions: number): number {
  if (volume <= 0 || transactions <= 0) return 0;
  return volume / transactions;
}

/**
 * Monthly cost for a flat / blended schedule:
 * volume × (percent/100) + transactions × perTxn + monthlyFee
 */
export function estimateFlatMonthly(input: {
  volume: number;
  transactions: number;
  percent: number;
  perTxn: number;
  monthlyFee?: number;
}): number {
  const { volume, transactions, percent, perTxn, monthlyFee = 0 } = input;
  if (volume < 0 || transactions < 0) return 0;
  return volume * (percent / 100) + transactions * perTxn + monthlyFee;
}

/**
 * When the merchant knows their all-in effective rate %, use volume × rate only.
 */
export function estimateFromEffectiveRate(
  volume: number,
  effectiveRatePercent: number,
): number {
  if (volume < 0 || effectiveRatePercent < 0) return 0;
  return volume * (effectiveRatePercent / 100);
}

/**
 * Illustrative IC+ monthly cost:
 * volume × ((interchange + markup)/100) + transactions × markupPerTxn
 * Interchange is assumed, not quoted.
 */
export function estimateIcPlusMonthly(input: {
  volume: number;
  transactions: number;
  interchangePercent: number;
  markupPercent: number;
  markupPerTxn: number;
}): number {
  const {
    volume,
    transactions,
    interchangePercent,
    markupPercent,
    markupPerTxn,
  } = input;
  if (volume < 0 || transactions < 0) return 0;
  const combined = (interchangePercent + markupPercent) / 100;
  return volume * combined + transactions * markupPerTxn;
}

export function effectiveRatePercent(monthlyCost: number, volume: number): number {
  if (volume <= 0) return 0;
  return (monthlyCost / volume) * 100;
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatMoneyExact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPercent(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export type CalculatorInputs = {
  volume: number;
  /** Average ticket; transactions are derived when both volume and this are set. */
  avgTicket: number;
  channel: Channel;
  processor: ProcessorPreset;
  customPercent: number;
  customPerTxn: number;
  customMonthlyFee: number;
  /** Optional override: known all-in effective rate %. */
  effectiveRateOverride: number | null;
  /** Assumed interchange % for CDG IC+ illustration. */
  assumedInterchange: number;
};

export type SideEstimate = {
  name: string;
  monthlyCost: number;
  effectiveRate: number;
  formula: string;
  planLabel: string;
  disclaimer: string;
};

export type CalculatorResult = {
  volume: number;
  transactions: number;
  avgTicket: number;
  channel: Channel;
  band: VolumeBand;
  current: SideEstimate;
  cdg: SideEstimate;
  wholesaleNote: boolean;
};

export function resolveCurrentSchedule(
  inputs: CalculatorInputs,
): FlatFeeSchedule {
  if (inputs.processor === "custom") {
    return {
      percent: inputs.customPercent,
      perTxn: inputs.customPerTxn,
      monthlyFee: inputs.customMonthlyFee,
      label: `${formatPercent(inputs.customPercent)} + $${inputs.customPerTxn.toFixed(2)}${inputs.customMonthlyFee > 0 ? ` + $${inputs.customMonthlyFee.toFixed(2)}/mo` : ""}`,
    };
  }
  return processorPresets[inputs.processor].rates[inputs.channel];
}

export function runCalculator(inputs: CalculatorInputs): CalculatorResult | null {
  const volume = inputs.volume;
  const avgTicket = inputs.avgTicket;
  if (!(volume > 0) || !(avgTicket > 0)) return null;

  const transactions = deriveTransactions(volume, avgTicket);
  const band = volumeBand(volume);
  const channel = inputs.channel;

  let current: SideEstimate;
  if (
    inputs.effectiveRateOverride != null &&
    inputs.effectiveRateOverride > 0
  ) {
    const monthlyCost = estimateFromEffectiveRate(
      volume,
      inputs.effectiveRateOverride,
    );
    current = {
      name: "Your current processor",
      monthlyCost,
      effectiveRate: effectiveRatePercent(monthlyCost, volume),
      formula: `${formatMoneyExact(volume)} × ${formatPercent(inputs.effectiveRateOverride)}`,
      planLabel: `Effective rate ${formatPercent(inputs.effectiveRateOverride)} (your figure)`,
      disclaimer:
        "Uses the effective rate you entered. It overrides the preset schedule math.",
    };
  } else {
    const schedule = resolveCurrentSchedule(inputs);
    const monthlyCost = estimateFlatMonthly({
      volume,
      transactions,
      percent: schedule.percent,
      perTxn: schedule.perTxn,
      monthlyFee: schedule.monthlyFee,
    });
    const processorName =
      inputs.processor === "custom"
        ? "Custom schedule"
        : processorPresets[inputs.processor].name;
    current = {
      name: processorName,
      monthlyCost,
      effectiveRate: effectiveRatePercent(monthlyCost, volume),
      formula: buildFlatFormula(volume, transactions, schedule),
      planLabel: schedule.label,
      disclaimer:
        "ESTIMATE from a published public schedule (or your custom numbers). Not your statement and not a quote.",
    };
  }

  let cdg: SideEstimate;
  if (band === "flatRate") {
    const schedule = cdgFlatSchedule(channel);
    const monthlyCost = estimateFlatMonthly({
      volume,
      transactions,
      percent: schedule.percent,
      perTxn: schedule.perTxn,
      monthlyFee: schedule.monthlyFee,
    });
    cdg = {
      name: "CDG Flat Rate (illustrative)",
      monthlyCost,
      effectiveRate: effectiveRatePercent(monthlyCost, volume),
      formula: buildFlatFormula(volume, transactions, schedule),
      planLabel: `${schedule.label}, ${cdgPlan("flatRate").monthlyFee}`,
      disclaimer:
        "Illustrative only, using CDG's published flat rates for this channel. Not a quote.",
    };
  } else {
    const markup = cdgIcPlusMarkup(channel);
    const interchange = inputs.assumedInterchange;
    const monthlyCost = estimateIcPlusMonthly({
      volume,
      transactions,
      interchangePercent: interchange,
      markupPercent: markup.percent,
      markupPerTxn: markup.perTxn,
    });
    cdg = {
      name: "CDG Interchange Plus (illustrative)",
      monthlyCost,
      effectiveRate: effectiveRatePercent(monthlyCost, volume),
      formula: `${formatMoneyExact(volume)} × (${formatPercent(interchange)} assumed interchange + ${formatPercent(markup.percent)} markup) + ${transactions.toFixed(0)} × $${markup.perTxn.toFixed(2)}`,
      planLabel: `IC + ${markup.label} (${channel === "card_present" ? "retail" : "online"})`,
      disclaimer:
        "Illustrative only. Interchange is an assumption you can change, not CDG's quote. Card mix changes the real bill.",
    };
  }

  return {
    volume,
    transactions,
    avgTicket,
    channel,
    band,
    current,
    cdg,
    wholesaleNote: band === "wholesale",
  };
}

function buildFlatFormula(
  volume: number,
  transactions: number,
  schedule: FlatFeeSchedule,
): string {
  const parts = [
    `${formatMoneyExact(volume)} × ${formatPercent(schedule.percent)}`,
    `${transactions.toFixed(0)} × $${schedule.perTxn.toFixed(2)}`,
  ];
  if (schedule.monthlyFee > 0) {
    parts.push(`$${schedule.monthlyFee.toFixed(2)} monthly fee`);
  }
  return parts.join(" + ");
}

export function parseProcessorQuery(
  value: string | null | undefined,
): ProcessorPreset | null {
  if (!value) return null;
  const v = value.toLowerCase().trim();
  if (v === "stripe" || v === "square" || v === "paypal" || v === "custom") {
    return v;
  }
  return null;
}
