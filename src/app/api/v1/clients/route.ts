import { z } from "zod";
import { authenticateApiRequest, requireScope } from "@/lib/api-keys";
import { withIdempotency } from "@/lib/billing/api-mutate";
import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeClient } from "@/lib/invoices/service";

const createSchema = z.object({
  name: z.string().min(1).max(160),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  company: z.string().max(160).optional().nullable(),
});

/** GET /api/v1/clients: list the caller's clients. */
export async function GET(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const gated = requireScope(auth, "invoice:read");
  if (!gated.ok) return apiError(gated.status, gated.error);
  const clients = await prisma.client.findMany({ where: { userId: auth.userId }, orderBy: { name: "asc" }, take: 500 });
  return apiOk({ clients: clients.map(serializeClient) });
}

/** POST /api/v1/clients: create a client. Requires Idempotency-Key. */
export async function POST(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const gated = requireScope(auth, "invoice:write");
  if (!gated.ok) return apiError(gated.status, gated.error);

  return withIdempotency(gated, req, async ({ body }) => {
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return { error: "name is required; email must be valid if given", status: 400 };
    const client = await prisma.client.create({
      data: {
        userId: auth.userId,
        name: parsed.data.name.trim(),
        email: parsed.data.email?.trim().toLowerCase() || null,
        phone: parsed.data.phone?.trim() || null,
        company: parsed.data.company?.trim() || null,
      },
    });
    return { status: 201, body: { client: serializeClient(client) } };
  });
}
