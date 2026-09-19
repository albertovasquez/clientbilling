import { systemActor } from "@/lib/billing/actor";
import { daysPastDue } from "@/lib/invoices/aging";
import {
  nextAutoReminderKind,
  type AutoReminderKind,
} from "@/lib/invoices/auto-reminder-kinds";
import { sendInvoiceReminder } from "@/lib/invoices/email";
import { openStatuses } from "@/lib/invoices/status";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";

export type { AutoReminderKind } from "@/lib/invoices/auto-reminder-kinds";
export { nextAutoReminderKind } from "@/lib/invoices/auto-reminder-kinds";

/**
 * Opt-in automatic reminders (decision 0015). Same email body and recipient
 * rules as the manual reminder. +3 and +10 each fire at most once per invoice.
 * Missed days catch up one step at a time (3 before 10).
 */

export type AutoReminderResult = {
  invoiceId: string;
  kind?: AutoReminderKind;
  sent?: boolean;
  error?: string;
};

export async function runDueAutoReminders(now = new Date()): Promise<AutoReminderResult[]> {
  const candidates = await prisma.invoice.findMany({
    where: {
      status: { in: [...openStatuses] },
      dueDate: { not: null, lte: now },
      user: { business: { autoReminders: true } },
      client: { email: { not: null } },
    },
    select: {
      id: true,
      userId: true,
      dueDate: true,
      events: {
        where: { type: { in: ["reminder_auto_3", "reminder_auto_10"] } },
        select: { type: true },
      },
    },
    take: 200,
    orderBy: { dueDate: "asc" },
  });

  const results: AutoReminderResult[] = [];
  for (const invoice of candidates) {
    if (!invoice.dueDate) continue;
    const days = daysPastDue(invoice.dueDate, now);
    const sentKinds = new Set<AutoReminderKind>();
    for (const event of invoice.events) {
      if (event.type === "reminder_auto_3") sentKinds.add(3);
      if (event.type === "reminder_auto_10") sentKinds.add(10);
    }
    const kind = nextAutoReminderKind(days, sentKinds);
    if (!kind) continue;

    const sent = await sendInvoiceReminder(invoice.userId, invoice.id, systemActor("cron"));
    if (!sent.ok) {
      results.push({ invoiceId: invoice.id, kind, error: sent.error });
      await recordEvent({
        name: "invoice_reminder_auto_failed",
        userId: invoice.userId,
        payload: { invoiceId: invoice.id, kind, error: sent.error, status: sent.status },
      });
      continue;
    }

    await prisma.invoiceEvent.create({
      data: { invoiceId: invoice.id, type: `reminder_auto_${kind}`, meta: JSON.stringify({ to: sent.to, via: "cron" }) },
    });
    await recordEvent({
      name: "invoice_reminder_auto_sent",
      userId: invoice.userId,
      payload: { invoiceId: invoice.id, kind },
    });
    results.push({ invoiceId: invoice.id, kind, sent: true });
  }
  return results;
}
