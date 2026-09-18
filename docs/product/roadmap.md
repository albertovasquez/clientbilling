# Roadmap

Updated 2026-09-18. The full reasoning is in `docs/strategy/2026-09-18-product-brief.md`. Each item lists agent-operability (can an agent do it through UI, API, or runbook without improvising policy) and the CDG dependency. Per decision 0014, nothing is asked of CDG; items that would need a CDG integration are not on the roadmap.

## P0: next four to six weeks

| Item | Why it matters | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Payer card-intent loop (shipped 2026-09-18) | The honest demand signal: on an unpaid public invoice, "Prefer to pay by card? Let {merchant} know." Records intent, emails the merchant, shows a count in the app. This is the activation trigger for Collect. | Yes: event and email, no policy. | None. Copy says card payment is planned. |
| Overdue detection and reminders | Nightly cron flips past-due invoices to `overdue`; merchant sends a reminder from the app; optional automatic reminder at +3 and +10 days. | Yes: cron plus an API endpoint. | Resend only. |
| Aging view on the dashboard | Outstanding by bucket (current, 1 to 30, 31 to 60, 60+), total outstanding, total paid this month. | Yes: read-only query. | None. |
| Branded PDF | Server-rendered PDF from the invoice data with logo and instructions, attached to the email and downloadable from `/i/*`. | Yes: route handler. | None. |
| Concierge Collect | "Enable card payments" in the app captures business type and monthly volume (CDG's own labels), records the request, emails the founder, and shows the merchant the CDG quote link. The founder walks the merchant through CDG by hand. | Partly: capture is automated, the walk is human. | Uses existing R=470 links only. |
| Agent surface v1 | Personal API keys; REST endpoints for clients, invoices, send, status; a runbook in `docs/agents/runbooks/` for "create and send", "chase unpaid", "open collect". | This is the item that makes everything else agent-operable. | None. |

## P1: after CDG answers, or in parallel where independent

| Item | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Merchant-provided pay link on `/i/*` (shipped 2026-09-18) | The merchant pastes their own hosted payment page; unpaid invoices show Pay online. No integration, no card data, no claims (decision 0014). | Yes. | None. |
| Recurring invoices | Service businesses bill monthly. Schedules generate drafts; the merchant approves or auto-sends. | Yes. | None. |
| Partial payments and payment records | Record deposits, installments, and offline payments against an invoice; balance due on the document. | Yes. | None. |
| Credit notes and voids with reason | Corrections without deleting history. | Yes. | None. |
| Client statements | One page per client: open invoices, paid, balance. Emailable. | Yes. | None. |
| CSV export | Invoices and payments for a bookkeeper. | Yes. | None. |
| Team roles | Owner, member, read-only. Needed before agencies adopt. | Yes. | None. |
| Invoice templates and default terms | Net terms, default notes, line-item presets. | Yes. | None. |
| Vertical landing kits | Pages for contractors, agencies, consultants, wholesale, each tying the invoice tool to the CDG pricing that fits them. | Yes: content from templates. | Uses existing links. |
| MCP server | Same operations as the REST API exposed as tools, so an agent in any client can run the runbooks. | This is the agent surface v2. | None. |

## P2: later

| Item | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Client portal | A payer sees all invoices from one merchant and their history. | Yes. | Pay link for the paid state. |
| Multi-currency | Only when a real merchant asks; U.S. first. | Yes. | CDG supports USD; check before promising more. |
| Attachments | Contracts and timesheets on invoices. Storage cost and abuse surface; later. | Yes. | None. |
| QuickBooks export or sync | Accountant channel. Start with CSV in QBO import format. | Yes. | None. |
| Cash-flow dashboard | Expected inflows by week from due dates and reminders. | Yes. | None. |
| CRM-lite | Notes and activity per client. Keep it thin. | Yes. | None. |
| Referral program | Merchant invites merchant. Only after retention is known. | Yes. | None. |

## Deliberately not on the roadmap

Card fields on our origin, saved cards, stored gateway credentials, refunds from our UI, holding funds, lending, payroll, accounting, a second processor. See `docs/mission/north-star.md`.
