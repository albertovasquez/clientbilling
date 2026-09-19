import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError } from "@/lib/api-response";
import { sendInvoiceReminder } from "@/lib/invoices/email";

/** POST /api/v1/invoices/:id/remind: send one reminder to the client on file (24 hour cooldown). Requires Idempotency-Key. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;

  return withIdempotency(auth, req, async ({ actor }) => {
    const result = await sendInvoiceReminder(auth.userId, id, actor);
    if (!result.ok) return { error: result.error, status: result.status };
    return { status: 200, body: { ok: true, to: result.to } };
  });
}
