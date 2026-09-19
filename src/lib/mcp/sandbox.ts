import type { ApiKeyKind } from "@/lib/api-keys";
import { allow } from "@/lib/rate-limit";

/** Free sandbox write allowance for test keys (decision 0027). */
export const SANDBOX_WRITES_PER_DAY = 100;

export type SandboxGate = { ok: true } | { ok: false; error: string; status: number };

/**
 * Refuse anything that would email a client from a test key (decision 0028).
 *
 * A test key acts on the real account, so a send reaches a real person. That is
 * the one thing a developer cannot undo: a draft can be voided and a payment
 * removed, but a client who received an invoice has received it. Test keys are
 * named for testing, so assuming a send is safe is the natural mistake, and
 * this is the gate that makes the assumption harmless.
 */
export function allowSandboxEmail(keyKind: ApiKeyKind): SandboxGate {
  if (keyKind !== "test") return { ok: true };
  return {
    ok: false,
    status: 403,
    error:
      "Test keys cannot send email, because a send reaches the real client on file. Use a live key to send.",
  };
}

/**
 * Live keys have no daily write quota until Machine-tier enforcement ships.
 * Test keys (`cb_test_`) share a per-account daily write budget on REST and MCP.
 */
export async function allowSandboxWrite(
  userId: string,
  keyKind: ApiKeyKind,
): Promise<SandboxGate> {
  if (keyKind !== "test") return { ok: true };
  if (!(await allow(`sandbox:${userId}`, SANDBOX_WRITES_PER_DAY, 86_400))) {
    return {
      ok: false,
      status: 429,
      error: `Test key write allowance is ${SANDBOX_WRITES_PER_DAY} a day. Use a live key or wait for the window to reset.`,
    };
  }
  return { ok: true };
}
