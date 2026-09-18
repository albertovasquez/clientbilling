import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";

/** View beacon for public invoices. Unauthenticated by design; it only records a timestamp. */
export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { publicId?: string };
  const publicId = typeof body.publicId === "string" ? body.publicId.slice(0, 32) : "";
  if (!/^[0-9a-z]{6,32}$/.test(publicId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    select: { id: true, userId: true, status: true, viewedAt: true },
  });
  if (!invoice || invoice.viewedAt) return NextResponse.json({ ok: true });

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      viewedAt: new Date(),
      status: invoice.status === "sent" ? "viewed" : invoice.status,
      events: { create: { type: "viewed" } },
    },
  });
  await recordEvent({ name: "invoice_viewed", userId: invoice.userId });
  return NextResponse.json({ ok: true });
}
