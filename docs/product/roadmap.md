# Roadmap

Updated 2026-09-18. The full reasoning is in `docs/strategy/2026-09-18-product-brief.md`. Each item lists agent-operability (can an agent do it through UI, API, or runbook without improvising policy) and the CDG dependency. Per decision 0014, nothing is asked of CDG; items that would need a CDG integration are not on the roadmap.

## P0: next four to six weeks

| Item | Why it matters | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Payer card-intent loop (shipped 2026-09-18) | The honest demand signal: on an unpaid public invoice, "Prefer to pay by card? Let {merchant} know." Records intent, emails the merchant, shows a count in the app. This is the activation trigger for Collect. | Yes: event and email, no policy. | None. Copy says card payment is planned. |
| Overdue detection and reminders (shipped 2026-09-18; automatic reminders deferred to P1) | Nightly cron flips past-due invoices to `overdue`; merchant sends a reminder from the app; optional automatic reminder at +3 and +10 days. | Yes: cron plus an API endpoint. | Resend only. |
| Aging view on the dashboard (summary tiles shipped 2026-09-18; buckets later) | Outstanding by bucket (current, 1 to 30, 31 to 60, 60+), total outstanding, total paid this month. | Yes: read-only query. | None. |
| Branded PDF (shipped 2026-09-18; logo on PDF later) | Server-rendered PDF from the invoice data with logo and instructions, attached to the email and downloadable from `/i/*`. | Yes: route handler. | None. |
| Concierge Collect (shipped 2026-09-18) | "Enable card payments" in the app captures business type and monthly volume (CDG's own labels), records the request, emails the founder, and shows the merchant the CDG quote link. The founder walks the merchant through CDG by hand. | Partly: capture is automated, the walk is human. | Uses existing R=470 links only. |
| Agent surface v1 (shipped 2026-09-18; no webhooks or updates yet) | Personal API keys; REST endpoints for clients, invoices, send, status; a runbook in `docs/agents/runbooks/` for "create and send", "chase unpaid", "open collect". | This is the item that makes everything else agent-operable. | None. |

## P1: after CDG answers, or in parallel where independent

| Item | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Merchant-provided pay link on `/i/*` (shipped 2026-09-18) | The merchant pastes their own hosted payment page; unpaid invoices show Pay online. No integration, no card data, no claims (decision 0014). | Yes. | None. |
| App UI on shadcn/ui (shipped 2026-09-18, decision 0011) | Forms, tables, badges, and alerts on shared components so screens are faster to add and consistent. | Yes. | None. |
| Recurring invoices (shipped 2026-09-18) | Service businesses bill monthly. Schedules generate drafts; the merchant approves or auto-sends. | Yes. | None. |
| Partial payments and payment records (shipped 2026-09-18, decision 0019) | Record deposits, installments, and offline payments against an invoice; balance due on the document. | Yes. | None. |
| Credit notes and voids with reason | Corrections without deleting history. | Yes. | None. |
| Client statements | One page per client: open invoices, paid, balance. Emailable. | Yes. | None. |
| CSV export | Invoices and payments for a bookkeeper. | Yes. | None. |
| Team roles | Owner, member, read-only. Needed before agencies adopt. | Yes. | None. |
| Invoice templates and default terms | Net terms, default notes, line-item presets. | Yes. | None. |
| Vertical landing kits | Pages for contractors, agencies, consultants, wholesale, each tying the invoice tool to the CDG pricing that fits them. | Yes: content from templates. | Uses existing links. |
| MCP server | Same operations as the REST API exposed as tools, so an agent in any client can run the runbooks. | This is the agent surface v2. | None. |

## Collections service (decision 0020)

A separate service from free invoicing. B2B only, first-party, approval on every message, no funds. Research: `docs/research/collections-pivot.md`.

| Item | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Week 1: import and questionnaire (in progress, `feat/collections-week1`) | CSV import with business-debt confirmation; per-account relationship, disputes, minimum settlement, longest plan, tone, escalation. No outbound messages. | Yes: pure parsers, server actions. | None. |
| Week 2: policy engine and drafted emails | Deterministic offer rules from the questionnaire; the agent drafts emails in the user's name that wait for approval; opt-out, send windows, frequency caps, AI disclosure. | Yes. | None. |
| Week 3: debtor page, agreement, pay link | A page where the debtor sees the balance, chats, picks an offer inside policy, signs, and pays through the user's own link; handoff queue. | Yes. | None. |
| Week 4: dashboards and pilot | Recovered amount by age, pipeline, audit export; pilot with three to five friendly businesses. | Yes. | None. |
| Plans and usage metering | Starter $4.99 (3 accounts, 100 emails), Pro $19.99 (25, 1,000), Business $79.99 (150, 6,000), Unlimited* $499 (fair use 5,000, 100k). Overage $0.50 per active account per month, $0.03 per email. Count active accounts (being worked, not paid, settled, or paused) and agent emails per month; never price on recoveries. | Yes. | None. |
| Attorney review | B2B confirmation, California SB 1286 guarantor cases, review of the flat plans. Contingency pricing is off the table (decision 0020). | No: founder. | None. |

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
