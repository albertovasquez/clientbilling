import type { Actor } from "@/lib/billing/actor";
import { canonicalJson, utcTimestamp } from "@/lib/billing/canonical";
import type { BillingTx } from "@/lib/billing/events";

/**
 * Write an immutable invoice version from the current projection (decision 0025).
 */
export async function snapshotInvoice(tx: BillingTx, invoiceId: string, actor: Actor) {
  const invoice = await tx.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    include: { lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  const last = await tx.invoiceVersion.findFirst({
    where: { invoiceId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  const version = (last?.version ?? 0) + 1;
  const snapshot = canonicalJson({
    id: invoice.id,
    publicId: invoice.publicId,
    number: invoice.number,
    status: invoice.status,
    clientId: invoice.clientId,
    issueDate: utcTimestamp(invoice.issueDate),
    dueDate: invoice.dueDate ? utcTimestamp(invoice.dueDate) : null,
    currency: invoice.currency,
    notes: invoice.notes,
    taxRateBps: invoice.taxRateBps,
    subtotalCents: invoice.subtotalCents,
    taxCents: invoice.taxCents,
    totalCents: invoice.totalCents,
    paidCents: invoice.paidCents,
    voidReason: invoice.voidReason,
    sentAt: invoice.sentAt ? utcTimestamp(invoice.sentAt) : null,
    viewedAt: invoice.viewedAt ? utcTimestamp(invoice.viewedAt) : null,
    paidAt: invoice.paidAt ? utcTimestamp(invoice.paidAt) : null,
    voidedAt: invoice.voidedAt ? utcTimestamp(invoice.voidedAt) : null,
    lineItems: invoice.lineItems.map((l) => ({
      id: l.id,
      description: l.description,
      quantity: Number(l.quantity),
      unitPriceCents: l.unitPriceCents,
      sortOrder: l.sortOrder,
    })),
  });

  return tx.invoiceVersion.create({
    data: {
      invoiceId,
      version,
      snapshot,
      actorType: actor.type,
      actorId: actor.id,
    },
  });
}
