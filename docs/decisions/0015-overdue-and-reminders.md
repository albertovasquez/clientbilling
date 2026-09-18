# 0015: Overdue is set by a daily sweep; reminders are manual, one a day, to the client on file

Status: Accepted 2026-09-18

## Context

Chasing unpaid invoices is the second most valuable thing an invoice tool does. The app had an `overdue` status that nothing ever set, and no way to send a reminder without leaving the app.

## Decision

- A daily cron at 06:00 UTC flips invoices in `sent` or `viewed` whose due date has passed to `overdue`, recording an event per invoice. It requires `CRON_SECRET` and refuses without it.
- A merchant sends a reminder from the invoice page. It goes only to the client on file, at most once per invoice per 24 hours, and counts against the same 20-per-hour email limit as sends. The reminder states the number, amount, due date, public link, the pay link if one exists, and the payment instructions. No fees, no interest, no collections language.
- Automatic reminders are deferred to P1 and will be opt-in per merchant with the same content rules.
- The dashboard shows outstanding and overdue totals and paid this month, and labels statuses in merchant words (Opened, Overdue).

## Reasons

- Manual reminders match how small businesses actually chase: a nudge with the link, sent when they choose. Automatic sequences without opt-in surprise merchants and annoy their clients.
- One a day per invoice prevents a merchant from spamming a client from our domain.
- The cron sweep is deterministic and auditable through the event log.

## Consequences

- `CRON_SECRET` must be set in Vercel for the sweep to run; the ops checklist says so.
- Reminders need `RESEND_API_KEY` and `RESEND_FROM`; until then the button explains that email is not enabled.

## Revisit when

Merchants ask for scheduled reminders, or reminder volume suggests the daily cap is wrong.
