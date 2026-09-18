import type { RecurringCadence } from "@prisma/client";
import type { NewLine } from "@/lib/invoices/service";

/** Pure helpers for recurring schedules (decision 0018). No database, no email, no PDF. */

export const cadences: { value: RecurringCadence; label: string }[] = [
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
  { value: "quarterly", label: "Every quarter" },
  { value: "yearly", label: "Every year" },
];

/** Advance a UTC date by one cadence step, clamping the day of month. */
export function advanceDate(date: Date, cadence: RecurringCadence): Date {
  const d = new Date(date.getTime());
  if (cadence === "weekly") {
    d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  const months = cadence === "monthly" ? 1 : cadence === "quarterly" ? 3 : 12;
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}

export function parseStoredLines(linesJson: string): NewLine[] {
  try {
    const raw = JSON.parse(linesJson) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((l): l is NewLine => typeof l === "object" && l !== null && "description" in l && "quantity" in l && "unitPriceCents" in l)
      .map((l) => ({ description: String(l.description), quantity: Number(l.quantity), unitPriceCents: Number(l.unitPriceCents) }));
  } catch {
    return [];
  }
}
