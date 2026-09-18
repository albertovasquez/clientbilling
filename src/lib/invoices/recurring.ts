import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { sendInvoiceEmail } from "@/lib/invoices/email";
import { advanceDate, parseStoredLines } from "@/lib/invoices/recurring-dates";
import { createInvoice } from "@/lib/invoices/service";

export { advanceDate, cadences, parseStoredLines } from "@/lib/invoices/recurring-dates";

/**
 * Recurring schedules (decision 0018). A daily cron generates one draft per
 * due schedule and advances the next run date by one cadence step. Missed
 * runs catch up one per day rather than all at once.
 */

export type RunResult = { scheduleId: string; invoiceId?: string; sent?: boolean; error?: string };

/** Generate one invoice for a single schedule and advance it. */
export async function runSchedule(scheduleId: string, now = new Date()): Promise<RunResult> {
  const schedule = await prisma.recurringSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || !schedule.active) return { scheduleId, error: "Schedule not found or paused." };

  const lines = parseStoredLines(schedule.linesJson);
  if (lines.length === 0) return { scheduleId, error: "Schedule has no line items." };

  const dueDate = new Date(now.getTime() + schedule.dueInDays * 86_400_000);
  const created = await createInvoice({
    userId: schedule.userId,
    clientId: schedule.clientId,
    lines,
    taxRateBps: schedule.taxRateBps,
    dueDate,
    notes: schedule.notes,
    source: "recurring",
    recurringScheduleId: schedule.id,
  });
  if (!created.ok) {
    await recordEvent({ name: "recurring_failed", userId: schedule.userId, payload: { scheduleId, error: created.error } });
    return { scheduleId, error: created.error };
  }

  await prisma.recurringSchedule.update({
    where: { id: schedule.id },
    data: { nextRunAt: advanceDate(schedule.nextRunAt, schedule.cadence), lastRunAt: now },
  });

  let sent = false;
  if (schedule.autoSend) {
    const result = await sendInvoiceEmail(schedule.userId, created.invoice.id);
    sent = result.ok;
  }
  await recordEvent({ name: "recurring_run", userId: schedule.userId, payload: { scheduleId, invoiceId: created.invoice.id, sent } });
  return { scheduleId, invoiceId: created.invoice.id, sent };
}

/** Run every active schedule whose next run is due. One invoice per schedule per call. */
export async function runDueSchedules(now = new Date()): Promise<RunResult[]> {
  const due = await prisma.recurringSchedule.findMany({
    where: { active: true, nextRunAt: { lte: now } },
    select: { id: true },
    take: 500,
  });
  const results: RunResult[] = [];
  for (const s of due) {
    results.push(await runSchedule(s.id, now));
  }
  return results;
}
