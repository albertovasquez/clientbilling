import { authenticateApiRequest, requireScope } from "@/lib/api-keys";
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
    const status = String(body?.status ?? "");
    const needed = status === "void" ? "invoice:void" : status === "sent" ? "invoice:send" : status === "paid" ? "payment:record" : null;
    if (!needed) return { error: "Status must be sent, paid, or void.", status: 400 };
    const gated = requireScope(auth, needed);
    if (!gated.ok) return { error: gated.error, status: gated.status };
    const reason = typeof body?.reason === "string" ? body.reason : undefined;
    const result = await setInvoiceStatus(auth.userId, id, status, "api", reason, actor);
    if (!result.ok) return { error: result.error, status: result.status };
    const full = await prisma.invoice.findUniqueOrThrow({
      where: { id: result.invoice.id },
      include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return { status: 200, body: { invoice: serializeInvoice(full) } };
  });
}
