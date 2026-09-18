/**
 * Pure selection for opt-in automatic reminders (decision 0015).
 * Kept free of email/PDF imports so scripts can unit-test it without
 * loading @react-pdf.
 */

export type AutoReminderKind = 3 | 10;

export function nextAutoReminderKind(
  daysPast: number,
  sentKinds: Set<AutoReminderKind>,
): AutoReminderKind | null {
  if (daysPast >= 3 && !sentKinds.has(3)) return 3;
  if (daysPast >= 10 && !sentKinds.has(10)) return 10;
  return null;
}
