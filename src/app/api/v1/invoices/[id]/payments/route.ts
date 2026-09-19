import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { recordPayment, serializePayment } from "@/lib/invoices/payments";
import { serializeInvoice } from "@/lib/invoices/service";

/** GET /api/v1/invoices/:id/payments */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findFirst({ where: { id, userId: auth.userId }, select: { id: true } });
  if (!invoice) return apiError(404, "Invoice not found");
  const payments = await prisma.payment.findMany({ where: { invoiceId: id }, orderBy: { paidOn: "desc" } });
  return apiOk({ payments: payments.map(serializePayment) });
}

/**
 * POST /api/v1/invoices/:id/payments
 * body: { amountCents: 12500, method?: "bank_transfer", paidOn?: "2026-09-18", note?: "..." }
 * Requires Idempotency-Key. Paying the full balance flips the invoice to paid.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;

  return withIdempotency(auth, req, async ({ body, actor }) => {
    if (!body) return { error: "Body must be JSON", status: 400 };
    const result = await recordPayment(
      auth.userId,
      id,
      {
        amountCents: Number(body.amountCents),
        method: body.method == null ? null : String(body.method),
        paidOn: body.paidOn == null ? null : String(body.paidOn),
        note: body.note == null ? null : String(body.note),
      },
      "api",
      actor,
    );
    if (!result.ok) return { error: result.error, status: result.status };
    const full = await prisma.invoice.findUniqueOrThrow({
      where: { id: result.invoice.id },
      include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return {
      status: 201,
      body: { payment: serializePayment(result.payment), invoice: serializeInvoice(full) },
    };
  });
}
