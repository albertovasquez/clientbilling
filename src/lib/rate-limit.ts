import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Fixed-window rate limit backed by the RateLimit table (decisions 0004, 0006,
 * 0020). Returns true when the action is allowed. Windows are keyed by
 * caller-supplied strings such as `send:${userId}` or `signin:${ip}`.
 *
 * One statement does the whole check: insert the window, or bump the count,
 * or start a new window when the old one has expired, and return the count.
 * Concurrent callers therefore each get a distinct count and at most `limit`
 * of them pass. Any database error fails closed.
 */
export async function allow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  try {
    const rows = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."resetAt" <= now() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= now() THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
      RETURNING "count"
    `);
    const count = rows[0]?.count;
    return typeof count === "number" && count <= limit;
  } catch (error) {
    console.error("[rate-limit] check failed; refusing", error instanceof Error ? error.message : error);
    return false;
  }
}

/** Client address from the proxy headers, for per-IP limits. */
export function ipFromHeaders(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}
