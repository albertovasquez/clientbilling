import { timingSafeEqual } from "node:crypto";

/**
 * Bearer check for cron routes (decisions 0015, 0020). Refuses when the secret
 * is unset and compares in constant time so the header cannot be guessed a
 * byte at a time.
 */
export function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}
