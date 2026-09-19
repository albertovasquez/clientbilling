import { createHash } from "node:crypto";
import { beginIdempotency, storeIdempotency } from "@/lib/billing/idempotency";
import type { McpAuth } from "@/lib/mcp/auth-context";

/**
 * Apply the same Idempotency-Key rules to MCP write tools (decision 0025/0027).
 */
export async function withMcpIdempotency<T>(
  auth: McpAuth,
  tool: string,
  key: string,
  argsFingerprint: string,
  run: () => Promise<{ ok: true; body: T } | { ok: false; error: string }>,
): Promise<{ ok: true; body: T; replayed?: boolean } | { ok: false; error: string }> {
  const rawBody = argsFingerprint;
  const req = new Request(`http://mcp.local/${tool}`, {
    method: "POST",
    headers: { "Idempotency-Key": key, "Content-Type": "application/json" },
    body: rawBody,
  });
  const begun = await beginIdempotency(auth.userId, req, rawBody);
  if (!begun.ok) {
    if (begun.response.status === 400) {
      return { ok: false, error: "Idempotency-Key is required" };
    }
    const textBody = await begun.response.text();
    try {
      const parsed = JSON.parse(textBody) as T | { error?: string };
      if (parsed && typeof parsed === "object" && "error" in parsed && parsed.error) {
        return { ok: false, error: String(parsed.error) };
      }
      if (begun.response.headers.get("Idempotency-Replayed") === "true") {
        return { ok: true, body: parsed as T, replayed: true };
      }
      return { ok: false, error: "Idempotency-Key conflict" };
    } catch {
      return { ok: false, error: "Idempotency-Key conflict" };
    }
  }

  const result = await run();
  if (!result.ok) {
    await storeIdempotency(auth.userId, begun.key, begun.fingerprint, 400, { error: result.error });
    return result;
  }
  await storeIdempotency(auth.userId, begun.key, begun.fingerprint, 200, result.body);
  return { ok: true, body: result.body };
}

export function fingerprintArgs(args: unknown): string {
  return createHash("sha256").update(JSON.stringify(args), "utf8").digest("hex");
}
