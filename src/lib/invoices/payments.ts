import type { Invoice, Payment, PaymentMethod } from "@prisma/client";
import type { Actor } from "@/lib/billing/actor";
import { userActor } from "@/lib/billing/actor";
import { appendBillingEvent } from "@/lib/billing/events";
import { snapshotInvoice } from "@/lib/billing/versions";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { enqueueWebhook } from "@/lib/webhooks/enqueue";

/**
 * Payment records (decision 0019). The merchant records money they received;
 * ClientBilling never moves funds. `Invoice.paidCents` is the running sum and
 * every write here keeps it in step inside one transaction.
 */

export const paymentMethods: PaymentMethod[] = ["cash", "check", "bank_transfer", "card", "other"];

export function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "Cash",
    check: "Check",
    bank_transfer: "Bank transfer",
    card: "Card",
    other: "Other",
  };
  return labels[method];
}

export function balanceCents(invoice: Pick<Invoice, "totalCents" | "paidCents">): number {
  return Math.max(0, invoice.totalCents - invoice.paidCents);
}

export type PaymentInput = {
  amountCents: number;
  method?: string | null;
  paidOn?: string | Date | null;
  note?: string | null;
};

export type PaymentResult =
  | { ok: true; payment: Payment; invoice: Invoice; actor: Actor }
  | { ok: false; error: string; status: number };

function parseMethod(raw: string | null | undefined): PaymentMethod | null {
  if (!raw) return "other";
  return paymentMethods.includes(raw as PaymentMethod) ? (raw as PaymentMethod) : null;
}

function parsePaidOn(raw: string | Date | null | undefined): Date | null {
  if (!raw) return new Date();
  const d = raw instanceof Date ? raw : new Date(String(raw));
  if (Number.isNaN(d.getTime())) return null;
  if (d.getTime() > Date.now() + 86_400_000) return null;
  return d;
}

/** Record a payment. Full settlement flips the invoice to paid. */
export async function recordPayment(
  userId: string,
  invoiceId: string,
  input: PaymentInput,
  source: "app" | "api",
  actor?: Actor,
): Promise<PaymentResult> {
  const amount = Math.round(Number(input.amountCents));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Amount must be more than zero.", status: 400 };
  }
  const method = parseMethod(input.method);
  if (!method) return { ok: false, error: "Method must be cash, check, bank_transfer, card, or other.", status: 400 };
  const paidOn = parsePaidOn(input.paidOn);
  if (!paidOn) return { ok: false, error: "Payment date is not valid or is in the future.", status: 400 };
  const note = (input.note ?? "").toString().trim().slice(0, 500) || null;

  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoice) return { ok: false, error: "Invoice not found.", status: 404 };
  if (invoice.status === "void") return { ok: false, error: "Void invoices cannot take payments.", status: 409 };
  const balance = balanceCents(invoice);
  if (balance === 0) return { ok: false, error: "This invoice is already paid in full.", status: 409 };
  if (amount > balance) {
    return { ok: false, error: `Amount exceeds the balance due. At most ${balance} cents can be recorded.`, status: 400 };
  }

  const settles = amount === balance;
  const who = actor ?? userActor(userId);
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: { invoiceId: invoice.id, userId, amountCents: amount, method, paidOn, note, source },
    });
    const updated = await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidCents: { increment: amount },
        ...(settles ? { status: "paid", paidAt: paidOn } : {}),
        events: {
          create: {
            type: settles ? "status_paid" : "payment_recorded",
            meta: JSON.stringify({ amountCents: amount, method, source }),
          },
        },
      },
    });
    await appendBillingEvent(tx, {
      userId,
      aggregateType: "invoice",
      aggregateId: invoice.id,
      type: settles ? "paid" : "payment_recorded",
      actor: who,
      payload: { paymentId: payment.id, amountCents: amount, method, source, settles },
    });
    await appendBillingEvent(tx, {
      userId,
      aggregateType: "payment",
      aggregateId: payment.id,
      type: "recorded",
      actor: who,
      payload: { invoiceId: invoice.id, amountCents: amount, method, source },
    });
    await snapshotInvoice(tx, invoice.id, who);
    return { payment, invoice: updated };
  });

  await recordEvent({
    name: settles ? "invoice_paid" : "payment_recorded",
    userId,
    payload: { amountCents: amount, method, partial: !settles, source },
  });
  await enqueueWebhook(
    userId,
    "payment.recorded",
    { invoiceId: invoice.id, paymentId: result.payment.id, amountCents: amount, method, settles },
    who,
  );
  if (settles) {
    await enqueueWebhook(userId, "invoice.paid", { invoiceId: invoice.id, number: invoice.number }, who);
  }
  return { ok: true, ...result, actor: who };
}

/** Remove a payment record. A paid invoice reopens when its balance returns. */
export async function deletePayment(
  userId: string,
  paymentId: string,
  actor?: Actor,
): Promise<{ ok: true; invoice: Invoice; actor: Actor } | { ok: false; error: string; status: number }> {
  const payment = await prisma.payment.findFirst({ where: { id: paymentId, userId }, include: { invoice: true } });
  if (!payment) return { ok: false, error: "Payment not found.", status: 404 };
  const inv = payment.invoice;
  const reopens = inv.status === "paid";
  const reopenedStatus = reopens ? reopenStatus(inv) : inv.status;
  const who = actor ?? userActor(userId);

  const invoice = await prisma.$transaction(async (tx) => {
    await tx.payment.delete({ where: { id: payment.id } });
    const updated = await tx.invoice.update({
      where: { id: inv.id },
      data: {
        paidCents: Math.max(0, inv.paidCents - payment.amountCents),
        ...(reopens ? { status: reopenedStatus, paidAt: null } : {}),
        events: { create: { type: "payment_removed", meta: JSON.stringify({ amountCents: payment.amountCents }) } },
      },
    });
    await appendBillingEvent(tx, {
      userId,
      aggregateType: "invoice",
      aggregateId: inv.id,
      type: "payment_removed",
      actor: who,
      payload: { paymentId: payment.id, amountCents: payment.amountCents, reopened: reopens },
    });
    await appendBillingEvent(tx, {
      userId,
      aggregateType: "payment",
      aggregateId: payment.id,
      type: "removed",
      actor: who,
      payload: { invoiceId: inv.id, amountCents: payment.amountCents },
    });
    await snapshotInvoice(tx, inv.id, who);
    return updated;
  });
  await recordEvent({ name: "payment_removed", userId, payload: { amountCents: payment.amountCents, reopened: reopens } });
  return { ok: true, invoice, actor: who };
}

/** Where a paid invoice goes back to when a payment is removed. */
function reopenStatus(invoice: Invoice): Invoice["status"] {
  if (!invoice.sentAt) return "draft";
  if (invoice.dueDate && invoice.dueDate.getTime() < Date.now()) return "overdue";
  return invoice.viewedAt ? "viewed" : "sent";
}

export function serializePayment(payment: Payment) {
  return {
    id: payment.id,
    invoiceId: payment.invoiceId,
    amountCents: payment.amountCents,
    method: payment.method,
    paidOn: payment.paidOn.toISOString(),
    note: payment.note,
    source: payment.source,
    createdAt: payment.createdAt.toISOString(),
  };
}
