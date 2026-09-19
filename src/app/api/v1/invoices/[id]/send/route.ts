import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError } from "@/lib/api-response";
import { sendInvoiceEmail } from "@/lib/invoices/email";

/** POST /api/v1/invoices/:id/send: email the invoice to the client on file. Requires Idempotency-Key. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;

  return withIdempotency(auth, req, async ({ actor }) => {
    const result = await sendInvoiceEmail(auth.userId, id, actor);
    if (!result.ok) return { error: result.error, status: result.status };
    return { status: 200, body: { ok: true, to: result.to } };
  });
}
