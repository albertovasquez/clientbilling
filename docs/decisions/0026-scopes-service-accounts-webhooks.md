# 0026: Key scopes, service accounts, OpenAPI, and signed webhooks

Status: Accepted 2026-09-19. Implements epic #34 (week 4). Builds on 0025.

## Context

Week 3 added actors, versions, and idempotency. Machine clients still used unscoped keys that always acted as the account owner, had no OpenAPI document beside the prose reference, and had to poll for status changes.

## Decision

- **Scopes** on every API key: `invoice:read`, `invoice:write`, `invoice:send`, `invoice:void`, `reminder:send`, `payment:read`, `payment:record`, `cost:read`, `proof:read`. Existing keys receive all scopes. Missing scope returns `403`.
- **ServiceAccount** belongs to the user. An API key may bind to one. When bound, mutation actors are `service_account` with `authorizationId` set to the key id; otherwise `api_key`.
- **OpenAPI 3.1** is hand-maintained at `docs/agents/openapi-v1.json` and served at `/docs/api/openapi.json`, linked from `/docs/api`.
- **Webhooks**: merchants register HTTPS endpoints with a shown-once `whsec_` secret. Deliveries are signed with `ClientBilling-Signature: t=<unix>,v1=<hmac>` over `${t}.${rawBody}`. Events: `invoice.created`, `invoice.sent`, `invoice.viewed`, `invoice.paid`, `payment.recorded`, `invoice.overdue`. At-least-once via `WebhookDelivery` with backoff; cron `/api/cron/webhooks` every five minutes.
- Machine-tier gating remains designed, not enforced (0022).

## Reasons

- Scopes and service accounts are the authorization and actor primitives MCP (#35) needs.
- Signed webhooks with a delivery log match the research and the epic exit criterion (create, send, observe).

## Consequences

- Settings, API keys gains service accounts, scope checkboxes, and webhook endpoints.
- Polling still works; webhooks are optional.
- MCP and the developer landing follow in #35.

## Revisit when

Team roles introduce organizations, or Machine-tier billing starts enforcing production write quotas.
