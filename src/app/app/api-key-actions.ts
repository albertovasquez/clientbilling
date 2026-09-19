"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateApiKey } from "@/lib/api-keys";
import { ALL_SCOPES_STRING, API_SCOPES, parseScopes } from "@/lib/api-scopes";
import { assertDatabase, prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { requireUser } from "@/lib/session";
import { generateWebhookSecret } from "@/lib/webhooks/sign";

export type ApiKeyState = { error?: string; rawKey?: string; name?: string; webhookSecret?: string };

/** Create a personal API key. The raw key is returned once and never stored. */
export async function createApiKeyAction(_prev: ApiKeyState, formData: FormData): Promise<ApiKeyState> {
  const user = await requireUser();
  try {
    assertDatabase();
  } catch {
    return { error: "Not available right now." };
  }
  const parsed = z.string().min(1).max(60).safeParse(String(formData.get("name") ?? "").trim());
  if (!parsed.success) return { error: "Give the key a short name, like 'ops agent'." };
  const active = await prisma.apiKey.count({ where: { userId: user.id, revokedAt: null } });
  if (active >= 10) return { error: "You have ten active keys. Revoke one first." };

  const selected = formData.getAll("scope").map(String);
  const scopes = selected.length > 0 ? parseScopes(selected.join(" ")) : parseScopes(ALL_SCOPES_STRING);
  if (scopes.size === 0) return { error: "Pick at least one scope." };
  const serviceAccountId = String(formData.get("serviceAccountId") ?? "").trim() || null;
  if (serviceAccountId) {
    const sa = await prisma.serviceAccount.findFirst({
      where: { id: serviceAccountId, userId: user.id, revokedAt: null },
      select: { id: true },
    });
    if (!sa) return { error: "Service account not found." };
  }

  const { raw, hash, prefix } = generateApiKey();
  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: parsed.data,
      keyHash: hash,
      prefix,
      scopes: [...scopes].join(" "),
      serviceAccountId,
    },
  });
  await recordEvent({ name: "api_key_created", userId: user.id });
  revalidatePath("/app/settings/api");
  return { rawKey: raw, name: parsed.data };
}

export async function createServiceAccountAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  if (!name) return;
  await prisma.serviceAccount.create({ data: { userId: user.id, name } });
  revalidatePath("/app/settings/api");
}

export async function revokeServiceAccountAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.serviceAccount.updateMany({
    where: { id, userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/app/settings/api");
}

export async function createWebhookEndpointAction(
  _prev: ApiKeyState,
  formData: FormData,
): Promise<ApiKeyState> {
  const user = await requireUser();
  const url = String(formData.get("url") ?? "").trim();
  if (!/^https:\/\//i.test(url) || url.length > 500) {
    return { error: "Webhook URL must be https." };
  }
  const secret = generateWebhookSecret();
  await prisma.webhookEndpoint.create({ data: { userId: user.id, url, secret } });
  await recordEvent({ name: "webhook_endpoint_created", userId: user.id });
  revalidatePath("/app/settings/api");
  return { webhookSecret: secret, name: url };
}

export async function revokeWebhookEndpointAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.webhookEndpoint.updateMany({
    where: { id, userId: user.id, revokedAt: null },
    data: { revokedAt: new Date(), active: false },
  });
  revalidatePath("/app/settings/api");
}

export { API_SCOPES };

export async function revokeApiKeyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.apiKey.updateMany({ where: { id, userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  revalidatePath("/app/settings/api");
}
