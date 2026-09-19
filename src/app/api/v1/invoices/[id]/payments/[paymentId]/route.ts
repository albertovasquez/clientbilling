import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { deletePayment } from "@/lib/invoices/payments";
import { serializeInvoice } from "@/lib/invoices/service";

/** DELETE /api/v1/invoices/:id/payments/:paymentId. Requires Idempotency-Key. A paid invoice reopens if its balance returns. */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string; paymentId: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id, paymentId } = await ctx.params;

  return withIdempotency(auth, req, async ({ actor }) => {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, invoiceId: id, userId: auth.userId },
      select: { id: true },
    });
    if (!payment) return { error: "Payment not found", status: 404 };
    const result = await deletePayment(auth.userId, paymentId, actor);
    if (!result.ok) return { error: result.error, status: result.status };
    const full = await prisma.invoice.findUniqueOrThrow({
      where: { id: result.invoice.id },
      include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return { status: 200, body: { invoice: serializeInvoice(full) } };
  });
}
