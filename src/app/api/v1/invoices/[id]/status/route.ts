import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeInvoice, setInvoiceStatus } from "@/lib/invoices/service";

/** POST /api/v1/invoices/:id/status  body: { status: "sent" | "paid" | "void", reason?: string }. Requires Idempotency-Key. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;

  return withIdempotency(auth, req, async ({ body, actor }) => {
    const reason = typeof body?.reason === "string" ? body.reason : undefined;
    const result = await setInvoiceStatus(auth.userId, id, String(body?.status ?? ""), "api", reason, actor);
    if (!result.ok) return { error: result.error, status: result.status };
    const full = await prisma.invoice.findUniqueOrThrow({
      where: { id: result.invoice.id },
      include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return { status: 200, body: { invoice: serializeInvoice(full) } };
  });
}
