import { NextResponse } from "next/server";
import { systemActor } from "@/lib/billing/actor";
import { appendBillingEvent } from "@/lib/billing/events";
import { snapshotInvoice } from "@/lib/billing/versions";
import { cronAuthorized } from "@/lib/cron-auth";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";

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
  for (const d of due) {
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
    });
    await recordEvent({ name: "invoice_overdue", userId: d.userId, payload: { invoiceId: d.id } });
  }

  return NextResponse.json({ ok: true, flipped: due.length });
}
