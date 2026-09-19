import { prisma } from "@/lib/db";
import { signWebhookPayload } from "@/lib/webhooks/sign";

const BACKOFF_SECONDS = [60, 300, 1800, 7200, 21600];
const MAX_ATTEMPTS = BACKOFF_SECONDS.length + 1;

export type DeliverResult = { attempted: number; delivered: number; failed: number };

/** Claim and POST due webhook deliveries. Safe to run from cron. */
export async function deliverDueWebhooks(limit = 50, now = new Date()): Promise<DeliverResult> {
  const due = await prisma.webhookDelivery.findMany({
    where: { status: "pending", nextAttemptAt: { lte: now } },
    include: { endpoint: true },
    orderBy: { nextAttemptAt: "asc" },
    take: limit,
  });

  let delivered = 0;
  let failed = 0;
  for (const row of due) {
    if (!row.endpoint.active || row.endpoint.revokedAt) {
      await prisma.webhookDelivery.update({
        where: { id: row.id },
        data: { status: "failed", lastError: "endpoint inactive", attempts: row.attempts + 1 },
      });
      failed += 1;
      continue;
    }

    const signature = signWebhookPayload(row.endpoint.secret, row.payload);
    let statusCode: number | null = null;
    let error: string | null = null;
    let ok = false;
    try {
      const res = await fetch(row.endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ClientBilling-Signature": signature,
          "User-Agent": "ClientBilling-Webhooks/1.0",
        },
        body: row.payload,
        signal: AbortSignal.timeout(10_000),
      });
      statusCode = res.status;
      ok = res.status >= 200 && res.status < 300;
      if (!ok) error = `HTTP ${res.status}`;
    } catch (e) {
      error = e instanceof Error ? e.message : "delivery failed";
    }

    const attempts = row.attempts + 1;
    if (ok) {
      await prisma.webhookDelivery.update({
        where: { id: row.id },
        data: {
          status: "success",
          attempts,
          lastStatusCode: statusCode,
          lastError: null,
          deliveredAt: new Date(),
        },
      });
      delivered += 1;
      continue;
    }

    if (attempts >= MAX_ATTEMPTS) {
      await prisma.webhookDelivery.update({
        where: { id: row.id },
        data: { status: "failed", attempts, lastStatusCode: statusCode, lastError: error },
      });
      failed += 1;
    } else {
      const delay = BACKOFF_SECONDS[Math.min(attempts - 1, BACKOFF_SECONDS.length - 1)]!;
      await prisma.webhookDelivery.update({
        where: { id: row.id },
        data: {
          status: "pending",
          attempts,
          lastStatusCode: statusCode,
          lastError: error,
          nextAttemptAt: new Date(now.getTime() + delay * 1000),
        },
      });
      failed += 1;
    }
  }

  return { attempted: due.length, delivered, failed };
}
