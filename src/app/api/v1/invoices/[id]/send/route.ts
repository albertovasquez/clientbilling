import { authenticateApiRequest } from "@/lib/api-keys";
import { apiError, apiOk } from "@/lib/api-response";
import { sendInvoiceEmail } from "@/lib/invoices/email";

/** POST /api/v1/invoices/:id/send: email the invoice to the client on file. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;
  const result = await sendInvoiceEmail(auth.userId, id);
  if (!result.ok) return apiError(result.status, result.error);
  return apiOk({ ok: true, to: result.to });
}
