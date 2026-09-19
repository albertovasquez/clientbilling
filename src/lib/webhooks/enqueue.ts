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
  let queued = 0;
  for (const endpoint of endpoints) {
    try {
      await db.webhookDelivery.create({
        data: {
          endpointId: endpoint.id,
          eventId,
          type,
          payload,
          status: "pending",
          nextAttemptAt: new Date(),
        },
      });
      queued += 1;
    } catch (error) {
      // A duplicate is the one benign case: this endpoint already has this
      // event. Anything else (a lost connection, a constraint we did not
      // anticipate) must not be mistaken for "already queued", so it
      // propagates and rolls the mutation back with it.
      if (!isDuplicateDelivery(error)) throw error;
    }
  }
  return queued;
}

/** Prisma P2002: unique violation on (endpointId, eventId). */
function isDuplicateDelivery(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}
