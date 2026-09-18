import { prisma } from "@/lib/db";
import { emailEnabled, sendEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { pdfFilename, renderInvoicePdf } from "@/lib/invoices/pdf";
import { openStatuses } from "@/lib/invoices/status";
import { formatCents } from "@/lib/money";
import { payLinkForInvoice } from "@/lib/pay-link";
import { allow } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

/**
 * Outbound invoice email flows shared by the app routes and the API
 * (decisions 0004, 0015, 0017). Recipient is always the client on file.
 */
export type EmailResult = { ok: true; to: string } | { ok: false; status: number; error: string };

const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

async function loadForEmail(userId: string, invoiceId: string) {
  return prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      user: { include: { business: true } },
      events: { where: { type: "reminder_sent" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function sendInvoiceEmail(userId: string, invoiceId: string): Promise<EmailResult> {
  if (!process.env.DATABASE_URL) return { ok: false, status: 503, error: "Invoice database is not configured." };
  if (!emailEnabled()) {
    return { ok: false, status: 503, error: "Email sending is not enabled yet. Copy the public link and share it directly." };
  }
  const invoice = await loadForEmail(userId, invoiceId);
  if (!invoice) return { ok: false, status: 404, error: "Invoice not found." };
  if (invoice.status === "void" || invoice.status === "paid") {
    return { ok: false, status: 400, error: "Paid or void invoices cannot be sent." };
  }
  const to = (invoice.client.email ?? "").trim().toLowerCase();
  if (!to) return { ok: false, status: 400, error: "This client has no email on file. Add one on the client record first." };
  if (!(await allow(`send:${userId}`, 20, 3600))) {
    return { ok: false, status: 429, error: "You have reached the hourly email limit. Copy the link instead, or try again later." };
  }

  const business = invoice.user.business;
  const fromName = business?.name || siteConfig.name;
  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const text = [
    `Hi${invoice.client.name ? ` ${invoice.client.name}` : ""},`,
    "",
    `${fromName} sent you invoice #${invoice.number} for ${formatCents(invoice.totalCents, invoice.currency)}.`,
    `View it here: ${publicUrl}`,
    "A PDF copy is attached.",
    "",
    `Questions about this invoice go to ${business?.email ?? fromName}.`,
    "",
    `Sent with ${siteConfig.name}.`,
  ].join("\n");

  const pdfData = { ...invoice, business };
  let attachments: { filename: string; content: string }[] = [];
  try {
    const pdf = await renderInvoicePdf(pdfData);
    attachments = [{ filename: pdfFilename(pdfData), content: pdf.toString("base64") }];
  } catch (error) {
    console.error("[invoice-send] pdf render failed; sending without attachment", error instanceof Error ? error.message : error);
  }

  const ok = await sendEmail({
    to,
    subject: `Invoice #${invoice.number} from ${fromName}`,
    text,
    replyTo: business?.email || undefined,
    attachments,
  });
  if (!ok) {
    await prisma.invoiceEvent.create({ data: { invoiceId: invoice.id, type: "email_failed", meta: JSON.stringify({ to }) } });
    return { ok: false, status: 502, error: "The email could not be sent. Copy the public link and share it directly." };
  }

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: invoice.status === "draft" ? "sent" : invoice.status,
      sentAt: invoice.sentAt ?? new Date(),
      events: { create: { type: "email_sent", meta: JSON.stringify({ to }) } },
    },
  });
  await recordEvent({ name: "invoice_sent", userId, payload: { via: "email" } });
  return { ok: true, to };
}

export async function sendInvoiceReminder(userId: string, invoiceId: string): Promise<EmailResult> {
  if (!process.env.DATABASE_URL) return { ok: false, status: 503, error: "Invoice database is not configured." };
  if (!emailEnabled()) {
    return { ok: false, status: 503, error: "Email sending is not enabled yet. Copy the public link and follow up directly." };
  }
  const invoice = await loadForEmail(userId, invoiceId);
  if (!invoice) return { ok: false, status: 404, error: "Invoice not found." };
  if (!openStatuses.includes(invoice.status)) {
    return { ok: false, status: 400, error: "Only sent, opened, or overdue invoices can be reminded." };
  }
  const to = (invoice.client.email ?? "").trim().toLowerCase();
  if (!to) return { ok: false, status: 400, error: "This client has no email on file." };
  const last = invoice.events[0]?.createdAt;
  if (last && Date.now() - last.getTime() < REMINDER_COOLDOWN_MS) {
    return { ok: false, status: 429, error: "A reminder went out in the last 24 hours. Give the client a day before the next one." };
  }
  if (!(await allow(`send:${userId}`, 20, 3600))) {
    return { ok: false, status: 429, error: "You have reached the hourly email limit. Try again later." };
  }

  const business = invoice.user.business;
  const fromName = business?.name || siteConfig.name;
  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const dueLine = invoice.dueDate ? `It was due on ${invoice.dueDate.toISOString().slice(0, 10)}.` : "It is due on receipt.";
  const text = [
    `Hi${invoice.client.name ? ` ${invoice.client.name}` : ""},`,
    "",
    `A reminder that invoice #${invoice.number} from ${fromName} for ${formatCents(invoice.totalCents, invoice.currency)} is still open.${invoice.paidCents > 0 ? ` ${formatCents(invoice.totalCents - invoice.paidCents, invoice.currency)} remains due after payments received.` : ""} ${dueLine}`,
    "",
    `View it here: ${publicUrl}`,
    business?.payLinkUrl ? `Pay online: ${payLinkForInvoice(business.payLinkUrl, invoice.totalCents - invoice.paidCents, invoice.currency)}` : null,
    business?.paymentInstructions ? `How to pay: ${business.paymentInstructions}` : null,
    "",
    `If you have already paid, thank you, and please ignore this note. Questions go to ${business?.email ?? fromName}.`,
    "",
    `Sent with ${siteConfig.name}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const ok = await sendEmail({ to, subject: `Reminder: invoice #${invoice.number} from ${fromName}`, text, replyTo: business?.email || undefined });
  if (!ok) return { ok: false, status: 502, error: "The reminder could not be sent. Try again later." };

  await prisma.invoiceEvent.create({ data: { invoiceId: invoice.id, type: "reminder_sent", meta: JSON.stringify({ to }) } });
  await recordEvent({ name: "invoice_reminder_sent", userId });
  return { ok: true, to };
}
