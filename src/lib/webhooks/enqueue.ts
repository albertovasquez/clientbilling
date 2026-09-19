import { randomBytes } from "node:crypto";
import type { Actor } from "@/lib/billing/actor";
import { serializeActor } from "@/lib/billing/actor";
import type { BillingTx } from "@/lib/billing/events";
import { utcTimestamp } from "@/lib/billing/canonical";

/** A transaction client, or the plain client for callers outside one. */
export type WebhookTx = BillingTx;

export const WEBHOOK_TYPES = [
  "invoice.created",
  "invoice.sent",
  "invoice.viewed",
  "invoice.paid",
  "payment.recorded",
  "invoice.overdue",
] as const;

export type WebhookType = (typeof WEBHOOK_TYPES)[number];

/**
 * Queue one delivery per active endpoint. eventId is stable per logical event
 * so retries and re-enqueues do not duplicate (unique on endpointId+eventId).
 *
 * Pass the transaction client of the mutation this event describes. Delivery
 * rows then commit with the mutation, so either both land or neither does:
 * at-least-once has to start at the mutation, not at the moment a row happens
 * to reach the table. Retries only ever see rows, so an event that never
 * became a row is lost with nothing to retry and no record it was owed.
 *
 * Callers outside a transaction (a cron reading committed state) may pass the
 * plain client, where the same window exists but nothing is rolled back.
 */
export async function enqueueWebhook(
  db: WebhookTx,
  userId: string,
  type: WebhookType,
  data: Record<string, unknown>,
  actor: Actor,
  eventId = `evt_${randomBytes(12).toString("base64url")}`,
): Promise<number> {
  const endpoints = await db.webhookEndpoint.findMany({
    where: { userId, active: true, revokedAt: null },
    select: { id: true },
  });
  if (endpoints.length === 0) return 0;

  const body = {
    id: eventId,
    type,
    occurredAt: utcTimestamp(new Date()),
    organizationId: userId,
    data,
    actor: serializeActor(actor),
    proofStatus: "pending",
  };
  const payload = JSON.stringify(body);
  const now = new Date();

  // skipDuplicates, not a caught unique violation. On Postgres a failed
  // statement poisons the whole transaction: every later statement fails with
  // 25P02 and COMMIT silently rolls back, and Prisma wraps no savepoint to
  // recover from. Catching P2002 and continuing would therefore discard the
  // mutation this event describes while the caller still saw success. This
  // compiles to INSERT ... ON CONFLICT DO NOTHING, which tolerates the repeat
  // without ever putting the transaction in that state.
  const { count } = await db.webhookDelivery.createMany({
    data: endpoints.map((endpoint) => ({
      endpointId: endpoint.id,
      eventId,
      type,
      payload,
      status: "pending",
      nextAttemptAt: now,
    })),
    skipDuplicates: true,
  });
  return count;
}
