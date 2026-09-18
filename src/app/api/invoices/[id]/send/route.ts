import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

type Body = { to?: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 503 },
    );
  }

  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true, user: { include: { business: true } } },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const to = (body.to || invoice.client.email || "").trim().toLowerCase();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Valid recipient email required." }, { status: 400 });
  }

  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const fromName = invoice.user.business?.name || siteConfig.name;
  const subject = `Invoice #${invoice.number} from ${fromName}`;
  const text = [
    `Hi${invoice.client.name ? ` ${invoice.client.name}` : ""},`,
    "",
    `${fromName} sent you invoice #${invoice.number}.`,
    `View and print: ${publicUrl}`,
    "",
    "Card payments, when enabled, are collected through CDG Commerce Quantum. ClientBilling does not store card numbers.",
  ].join("\n");

  await prisma.invoiceEvent.create({
    data: {
      invoiceId: invoice.id,
      type: "email_attempt",
      meta: JSON.stringify({ to, hasResend: Boolean(process.env.RESEND_API_KEY) }),
    },
  });

  if (invoice.status === "draft") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "sent",
        sentAt: invoice.sentAt ?? new Date(),
        events: { create: { type: "status_sent", meta: "via_email_attempt" } },
      },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[invoice-send] stub", { to, publicUrl, subject });
    return NextResponse.json({ ok: true, mode: "stub", publicUrl });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "ClientBilling <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[invoice-send] resend failed", errText);
    return NextResponse.json(
      { error: "Resend API error. Use copy link for now.", mode: "stub", publicUrl },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, mode: "resend", publicUrl });
}
