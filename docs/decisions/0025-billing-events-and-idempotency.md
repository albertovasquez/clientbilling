# 0025: Billing events with actors and hashes, invoice versions, API idempotency

Status: Accepted 2026-09-19. Implements epic #33 (week 3). Foundations for #34 and #35.

## Context

Decision 0017 shipped personal API keys and a small REST surface. Invoice mutations wrote `InvoiceEvent` rows without an actor or hash, and state-changing API calls could be retried into duplicate payments. Decision 0022 and the eight-week plan require an append-only billing record, immutable invoice versions, and idempotent machine writes before scoped keys, webhooks, and MCP.

## Decision

- **BillingEvent** is the append-only ledger for material mutations. Fields: `userId` (stands in for organization until team roles), aggregate type and id, sequence, type, actor type and id, authorization id, canonical payload, nonce, previous hash, event hash, schema version, occurred at. Hashing: `payloadHash = SHA256(nonce, canonical)`; `eventHash = SHA256(previousHash, payloadHash, sequence)`. Schema version `"1"`.
- **Actor types** for now: `user`, `api_key`, `system` (cron). `service_account` and `processor` are reserved for #34 and later.
- **InvoiceEvent** stays for UI and cooldown queries (`card_intent`, `reminder_sent`, activity feed). Material mutations dual-write. Historical `InvoiceEvent` rows are not rewritten into the hash chain.
- **InvoiceVersion** stores an immutable canonical snapshot after create, revise, send-from-draft, payment, void, overdue, and similar projection changes. The live `Invoice` row remains the current projection.
- **Idempotency-Key** is required on every state-changing `/api/v1` request. Scope is `(userId, key)`. Same key and request fingerprint replays the stored JSON response. Same key with a different fingerprint returns `409`. Records expire after 24 hours. Mutation responses include `actor` and `request.idempotencyKey`.

## Reasons

- Week 6 proof work needs a stable hash chain; writing hashes now avoids a second cutover.
- Bridging `InvoiceEvent` avoids breaking reminder cooldowns and the invoice activity UI.
- Stripe-style idempotency is the least surprising contract for API clients and MCP tools.

## Consequences

- API clients must send `Idempotency-Key` on POST and DELETE under `/api/v1`.
- Service accounts and webhook delivery land in #34 on top of this actor model.
- Merkle batching and chain anchoring remain week 6; `verify_record` stays pending until then.

## Revisit when

Team roles introduce a real Organization, or week 6 freezes a newer canonical schema version.
