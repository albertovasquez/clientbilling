# Runbook: inspect and replay webhook deliveries

Purpose: answer "did that event reach the receiver, and if not why" (decision 0026). There is no screen for this. Settings, API keys lists endpoints, not deliveries, so this is a database read.

Preconditions: read access to the production database. Reading is within an agent's remit; writing to `WebhookDelivery` is not.

## How delivery works

`/api/cron/webhooks` runs every five minutes (`vercel.json`) and calls `deliverDueWebhooks`, which takes up to 50 `pending` rows whose `nextAttemptAt` has passed. A 2xx marks the row `success`. Anything else schedules a retry at 60s, 5m, 30m, 2h, then 6h, six attempts over about eight hours, after which the row is `failed` and nothing tries again.

Read the status column, not the cron's response. `deliverDueWebhooks` returns `failed` incremented for **every** non-2xx attempt, including ones that will retry, so a run reporting failures may have nothing permanently wrong with it.

## What failed, and why

```sql
SELECT d."eventId", d.type, d.status, d.attempts,
       d."lastStatusCode", d."lastError", d."nextAttemptAt", e.url
FROM "WebhookDelivery" d
JOIN "WebhookEndpoint" e ON e.id = d."endpointId"
WHERE d.status = 'failed'
ORDER BY d."createdAt" DESC
LIMIT 50;
```

Reading `lastError`:

| Value | Meaning | What to do |
| --- | --- | --- |
| `endpoint inactive` | The endpoint was revoked or deactivated while the row was queued. | Nothing retries it. See the replay section. |
| `HTTP 4xx` | The receiver rejected it. A 401 usually means a signature mismatch, so suspect the secret. | Fix the receiver, then replay. |
| `HTTP 5xx` | The receiver was down through all six attempts, about eight hours. | Confirm it is back, then replay. |
| A fetch error string | We could not reach the URL: DNS, TLS, or a timeout. | Check the URL is still right and reachable. |

## Is anything stuck right now

```sql
SELECT status, count(*), min("nextAttemptAt") AS next
FROM "WebhookDelivery"
WHERE "createdAt" > now() - interval '24 hours'
GROUP BY status;
```

A growing `pending` count with a `next` in the past means the cron is not running. Check that `/api/cron/webhooks` returns 200 in the Vercel logs; a `CRON_SECRET` mismatch fails it quietly.

## Replay

There is no replay action. `payload` holds the exact body that was sent or would have been, and the signature is computed at delivery time from the endpoint's current secret, so a replay is a manual POST:

1. Read the row's `payload` and the endpoint's `secret`.
2. Sign `${t}.${rawBody}` with HMAC-SHA256 where `t` is the current unix time, and send `ClientBilling-Signature: t=<t>,v1=<hex>`. `signWebhookPayload` in `src/lib/webhooks/sign.ts` is the reference.
3. Post the payload verbatim. Changing a byte invalidates the signature.

The receiver should be idempotent on the event `id`, which is stable across attempts, so a replay of something already processed is safe by design. Say so when asking a receiver to accept one.

Stop and ask: editing or deleting `WebhookDelivery` rows, replaying into a receiver you were not asked to touch, and anything on an account other than the one you were asked to act on.

## Worth fixing

The delivery log has no UI, so every question here needs a database client. A read-only view under Settings showing recent deliveries with status and last error would retire most of this runbook. Filed as part of issue #68.
