"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateApiKey } from "@/lib/api-keys";
import { assertDatabase, prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { requireUser } from "@/lib/session";

export type ApiKeyState = { error?: string; rawKey?: string; name?: string };

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

  const { raw, hash, prefix } = generateApiKey();
  await prisma.apiKey.create({ data: { userId: user.id, name: parsed.data, keyHash: hash, prefix } });
  await recordEvent({ name: "api_key_created", userId: user.id });
  revalidatePath("/app/settings/api");
  return { rawKey: raw, name: parsed.data };
}

export async function revokeApiKeyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.apiKey.updateMany({ where: { id, userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  revalidatePath("/app/settings/api");
}
