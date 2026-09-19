# 0022: Free for people, paid for machines. Two revenue engines, neither the product identity.

Status: Accepted 2026-09-18. Revises 0010.

## Context

Decision 0010 said no paid tier, ever, with the business funded by CDG referrals and residuals. The 2026-09-18 research (`docs/strategy/2026-09-18-research-profitable-differentiated-product.md`) shows why that is fragile: CDG's public reseller template allows commission structures to change, permits termination on 30 days' notice, and grants no clean residual tail. A business whose only recurring revenue is a contract it does not control is not a durable business. The same research shows the machine surface is now contested (Zoho, Square, and Stripe ship MCP servers), so machine access must be sold on something more specific than "we have an API".

## Decision

- **Human invoicing stays free.** Clients, invoices, PDFs, public pages, recurring, reminders, manual and partial payments, pay links, the invoice-specific payment-cost comparison with sourced rate snapshots, CSV export, and the verified record. No invoice caps. 0010's reasons still hold for people: the customer we want is the one who reaches the Collect moment, and a paywall in front of that loses them.
- **Machine access is the first paid product.** A Machine tier covers the production REST API with idempotent writes, signed webhooks, remote MCP, service-account actor identities, the proof API with inclusion bundles, and higher quotas. Proposed at $29 a month; that is a proposal for the launch of API v1 with webhooks, not market data, and the founder sets the number then. A free developer sandbox with a small allowance stays, because Zoho, Stripe, and Square already give developers a way in and the conversion moment is "this automation now runs my production billing", not "I want to read the docs".
- **The proof seal is never paywalled.** Integrity is part of the brand promise; charging for it would weaken the promise and split the data model. Charge machines for automation, not people for integrity.
- **Two engines, modelled separately.** Machine revenue is the engine ClientBilling controls. Payment residuals are the engine it does not. CDG is modelled at zero recurring revenue until written terms exist (0021), and even confirmed, it is upside on top of the Machine tier, not the base. Neither engine becomes the product identity.
- **What is sold to agents.** Not "an MCP endpoint". An invoicing API where an agent can act, but every financial action retains an actor, an authorization, a cost model, and a verifiable record. V1 scopes are explicit and small: invoice read, write, send, void; reminder send; payment read and record; cost read; proof read. Recording a payment means recording that one occurred; no agent tool charges a card, refunds, or initiates a transfer in V1.
- **Terms.** The 30-day notice promise in the terms of service covers the introduction of the Machine tier. Nothing that is free today becomes paid for existing accounts.

## Reasons

- In the research's likely scenario the Machine tier is roughly three quarters of recurring revenue and CDG a quarter. If CDG turns out to be bounty-only, the business shrinks; it does not vanish.
- A paid machine tier gives negotiating leverage with any processor, because ClientBilling does not need the residual to exist.
- Pricing automation rather than invoice count keeps the free product honest and keeps the roadmap pointed at the Collect moment.

## Consequences

- The Machine tier ships only after REST v1 with idempotency and signed webhooks exist; MCP follows. Until then there is nothing to charge for, and the sandbox is the whole developer story.
- Metrics from day one: API keys created, time to first API invoice, weekly active API organizations, MCP-connected organizations, Machine conversion and churn.
- 0010's line "no paid tier" is withdrawn; its line "every invoicing feature is free for every account" stands for people.

## Revisit when

The Machine tier has thirty days of billing data, or a CDG answer changes the money model.
