import { CDG_CHECKED } from "@/lib/cdg";
import {
  bankTransferSnapshot,
  cdgOnlineSnapshots,
  paymentCosts,
  type PaymentCost,
  type RateSnapshot,
} from "@/lib/payment-costs";

/**
 * The example invoice on the homepage (spec #41, ticket #44). Fictional
 * parties and a round amount; the cost rows come from the calculator with
 * CDG's published online card rates and an example ACH fee that a merchant's
 * own setting replaces in epic #32.
 */
export const exampleInvoice = {
  number: "1042",
  from: "Northgate Plumbing",
  to: "Harbor Lane Dental",
  amountCents: 250000,
  achFeeCents: 100,
} as const;

/** The visitor may edit the amount within these bounds. */
export const AMOUNT_MIN_CENTS = 100;
export const AMOUNT_MAX_CENTS = 100_000_000;

/**
 * Parses what a visitor typed as a dollar amount. Accepts digits, one decimal
 * point, and any dollar signs, commas, or spaces; returns integer cents, or
 * null when the text is not a plain number or is outside the bounds.
 */
export function parseAmountInput(text: string): number | null {
  const cleaned = text.replace(/[$,\s]/g, "");
  if (!/^\d*(\.\d*)?$/.test(cleaned) || !/\d/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  if (!Number.isFinite(cents) || cents < AMOUNT_MIN_CENTS || cents > AMOUNT_MAX_CENTS) return null;
  return cents;
}

/** CDG's published online card rates plus the example ACH fee. */
export function exampleInvoiceSnapshots(): RateSnapshot[] {
  return [
    ...cdgOnlineSnapshots(),
    bankTransferSnapshot(exampleInvoice.achFeeCents, { example: true, asOf: CDG_CHECKED }),
  ];
}

export function exampleInvoiceCosts(amountCents: number): PaymentCost[] {
  return paymentCosts(amountCents, exampleInvoiceSnapshots());
}
