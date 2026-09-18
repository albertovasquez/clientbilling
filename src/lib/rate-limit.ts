import { prisma } from "@/lib/db";

/**
 * Fixed-window rate limit backed by the RateLimit table (decisions 0004, 0006).
 * Returns true when the action is allowed. Windows are keyed by caller-supplied
 * strings such as `send:${userId}` or `signin:${ip}`.
 */
export async function allow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  const row = await prisma.rateLimit.upsert({
    where: { key },
    create: { key, count: 1, resetAt },
    update: {},
  });

  if (row.resetAt.getTime() <= now.getTime()) {
    await prisma.rateLimit.update({ where: { key }, data: { count: 1, resetAt } });
    return true;
  }
  if (row.count >= limit) return false;

  await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}
