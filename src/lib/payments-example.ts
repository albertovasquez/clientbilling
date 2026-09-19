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
  /** Card and bank volume over the trailing quarter, as a monthly figure. */
  monthlyVolumeCents: 2_418_000,
  /** How the example account's clients paid. Percentages of the volume above. */
  mix: [
    { label: "Paid by card", percent: 41 },
    { label: "Paid by bank transfer", percent: 52 },
    { label: "Paid by check or cash", percent: 7 },
  ],
  /**
   * Card payments in a month. The fixed part of the markup is charged per
   * payment, so the figure has to be stated rather than assumed: it is the
   * card volume below divided by the example invoice's $2,500, rounded up.
   */
  cardPaymentsPerMonth: 4,
  /** Never present these figures as a quote or a prediction. */
  illustrative: true,
} as const;

export type ExampleMarkup = {
  /** Monthly card volume in cents: the card share of the example's total. */
  cardVolumeCents: number;
  /** What CDG's published interchange-plus markup would come to on that volume. */
  markupCents: number;
  /** CDG's published band for the plan, for example "$10,000 to $200,000 a month". */
  band: string;
  /** The published markup as a person reads it, for example "0.35% + $0.15". */
  formula: string;
  source: RateSource;
};

/**
 * What CDG's published interchange-plus markup would have come to on the
 * example account's card volume. This is the markup only: interchange itself
 * varies by card and is never estimated here, which is why the copy beside
 * this number says "markup" and not "cost".
 */
export function exampleAccountMarkup(): ExampleMarkup {
  const snapshot = cdgOnlineSnapshots().find((s) => s.id === "cdg_interchange_plus_online");
  if (!snapshot) {
    throw new Error("payments-example: the CDG interchange-plus online rate is missing from the rates module");
  }
  const cardShare = exampleAccount.mix.find((m) => m.label === "Paid by card")?.percent ?? 0;
  const cardVolumeCents = percentFeeCents(exampleAccount.monthlyVolumeCents, cardShare * 100);
  const markupCents =
    percentFeeCents(cardVolumeCents, snapshot.percentBps) +
    snapshot.fixedCents * exampleAccount.cardPaymentsPerMonth;
  return {
    cardVolumeCents,
    markupCents,
    band: cdgPlan("interchangePlus").band,
    formula: formulaLabel(snapshot),
    source: snapshot.source,
  };
}
