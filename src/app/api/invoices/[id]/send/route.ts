import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { formatCents } from "@/lib/money";
import { allow } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

/**
 * Email the public invoice link to the client on file (decision 0004).
 * The recipient is never taken from the request. Status becomes "sent" only
 * when the provider accepts the message.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Invoice database is not configured." }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email sending is not enabled yet. Copy the public link and share it directly.", mode: "disabled" },
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
  if (invoice.status === "void" || invoice.status === "paid") {
    return NextResponse.json({ error: "Paid or void invoices cannot be sent." }, { status: 400 });
  }

  const to = (invoice.client.email ?? "").trim().toLowerCase();
  if (!to) {
    return NextResponse.json(
      { error: "This client has no email on file. Add one on the client record first.", mode: "no_recipient" },
      { status: 400 },
    );
  }

  if (!(await allow(`send:${session.user.id}`, 20, 3600))) {
    return NextResponse.json(
      { error: "You have reached the hourly email limit. Copy the link instead, or try again later." },
      { status: 429 },
    );
  }

  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const fromName = invoice.user.business?.name || siteConfig.name;
  const subject = `Invoice #${invoice.number} from ${fromName}`;
  const text = [
    `Hi${invoice.client.name ? ` ${invoice.client.name}` : ""},`,
    "",
    `${fromName} sent you invoice #${invoice.number} for ${formatCents(invoice.totalCents, invoice.currency)}.`,
    `View and print it here: ${publicUrl}`,
    "",
    `Questions about this invoice go to ${invoice.user.business?.email ?? fromName}.`,
    "",
    `Sent with ${siteConfig.name}.`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: invoice.user.business?.email || undefined,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[invoice-send] resend failed", res.status, errText.slice(0, 300));
    await prisma.invoiceEvent.create({
      data: { invoiceId: invoice.id, type: "email_failed", meta: JSON.stringify({ to, status: res.status }) },
    });
    return NextResponse.json(
      { error: "The email could not be sent. Copy the public link and share it directly.", mode: "failed" },
      { status: 502 },
    );
  }

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: invoice.status === "draft" ? "sent" : invoice.status,
      sentAt: invoice.sentAt ?? new Date(),
      events: { create: { type: "email_sent", meta: JSON.stringify({ to }) } },
    },
  });
  await recordEvent({ name: "invoice_sent", userId: session.user.id, payload: { via: "email" } });

  return NextResponse.json({ ok: true, mode: "sent", to, publicUrl });
}
