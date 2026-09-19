import { NextResponse } from "next/server";
import type { Actor } from "@/lib/billing/actor";
import { serializeActor } from "@/lib/billing/actor";
import type { ApiKeyKind } from "@/lib/api-keys";
import {
  beginIdempotency,
  parseRawJson,
  readRawBody,
  storeIdempotency,
} from "@/lib/billing/idempotency";
import { allowSandboxWrite } from "@/lib/mcp/sandbox";

export type ApiAuthOk = {
  ok: true;
  userId: string;
  keyId: string;
  actor: Actor;
  keyKind: ApiKeyKind;
};

/**
 * Run a state-changing API handler under an Idempotency-Key. Replays stored
 * responses; rejects fingerprint conflicts; attaches actor + request provenance.
 */
export async function withIdempotency<T extends Record<string, unknown>>(
  auth: ApiAuthOk,
  req: Request,
  run: (ctx: {
    body: Record<string, unknown> | null;
    actor: Actor;
    rawBody: string;
  }) => Promise<{ status: number; body: T } | { error: string; status: number }>,
): Promise<NextResponse> {
  const sandbox = await allowSandboxWrite(auth.userId, auth.keyKind);
  if (!sandbox.ok) {
    return NextResponse.json({ error: sandbox.error }, { status: sandbox.status });
  }

  const rawBody = await readRawBody(req);
  const begun = await beginIdempotency(auth.userId, req, rawBody);
  if (!begun.ok) return begun.response;

  const actor = auth.actor;
  const body = parseRawJson<Record<string, unknown>>(rawBody);
  const result = await run({ body, actor, rawBody });
  if ("error" in result) {
    const payload = { error: result.error };
    // Do not lock auth failures under the idempotency key.
    if (result.status !== 401 && result.status !== 403) {
      await storeIdempotency(auth.userId, begun.key, begun.fingerprint, result.status, payload);
    }
    return NextResponse.json(payload, { status: result.status });
  }

  const payload = {
    ...result.body,
    actor: serializeActor(actor),
    request: { idempotencyKey: begun.key },
  };
  await storeIdempotency(auth.userId, begun.key, begun.fingerprint, result.status, payload);
  return NextResponse.json(payload, { status: result.status });
}
