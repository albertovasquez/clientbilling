import type { InvoiceStatus } from "@prisma/client";
import { z } from "zod";
import { authenticateApiRequest } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { createInvoice, parseDueDate, parseLines, serializeInvoice } from "@/lib/invoices/service";
import { percentToBps } from "@/lib/money";

const statuses: InvoiceStatus[] = ["draft", "sent", "viewed", "overdue", "paid", "void"];

const createSchema = z.object({
  clientId: z.string().optional().nullable(),
  newClient: z.object({ name: z.string().min(1).max(160), email: z.string().email().optional().nullable() }).optional().nullable(),
  lines: z.array(z.object({ description: z.string(), quantity: z.union([z.number(), z.string()]).optional(), unitPrice: z.union([z.number(), z.string()]) })).min(1),
  taxRate: z.union([z.number(), z.string()]).optional(),
  dueDate: z.string().optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
});

/** GET /api/v1/invoices?status=overdue: list the caller's invoices, newest first. */
export async function GET(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  if (status && !statuses.includes(status as InvoiceStatus)) return apiError(400, `status must be one of ${statuses.join(", ")}`);
  const invoices = await prisma.invoice.findMany({
    where: { userId: auth.userId, ...(status ? { status: status as InvoiceStatus } : {}) },
    include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return apiOk({ invoices: invoices.map(serializeInvoice) });
}

/** POST /api/v1/invoices: create a draft invoice. Requires Idempotency-Key. */
export async function POST(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);

  return withIdempotency(auth, req, async ({ body, actor }) => {
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return { error: "lines[] with description and unitPrice is required; clientId or newClient.name is required", status: 400 };
    }

    const lines = parseLines(parsed.data.lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice })));
    if (!lines.ok) return { error: lines.error, status: 400 };

    const result = await createInvoice({
      userId: auth.userId,
      clientId: parsed.data.clientId ?? null,
      newClient: parsed.data.newClient
        ? { name: parsed.data.newClient.name, email: parsed.data.newClient.email?.toLowerCase() ?? null }
        : null,
      lines: lines.lines,
      taxRateBps: percentToBps(parsed.data.taxRate ?? 0),
      dueDate: parseDueDate(parsed.data.dueDate),
      notes: parsed.data.notes?.trim().slice(0, 4000) || null,
      source: "api",
      actor,
    });
    if (!result.ok) return { error: result.error, status: result.status };

    const full = await prisma.invoice.findUniqueOrThrow({
      where: { id: result.invoice.id },
      include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return { status: 201, body: { invoice: serializeInvoice(full) } };
  });
}
