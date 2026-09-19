import { authenticateApiRequest, requireScope } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { parseRawJson, readRawBody } from "@/lib/billing/idempotency";
import { apiError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeInvoice, setInvoiceStatus } from "@/lib/invoices/service";
import type { ApiScope } from "@/lib/api-scopes";

/** POST /api/v1/invoices/:id/status  body: { status: "sent" | "paid" | "void", reason?: string }. Requires Idempotency-Key. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;

  const rawBody = await readRawBody(req);
  const peeked = parseRawJson<{ status?: unknown; reason?: unknown }>(rawBody);
  const status = String(peeked?.status ?? "");
  const needed: ApiScope | null =
    status === "void" ? "invoice:void" : status === "sent" ? "invoice:send" : status === "paid" ? "payment:record" : null;
  if (!needed) return apiError(400, "Status must be sent, paid, or void.");
  const gated = requireScope(auth, needed);
  if (!gated.ok) return apiError(gated.status, gated.error);

  const replayReq = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: rawBody,
  });

  return withIdempotency(gated, replayReq, async ({ body, actor }) => {
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
