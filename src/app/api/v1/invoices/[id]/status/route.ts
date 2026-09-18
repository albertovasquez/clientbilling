import { authenticateApiRequest } from "@/lib/api-keys";
import { apiError, apiOk, readJson } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeInvoice, setInvoiceStatus } from "@/lib/invoices/service";

/** POST /api/v1/invoices/:id/status  body: { status: "sent" | "paid" | "void", reason?: string } */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const { id } = await ctx.params;
  const body = await readJson<{ status?: unknown; reason?: unknown }>(req);
  const reason = typeof body?.reason === "string" ? body.reason : undefined;
  const result = await setInvoiceStatus(auth.userId, id, String(body?.status ?? ""), "api", reason);
  if (!result.ok) return apiError(result.status, result.error);
  const full = await prisma.invoice.findUniqueOrThrow({
    where: { id: result.invoice.id },
    include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  return apiOk({ invoice: serializeInvoice(full) });
}
