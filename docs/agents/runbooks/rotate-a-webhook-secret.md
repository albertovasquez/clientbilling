# Runbook: replace a leaked webhook secret

Purpose: respond to a `whsec_` secret that has been exposed (decision 0026). Read this before touching anything: the obvious order loses events, and there is no rotate button.

Preconditions: the owner is signed in. Settings, API keys lists webhook endpoints. You need access to the receiving system to install the new secret.

## What the secret does, and what a leak costs

The secret signs each delivery: `ClientBilling-Signature: t=<unix>,v1=<hmac_sha256_hex>` over `${t}.${rawBody}` (`src/lib/webhooks/sign.ts`). Anyone holding it can forge a payload the receiver will accept as ours. It cannot read anything or act on the account; the damage is inbound to the receiver, not to ClientBilling.

So the urgency is the receiver's, and the receiver is the party that has to change. Tell them before you change anything.

## There is no rotate action

`WebhookEndpoint.secret` is set once at creation and shown once, in the form's confirmation. No screen shows it again, and no action regenerates it. Replacing a secret means creating a second endpoint and revoking the first.

## The order matters

Revoking an endpoint **permanently fails every delivery still queued for it**. `deliverDueWebhooks` marks any row whose endpoint is inactive or revoked as `failed` with `endpoint inactive`, and nothing re-queues it (`src/lib/webhooks/deliver.ts`). Those events are gone. Deliveries are also retried across six attempts spread over roughly eight hours, so a queue can hold hours of events at any moment.

Create first, revoke second:

1. Tell the receiver a rotation is starting and that it will briefly get deliveries signed with either of two secrets.
2. Settings, API keys, add a webhook endpoint with the **same URL**. Copy the new `whsec_` from the confirmation; it is shown once.
3. Install the new secret at the receiver **alongside the old one**. It must accept either signature for the length of the overlap. A receiver that can hold only one secret will drop events, so say so plainly rather than discovering it.
4. Wait out the retry window, up to about eight hours, so deliveries queued against the old endpoint drain. Watch `WebhookDelivery` rows for the old `endpointId` reach `success` or `failed`.
5. Revoke the old endpoint. Anything still pending for it fails now; step 4 is what makes that set empty.
6. Remove the old secret at the receiver.

## If the leak is active and you cannot wait

Revoke first and accept the loss. Then list what was lost so the receiver can reconcile:

```
SELECT "eventId", type, "createdAt"
FROM "WebhookDelivery"
WHERE "endpointId" = '<old id>' AND status = 'failed' AND "lastError" = 'endpoint inactive';
```

Each row's `payload` holds the full event body, so the receiver can be replayed by hand from it.

## Verify

7. A delivery to the new endpoint reaches `success` with a signature the receiver accepts.
8. No `pending` rows remain for the old endpoint.
9. The old endpoint shows revoked in Settings.

Stop and ask: anything that would send a payer or a client an email, replaying events into a receiver you were not asked to touch, and rotating on an account other than the one you were asked to act on.

## Worth fixing

A rotate action that issues a new secret on the same endpoint, with both valid for an overlap, would remove the event loss this runbook works around. Filed as part of issue #68.
