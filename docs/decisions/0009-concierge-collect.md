# 0009: Concierge Collect until the pay link exists; the founder runs it with agent assistance

Status: Accepted 2026-09-18

## Context

The pay link on public invoices depends on CDG confirming residuals and permission (decision 0002). Merchants will want to collect cards before that lands. The brief asked whether the founder would personally walk the first merchants through CDG.

## Decision

- "Enable card payments" in the app captures the merchant's business type (CDG's six labels) and monthly card volume band, records a `collect_requested` event, emails the founder, and shows the merchant the CDG quote link with a note that a person will follow up.
- The founder runs the follow-up for the first fifty merchants. An agent drafts the follow-up email from a runbook (`docs/agents/runbooks/concierge-collect.md`, to be written with the feature) and the founder sends it.
- The partner one-pager is finalized now and sent by the founder; it no longer describes a fake door, and it includes data sharing, PCI scope, relationship ownership, dispute expectations, and an exit clause.

## Reasons

- The loop needs a human until the integration exists, and fifty merchants is a number one person can handle while learning what the objections are.
- Capturing volume and type in CDG's own labels means the merchant is not re-asked, and the data tells us which segments actually want to collect.

## Consequences

- Concierge is a P0 build item (roadmap) and a weekly time commitment for the founder.
- Concierge demand is the number that justifies asking CDG for engineering time.

## Revisit when

The pay link ships, or the fiftieth merchant is onboarded, whichever comes first.
