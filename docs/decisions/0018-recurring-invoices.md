# 0018: Recurring schedules generate drafts daily; auto-send is opt-in; missed runs catch up one per day

Status: Accepted 2026-09-18

## Context

Service businesses bill the same client the same amount every period. Retyping an invoice monthly is the first thing merchants ask to stop doing, and the first feature Wave and Invoice Ninja are compared on.

## Decision

- A schedule holds a client, a cadence (weekly, monthly, quarterly, yearly), the next run date, days until due, tax rate, notes, line items, and an auto-send switch. It can be paused, resumed, edited, deleted (generated invoices stay), and run on demand.
- A daily cron at 06:15 UTC, gated by `CRON_SECRET`, generates one draft per due schedule through the same `createInvoice` service the app and API use, tags it with the schedule id, advances the next run date by one cadence step (day of month clamped), and records an event.
- Auto-send emails the invoice to the client on file as it is generated, through the same send flow, with the same limits. Off by default: drafts wait for the merchant.
- If a schedule is overdue by several periods (a paused deploy, a long pause), the sweep generates one invoice per day until it catches up rather than a burst. Merchants can generate the rest by hand.
- No proration, no usage, no per-schedule numbering; invoice numbers come from the same counter.

## Reasons

- One creation path means recurring invoices obey every rule normal invoices do.
- Drafts by default keep the merchant in control; auto-send is the second step once they trust it.
- One per day on catch-up avoids surprising a client with three invoices in one morning.

## Consequences

- The recurring cron needs the same `CRON_SECRET` as the overdue sweep.
- API endpoints for schedules are not in v1; they follow when an agent needs them.

## Revisit when

Merchants ask for proration, usage-based lines, or per-client numbering.
