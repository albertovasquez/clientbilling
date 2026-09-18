# 0017: Personal API keys and a small REST surface so agents can operate the product

Status: Accepted 2026-09-18

## Context

Product principle 8 says agents must be able to operate the product without improvising policy. Every merchant action was UI-only, and the runbooks were UI procedures. The invoice creation, status, send, and reminder rules lived inside server actions and route handlers, which the API would have had to duplicate.

## Decision

- Personal API keys: `cb_live_` plus 24 random bytes, shown once, stored as SHA-256, up to ten active per account, revocable, with a prefix for display. A key acts as the user who created it; there are no scopes yet.
- `Authorization: Bearer <key>` on `/api/v1/*`. 120 requests per key per minute.
- Endpoints: clients (list, create), invoices (list with status filter, create, get), status change, send, remind. JSON, camelCase, integer cents, ISO dates, `{ error }` on failure with the same status codes the app uses.
- The invoice rules move into shared modules: `src/lib/invoices/service.ts` (numbering, validation, status transitions, serialization) and `src/lib/invoices/email.ts` (send and reminder flows). The app's actions and routes call the same code as the API.
- Reference at `docs/agents/api.md`; the runbooks use the API where it exists.

## Reasons

- One implementation of the rules means the API cannot behave differently from the app.
- Keys that act as the user are the simplest correct model for a single-owner account; scopes come with team roles.
- A small surface that covers the runbooks is worth more than a complete one nobody uses.

## Consequences

- No webhooks yet; agents poll `GET /api/v1/invoices?status=overdue`.
- No update or delete endpoints yet; edits happen in the app.

## Revisit when

Team roles ship (scopes), or an agent needs webhooks or updates.
