import type { ApiKeyKind } from "@/lib/api-keys";
import { allow } from "@/lib/rate-limit";

/** Free sandbox write allowance for test keys (decision 0027). */
export const SANDBOX_WRITES_PER_DAY = 100;

export type SandboxGate = { ok: true } | { ok: false; error: string; status: number };

/**
 * Live keys are unrestricted until Machine-tier enforcement ships.
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
