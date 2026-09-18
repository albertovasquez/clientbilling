import type { Client, Invoice, InvoiceLineItem, InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { newPublicInvoiceId } from "@/lib/invoices/ids";
import { balanceCents, recordPayment } from "@/lib/invoices/payments";
import { canTransition } from "@/lib/invoices/status";
import { computeInvoiceTotals, dollarsToCents, normalizeQuantity } from "@/lib/money";
import { siteConfig } from "@/lib/site";

/**
 * Invoice domain operations shared by the app's server actions and the API
 * (decision 0017). One implementation of numbering, validation, and status rules.
 */

export type NewLine = { description: string; quantity: number; unitPriceCents: number };

export type LinesResult = { ok: true; lines: NewLine[] } | { ok: false; error: string };

/** Validate raw line inputs (strings from a form or JSON) into cents and normalized quantities. */
export function parseLines(raw: { description: unknown; quantity: unknown; unitPrice: unknown }[]): LinesResult {
  const lines: NewLine[] = [];
  for (const item of raw) {
    const description = String(item.description ?? "").trim();
    if (!description) continue;
    const quantity = normalizeQuantity(item.quantity == null || item.quantity === "" ? 1 : (item.quantity as string | number));
    const unitPriceCents = dollarsToCents((item.unitPrice ?? 0) as string | number);
    if (quantity <= 0) return { ok: false, error: `Quantity for "${description}" must be greater than zero.` };
    if (unitPriceCents < 0) return { ok: false, error: `Unit price for "${description}" cannot be negative.` };
    lines.push({ description: description.slice(0, 500), quantity, unitPriceCents });
  }
  if (lines.length === 0) return { ok: false, error: "Add at least one line item." };
  return { ok: true, lines };
}

export function parseDueDate(raw: unknown): Date | null {
  if (!raw) return null;
  const d = new Date(String(raw));
  return Number.isNaN(d.getTime()) ? null : d;
}

export type CreateInvoiceInput = {
  userId: string;
  clientId?: string | null;
  newClient?: { name: string; email: string | null } | null;
  lines: NewLine[];
  taxRateBps: number;
  dueDate: Date | null;
  notes: string | null;
  source: "app" | "api" | "recurring";
  recurringScheduleId?: string | null;
};

export type CreateInvoiceResult = { ok: true; invoice: Invoice } | { ok: false; error: string; status: number };

export async function createInvoice(input: CreateInvoiceInput): Promise<CreateInvoiceResult> {
  const business = await prisma.businessProfile.findUnique({ where: { userId: input.userId } });
  if (!business) return { ok: false, error: "Set up your business profile first.", status: 409 };
  if (input.taxRateBps < 0 || input.taxRateBps > 10_000) {
    return { ok: false, error: "Tax rate must be between 0% and 100%.", status: 400 };
  }

  let clientId = input.clientId?.trim() || null;
  if (!clientId && !input.newClient?.name) {
    return { ok: false, error: "Pick a client, or create a new one with a name.", status: 400 };
  }
  if (clientId) {
    const existing = await prisma.client.findFirst({ where: { id: clientId, userId: input.userId }, select: { id: true } });
    if (!existing) return { ok: false, error: "Client not found.", status: 404 };
  }

  const totals = computeInvoiceTotals(input.lines, input.taxRateBps);
  const publicId = newPublicInvoiceId();

  const invoice = await prisma.$transaction(async (tx) => {
    if (!clientId && input.newClient) {
      const created = await tx.client.create({
        data: { userId: input.userId, name: input.newClient.name.slice(0, 160), email: input.newClient.email },
      });
      clientId = created.id;
    }
    // Atomic increment inside the transaction so concurrent creates never share a number.
    const counter = await tx.businessProfile.update({
      where: { id: business.id },
      data: { nextInvoiceNumber: { increment: 1 } },
      select: { nextInvoiceNumber: true },
    });
    return tx.invoice.create({
      data: {
        publicId,
        userId: input.userId,
        clientId: clientId as string,
        number: String(counter.nextInvoiceNumber - 1),
        status: "draft",
        dueDate: input.dueDate,
        notes: input.notes,
        taxRateBps: input.taxRateBps,
        ...totals,
        lineItems: {
          create: input.lines.map((line, index) => ({
            description: line.description,
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
            sortOrder: index,
          })),
        },
        recurringScheduleId: input.recurringScheduleId ?? null,
        events: { create: { type: "created", meta: input.source } },
      },
    });
  });

  await recordEvent({ name: "invoice_created", userId: input.userId, payload: { totalCents: invoice.totalCents, source: input.source } });
  return { ok: true, invoice };
}

export type StatusResult =
  | { ok: true; invoice: Invoice }
  | { ok: false; error: string; status: number; code: "not_found" | "transition" | "invalid" };

const manualStatuses: InvoiceStatus[] = ["sent", "paid", "void"];

export async function setInvoiceStatus(
  userId: string,
  invoiceId: string,
  status: string,
  source: "app" | "api",
): Promise<StatusResult> {
  if (!manualStatuses.includes(status as InvoiceStatus)) {
    return { ok: false, error: "Status must be sent, paid, or void.", status: 400, code: "invalid" };
  }
  const target = status as InvoiceStatus;
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoice) return { ok: false, error: "Invoice not found.", status: 404, code: "not_found" };
  if (!canTransition(invoice.status, target)) {
    return { ok: false, error: `Cannot move an invoice from ${invoice.status} to ${target}.`, status: 409, code: "transition" };
  }
  // Marking paid records the balance as a payment so totals reconcile (decision 0019).
  if (target === "paid" && balanceCents(invoice) > 0) {
    const paid = await recordPayment(userId, invoice.id, { amountCents: balanceCents(invoice), method: "other", note: "Marked paid" }, source);
    if (!paid.ok) return { ok: false, error: paid.error, status: paid.status, code: "invalid" };
    return { ok: true, invoice: paid.invoice };
  }
  const now = new Date();
  const updated = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: target,
      sentAt: target === "sent" ? (invoice.sentAt ?? now) : invoice.sentAt,
      paidAt: target === "paid" ? now : invoice.paidAt,
      voidedAt: target === "void" ? now : invoice.voidedAt,
      events: { create: { type: `status_${target}`, meta: source } },
    },
  });
  await recordEvent({ name: `invoice_${target}`, userId, payload: { manual: true, source } });
  return { ok: true, invoice: updated };
}

