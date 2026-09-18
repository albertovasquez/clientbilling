import { z } from "zod";
import { authenticateApiRequest } from "@/lib/api-keys";
import { apiError, apiOk, readJson } from "@/lib/api-response";
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
  const clients = await prisma.client.findMany({ where: { userId: auth.userId }, orderBy: { name: "asc" }, take: 500 });
  return apiOk({ clients: clients.map(serializeClient) });
}

/** POST /api/v1/clients: create a client. */
export async function POST(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  const body = await readJson(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "name is required; email must be valid if given");
  const client = await prisma.client.create({
    data: {
      userId: auth.userId,
      name: parsed.data.name.trim(),
      email: parsed.data.email?.trim().toLowerCase() || null,
      phone: parsed.data.phone?.trim() || null,
      company: parsed.data.company?.trim() || null,
    },
  });
  return apiOk({ client: serializeClient(client) }, 201);
}
