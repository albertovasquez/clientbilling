import type { Prisma } from "@prisma/client";
import type { Actor } from "@/lib/billing/actor";
import { BILLING_SCHEMA_VERSION, canonicalJson } from "@/lib/billing/canonical";
import { eventHash, newNonce, payloadHash } from "@/lib/billing/hash";

export type BillingTx = Prisma.TransactionClient;

export type AggregateType = "invoice" | "payment";

export type AppendBillingEventInput = {
  userId: string;
  aggregateType: AggregateType;
  aggregateId: string;
  type: string;
  actor: Actor;
  payload: Record<string, unknown>;
  occurredAt?: Date;
};

/**
 * Append one billing event inside an open transaction. Sequence and previous
 * hash come from the last event for the same aggregate.
 */
export async function appendBillingEvent(tx: BillingTx, input: AppendBillingEventInput) {
  const last = await tx.billingEvent.findFirst({
    where: {
      userId: input.userId,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
    },
    orderBy: { sequence: "desc" },
    select: { sequence: true, eventHash: true },
  });
  const sequence = (last?.sequence ?? 0) + 1;
  const previousHash = last?.eventHash ?? "";
  const nonce = newNonce();
  const payload = canonicalJson(input.payload);
  const pHash = payloadHash(nonce, payload);
  const eHash = eventHash(previousHash, pHash, sequence);
  const occurredAt = input.occurredAt ?? new Date();

  return tx.billingEvent.create({
    data: {
      userId: input.userId,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      sequence,
      type: input.type,
      actorType: input.actor.type,
      actorId: input.actor.id,
      authorizationId: input.actor.authorizationId ?? null,
      payload,
      nonce,
      previousHash,
      eventHash: eHash,
      schemaVersion: BILLING_SCHEMA_VERSION,
      occurredAt,
    },
  });
}
