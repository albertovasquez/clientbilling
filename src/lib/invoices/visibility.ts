import type { Invoice } from "@prisma/client";

/**
 * Who may open an invoice by its public id (decisions 0008, 0020). Void
 * invoices are never shown. Drafts are shown only to their owner, so a link
 * copied before sending does not expose work in progress.
 */
export function publicInvoiceVisible(invoice: Pick<Invoice, "status" | "userId">, viewerUserId?: string | null): boolean {
  if (invoice.status === "void") return false;
  if (invoice.status === "draft") return Boolean(viewerUserId) && viewerUserId === invoice.userId;
  return true;
}
