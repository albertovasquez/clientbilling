import { NextResponse } from "next/server";
import { systemActor } from "@/lib/billing/actor";
import { appendBillingEvent } from "@/lib/billing/events";
import { snapshotInvoice } from "@/lib/billing/versions";
import { cronAuthorized } from "@/lib/cron-auth";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { enqueueWebhook } from "@/lib/webhooks/enqueue";

/**
 * Daily overdue sweep (decision 0015). Vercel Cron calls this with
 * `Authorization: Bearer ${CRON_SECRET}`. Without the secret configured the
 * route refuses, so it can never be triggered publicly by accident.
 */
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const now = new Date();
  const due = await prisma.invoice.findMany({
    where: { status: { in: ["sent", "viewed"] }, dueDate: { lt: now } },
    select: { id: true, userId: true, status: true },
  });
  if (due.length === 0) {
    return NextResponse.json({ ok: true, flipped: 0 });
  }

  const actor = systemActor("cron");
  let flipped = 0;
  const failed: string[] = [];
  for (const d of due) {
    // One invoice per transaction, and one bad invoice does not end the sweep.
    // The rest would otherwise wait for tomorrow's run.
    try {
      await prisma.$transaction(async (tx) => {
        await tx.invoice.update({ where: { id: d.id }, data: { status: "overdue" } });
        await tx.invoiceEvent.create({ data: { invoiceId: d.id, type: "status_overdue", meta: "cron" } });
        await appendBillingEvent(tx, {
          userId: d.userId,
          aggregateType: "invoice",
          aggregateId: d.id,
          type: "overdue",
          actor,
          payload: { from: d.status, via: "cron" },
        });
        await snapshotInvoice(tx, d.id, actor);
        await enqueueWebhook(tx, d.userId, "invoice.overdue", { invoiceId: d.id }, actor);
      });
      flipped += 1;
      await recordEvent({ name: "invoice_overdue", userId: d.userId, payload: { invoiceId: d.id } });
    } catch (error) {
      failed.push(d.id);
      console.error("[cron-overdue] invoice failed", d.id, error instanceof Error ? error.message : error);
    }
  }

  // Report what actually happened, not how many were due.
  return NextResponse.json({ ok: true, flipped, ...(failed.length ? { failed: failed.length } : {}) });
}
