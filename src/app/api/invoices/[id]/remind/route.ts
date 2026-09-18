import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { emailEnabled, sendEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { openStatuses } from "@/lib/invoices/status";
import { formatCents } from "@/lib/money";
import { allow } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Send a payment reminder to the client on file (decision 0015). Manual only,
 * one per invoice per 24 hours, shares the hourly email limit with sends.
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
  if (!emailEnabled()) {
    return NextResponse.json(
      { error: "Email sending is not enabled yet. Copy the public link and follow up directly." },
      { status: 503 },
    );
  }

  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      user: { include: { business: true } },
      events: { where: { type: "reminder_sent" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (!openStatuses.includes(invoice.status)) {
    return NextResponse.json({ error: "Only sent, opened, or overdue invoices can be reminded." }, { status: 400 });
  }
  const to = (invoice.client.email ?? "").trim().toLowerCase();
  if (!to) {
    return NextResponse.json({ error: "This client has no email on file." }, { status: 400 });
  }
  const last = invoice.events[0]?.createdAt;
  if (last && Date.now() - last.getTime() < COOLDOWN_MS) {
    return NextResponse.json(
      { error: "A reminder went out in the last 24 hours. Give the client a day before the next one." },
      { status: 429 },
    );
  }
  if (!(await allow(`send:${session.user.id}`, 20, 3600))) {
    return NextResponse.json({ error: "You have reached the hourly email limit. Try again later." }, { status: 429 });
  }

  const business = invoice.user.business;
  const fromName = business?.name || siteConfig.name;
  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const dueLine = invoice.dueDate
    ? `It was due on ${invoice.dueDate.toISOString().slice(0, 10)}.`
    : "It is due on receipt.";
  const text = [
    `Hi${invoice.client.name ? ` ${invoice.client.name}` : ""},`,
    "",
    `A reminder that invoice #${invoice.number} from ${fromName} for ${formatCents(invoice.totalCents, invoice.currency)} is still open. ${dueLine}`,
    "",
    `View it here: ${publicUrl}`,
    business?.payLinkUrl ? `Pay online: ${business.payLinkUrl}` : null,
    business?.paymentInstructions ? `How to pay: ${business.paymentInstructions}` : null,
    "",
    `If you have already paid, thank you, and please ignore this note. Questions go to ${business?.email ?? fromName}.`,
    "",
    `Sent with ${siteConfig.name}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const ok = await sendEmail({
    to,
    subject: `Reminder: invoice #${invoice.number} from ${fromName}`,
    text,
    replyTo: business?.email || undefined,
  });
  if (!ok) {
    return NextResponse.json({ error: "The reminder could not be sent. Try again later." }, { status: 502 });
  }

  await prisma.invoiceEvent.create({ data: { invoiceId: invoice.id, type: "reminder_sent", meta: JSON.stringify({ to }) } });
  await recordEvent({ name: "invoice_reminder_sent", userId: session.user.id });
  return NextResponse.json({ ok: true, to });
}
