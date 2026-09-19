import type { McpAuth } from "@/lib/mcp/auth-context";
import { allow } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

/** Free sandbox write allowance for test keys (decision 0027). */
export const SANDBOX_WRITES_PER_DAY = 100;

export type SandboxGate = { ok: true } | { ok: false; error: string };

/**
 * Live keys are unrestricted until Machine-tier enforcement ships.
 * Test keys (`cb_test_`) share a per-account daily write budget.
 */
export async function allowSandboxWrite(auth: McpAuth & { keyKind?: "live" | "test" }): Promise<SandboxGate> {
  const key = await prisma.apiKey.findUnique({ where: { id: auth.keyId }, select: { prefix: true } });
  const isTest = (key?.prefix ?? "").startsWith("cb_test_");
  if (!isTest) return { ok: true };
  if (!(await allow(`sandbox:${auth.userId}`, SANDBOX_WRITES_PER_DAY, 86_400))) {
    return {
      ok: false,
      error: `Sandbox write allowance is ${SANDBOX_WRITES_PER_DAY} per day. Use a live key or wait for the window to reset.`,
    };
  }
  return { ok: true };
}
