import { authenticateApiRequest, requireScope } from "@/lib/api-keys";
import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeInvoice } from "@/lib/invoices/service";

/** GET /api/v1/invoices/:id */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const gated = requireScope(auth, "invoice:read");
  if (!gated.ok) return apiError(gated.status, gated.error);
  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: auth.userId },
    include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  if (!invoice) return apiError(404, "Invoice not found");
  return apiOk({ invoice: serializeInvoice(invoice) });
}
