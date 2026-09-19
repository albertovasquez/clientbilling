import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signed webhook payloads (decision 0026). Header:
 * ClientBilling-Signature: t=<unix>,v1=<hmac_sha256_hex>
 * Signed string: `${t}.${rawBody}`. Receivers should reject |now - t| > 300s.
 */

export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(24).toString("base64url")}`;
}

export function signWebhookPayload(secret: string, rawBody: string, timestampSec = Math.floor(Date.now() / 1000)): string {
  const signed = `${timestampSec}.${rawBody}`;
  const v1 = createHmac("sha256", secret).update(signed, "utf8").digest("hex");
  return `t=${timestampSec},v1=${v1}`;
}

export function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  header: string,
  nowSec = Math.floor(Date.now() / 1000),
  toleranceSec = 300,
): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...rest] = p.trim().split("=");
      return [k, rest.join("=")];
    }),
  );
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!Number.isFinite(t) || !v1) return false;
  if (Math.abs(nowSec - t) > toleranceSec) return false;
  const expected = signWebhookPayload(secret, rawBody, t);
  const expectedV1 = expected.split("v1=")[1] ?? "";
  try {
    const a = Buffer.from(v1, "utf8");
    const b = Buffer.from(expectedV1, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
