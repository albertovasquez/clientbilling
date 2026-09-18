import { NextResponse } from "next/server";
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
    select: { id: true, userId: true },
  });
  if (due.length === 0) {
    return NextResponse.json({ ok: true, flipped: 0 });
  }

  const ids = due.map((d) => d.id);
  await prisma.$transaction([
    prisma.invoice.updateMany({ where: { id: { in: ids } }, data: { status: "overdue" } }),
    prisma.invoiceEvent.createMany({
      data: ids.map((invoiceId) => ({ invoiceId, type: "status_overdue", meta: "cron" })),
    }),
  ]);
  for (const d of due) {
    await recordEvent({ name: "invoice_overdue", userId: d.userId, payload: { invoiceId: d.id } });
  }

  return NextResponse.json({ ok: true, flipped: ids.length });
}
