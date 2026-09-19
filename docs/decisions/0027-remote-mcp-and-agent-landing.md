# 0027: Remote MCP, agent landing, and sandbox keys

Status: Accepted 2026-09-19. Implements epic #35 (week 5). Builds on 0025 and 0026.

## Context

Week 4 shipped scopes, service accounts, OpenAPI, and signed webhooks. Agents still needed a remote MCP surface over the same services, a public landing that splits "For agents" from "Developers", and a free sandbox story while Machine-tier pricing stays unset.

## Decision

- **Remote MCP** at `/api/mcp` using `mcp-handler` (Streamable HTTP). Auth is the same Bearer API keys as `/api/v1`. Tools: `list_invoices`, `get_invoice`, `create_invoice`, `send_invoice`, `send_reminder`, `record_payment`, `get_payment_costs`, `verify_record`. `verify_record` returns pending until week 7. No charge, refund, or transfer tools.
- **Landing** at `/developers/invoicing-api-for-agents`. Nav: For agents → landing; Developers → `/docs/api`.
- **Sandbox**: `cb_test_` keys with 100 writes per account per day. Live `cb_live_` keys unrestricted for now.
- **Machine gate**: `User.machineEnabled` exists and is documented; it is not enforced on live keys until the founder sets Machine pricing (0022).

## Reasons

- MCP must stay thin over `src/lib/invoices/` so REST and agents cannot diverge.
- Splitting the nav destinations closes the temporary dual-link to `/docs/api`.
- A free sandbox matches 0022 without charging before webhooks and MCP exist.

## Consequences

- MCP clients create invoices under a service-account actor when the key is bound.
- Enforcement of Machine-tier quotas is a follow-up once price is set.

## Revisit when

Machine price is set, or week 7 makes `verify_record` return real proofs.
