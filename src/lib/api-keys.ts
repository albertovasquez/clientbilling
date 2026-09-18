import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/rate-limit";

/**
 * Personal API keys (decision 0017). The raw key is shown once; only its
 * SHA-256 is stored. Keys act as the user who created them.
 */
const PREFIX = "cb_live_";

export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = PREFIX + randomBytes(24).toString("base64url");
  return { raw, hash: hashApiKey(raw), prefix: raw.slice(0, PREFIX.length + 6) };
}

export type ApiAuth =
  | { ok: true; userId: string; keyId: string }
  | { ok: false; status: number; error: string };

/** Authenticate `Authorization: Bearer cb_live_...`. 120 requests per key per minute. */
export async function authenticateApiRequest(req: Request): Promise<ApiAuth> {
  if (!process.env.DATABASE_URL) return { ok: false, status: 503, error: "API not available" };
  const header = req.headers.get("authorization") ?? "";
  const raw = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!raw.startsWith(PREFIX) || raw.length < PREFIX.length + 20) {
    return { ok: false, status: 401, error: "Missing or malformed API key" };
  }
  const key = await prisma.apiKey.findUnique({ where: { keyHash: hashApiKey(raw) } });
  if (!key || key.revokedAt) {
    return { ok: false, status: 401, error: "Invalid or revoked API key" };
  }
  if (!(await allow(`api:${key.id}`, 120, 60))) {
    return { ok: false, status: 429, error: "Rate limit: 120 requests per minute per key" };
  }
  // Touch lastUsedAt at most once a minute to keep writes cheap.
  if (!key.lastUsedAt || Date.now() - key.lastUsedAt.getTime() > 60_000) {
    prisma.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } }).catch(() => undefined);
  }
  return { ok: true, userId: key.userId, keyId: key.id };
}
