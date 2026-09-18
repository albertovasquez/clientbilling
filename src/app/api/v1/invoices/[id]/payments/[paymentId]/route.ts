import { authenticateApiRequest } from "@/lib/api-keys";
import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { deletePayment } from "@/lib/invoices/payments";
import { serializeInvoice } from "@/lib/invoices/service";

/** DELETE /api/v1/invoices/:id/payments/:paymentId. A paid invoice reopens if its balance returns. */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string; paymentId: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id, paymentId } = await ctx.params;
  const payment = await prisma.payment.findFirst({ where: { id: paymentId, invoiceId: id, userId: auth.userId }, select: { id: true } });
  if (!payment) return apiError(404, "Payment not found");
  const result = await deletePayment(auth.userId, paymentId);
  if (!result.ok) return apiError(result.status, result.error);
  const full = await prisma.invoice.findUniqueOrThrow({
    where: { id: result.invoice.id },
    include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  return apiOk({ invoice: serializeInvoice(full) });
}
