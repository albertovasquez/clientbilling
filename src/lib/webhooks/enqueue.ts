import { randomBytes } from "node:crypto";
import type { Actor } from "@/lib/billing/actor";
import { serializeActor } from "@/lib/billing/actor";
import { utcTimestamp } from "@/lib/billing/canonical";
import { prisma } from "@/lib/db";

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
 */
export async function enqueueWebhook(
  userId: string,
  type: WebhookType,
  data: Record<string, unknown>,
  actor: Actor,
  eventId = `evt_${randomBytes(12).toString("base64url")}`,
): Promise<number> {
  const endpoints = await prisma.webhookEndpoint.findMany({
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
      await prisma.webhookDelivery.create({
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
    } catch {
      // Unique (endpointId, eventId): already queued.
    }
  }
  return queued;
}
