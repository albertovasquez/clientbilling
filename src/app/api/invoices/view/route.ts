import { NextResponse } from "next/server";
import { systemActor } from "@/lib/billing/actor";
import { appendBillingEvent } from "@/lib/billing/events";
import { snapshotInvoice } from "@/lib/billing/versions";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { allow, ipFromHeaders } from "@/lib/rate-limit";
import { enqueueWebhook } from "@/lib/webhooks/enqueue";

/** View beacon for public invoices. Unauthenticated by design; it only records a timestamp. */
export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { publicId?: string };
  const publicId = typeof body.publicId === "string" ? body.publicId.slice(0, 32) : "";
  if (!/^[0-9a-z]{6,32}$/.test(publicId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!(await allow(`view:${ipFromHeaders(req.headers)}`, 60, 60))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    select: { id: true, userId: true, status: true, viewedAt: true },
  });
  // Drafts are private (decision 0020); a beacon for one is ignored.
  if (!invoice || invoice.viewedAt || invoice.status === "draft") return NextResponse.json({ ok: true });

  const actor = systemActor("payer_view");
  await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        viewedAt: new Date(),
        status: invoice.status === "sent" ? "viewed" : invoice.status,
        events: { create: { type: "viewed" } },
      },
    });
    await appendBillingEvent(tx, {
      userId: invoice.userId,
      aggregateType: "invoice",
      aggregateId: invoice.id,
      type: "viewed",
      actor,
      payload: { from: invoice.status },
    });
    await snapshotInvoice(tx, invoice.id, actor);
    await enqueueWebhook(tx, invoice.userId, "invoice.viewed", { invoiceId: invoice.id }, actor);
  });
  await recordEvent({ name: "invoice_viewed", userId: invoice.userId });
  return NextResponse.json({ ok: true });
}