/** JSON shape for the API. camelCase, cents as integers, dates as ISO strings. */
export function serializeInvoice(
  invoice: Invoice & { client: Pick<Client, "id" | "name" | "email">; lineItems: InvoiceLineItem[] },
) {
  return {
    id: invoice.id,
    number: invoice.number,
    publicId: invoice.publicId,
    publicUrl: `${siteConfig.url}/i/${invoice.publicId}`,
    pdfUrl: `${siteConfig.url}/i/${invoice.publicId}/pdf`,
    status: invoice.status,
    client: { id: invoice.client.id, name: invoice.client.name, email: invoice.client.email },
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
    currency: invoice.currency,
    taxRateBps: invoice.taxRateBps,
    subtotalCents: invoice.subtotalCents,
    taxCents: invoice.taxCents,
    totalCents: invoice.totalCents,
    paidCents: invoice.paidCents,
    balanceCents: balanceCents(invoice),
    notes: invoice.notes,
    lineItems: invoice.lineItems.map((l) => ({
      id: l.id,
      description: l.description,
      quantity: Number(l.quantity),
      unitPriceCents: l.unitPriceCents,
    })),
    sentAt: invoice.sentAt?.toISOString() ?? null,
    viewedAt: invoice.viewedAt?.toISOString() ?? null,
    paidAt: invoice.paidAt?.toISOString() ?? null,
    voidedAt: invoice.voidedAt?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}

export function serializeClient(client: Client) {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    createdAt: client.createdAt.toISOString(),
  };
}
