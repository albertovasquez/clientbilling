# Roadmap

Updated 2026-09-18. The full reasoning is in `docs/strategy/2026-09-18-product-brief.md`; the longer-range direction (product-first homepage, payment optimizer, agent API, x402) is in `docs/strategy/2026-09-18-research-niche-and-monetization.md`, whose editor's notes map its four releases onto this roadmap. Each item lists agent-operability (can an agent do it through UI, API, or runbook without improvising policy) and the CDG dependency. Per decision 0014, nothing is asked of CDG; items that would need a CDG integration are not on the roadmap.

## P0: next four to six weeks

| Item | Why it matters | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Payer card-intent loop (shipped 2026-09-18) | The honest demand signal: on an unpaid public invoice, "Prefer to pay by card? Let {merchant} know." Records intent, emails the merchant, shows a count in the app. This is the activation trigger for Collect. | Yes: event and email, no policy. | None. Copy says card payment is planned. |
| Overdue detection and reminders (manual shipped 2026-09-18; automatic +3/+10 shipped 2026-09-18) | Nightly cron flips past-due invoices to `overdue`; merchant sends a reminder from the app; optional automatic reminder at +3 and +10 days. | Yes: cron plus an API endpoint. | Resend only. |
| Aging view on the dashboard (summary tiles and buckets shipped 2026-09-18) | Outstanding by bucket (current, 1 to 30, 31 to 60, 60+), total outstanding, total paid this month. | Yes: read-only query. | None. |
| Branded PDF (shipped 2026-09-18; logo on PDF shipped 2026-09-18) | Server-rendered PDF from the invoice data with logo and instructions, attached to the email and downloadable from `/i/*`. | Yes: route handler. | None. |
| Concierge Collect (shipped 2026-09-18) | "Enable card payments" in the app captures business type and monthly volume (CDG's own labels), records the request, emails the founder, and shows the merchant the CDG quote link. The founder walks the merchant through CDG by hand. | Partly: capture is automated, the walk is human. | Uses existing R=470 links only. |
| Agent surface v1 (shipped 2026-09-18; no webhooks or updates yet) | Personal API keys; REST endpoints for clients, invoices, send, status; a runbook in `docs/agents/runbooks/` for "create and send", "chase unpaid", "open collect". | This is the item that makes everything else agent-operable. | None. |

## The next eight weeks (decisions 0021 and 0022, from the 2026-09-18 report)

Merchant-processing integration and x402 stay out of the critical path. The goal is a defensible identity, a credible automation layer, a working proof primitive, and instrumentation that says which of the three pulls users.

| Week | Milestone | Exit criterion | Already in place |
| --- | --- | --- | --- |
| 1 | Positioning: Carbon Copy homepage, instrumentation, corrected competitor language; CDG email is the founder's call | Invoicing is unmistakably the product; analytics live | Events table and funnel page |
| 2 | Payment-aware invoice: rate-source registry with checked dates, known versus variable fee model, fee and net panel, rate snapshots | The $2,500 example and any merchant-entered rate calculate without inventing interchange | `src/lib/cdg.ts`, payment records with method |
| 3 | Billing record: append-only events with actor and authorization, invoice versions, idempotency keys | Duplicate requests cannot duplicate financial actions; every mutation has an actor | `InvoiceEvent` (no actor yet), transactions in services |
| 4 | Machine API: scoped keys, OpenAPI, signed webhooks with retry log | An external script creates, sends, and observes an invoice end to end | API keys, v1 REST for clients, invoices, status, send, remind, payments |
| 5 | Agent surface: MCP over the services, developer landing, sandbox | An MCP client creates an invoice under a service-account identity | Shared services in `src/lib/invoices/` |
| 6 | Proof engine: canonicalization, nonces, event hashes, Merkle batching, Fuji anchoring, behind a flag | A test invoice version verifies against an anchored root | Nothing |
| 7 | Productized verification: public verify page, PDF seal, file-copy detail, mainnet flag, KMS and security tests | A PDF record ID yields a plain-English verified or mismatch result | PDF renderer |
| 8 | Launch and measure: homepage release, developer and SEO pages, guide redirects, referral instrumentation | Usage shows which of economics, API, and proof pulls users | Style check, deploy pipeline |

Progress is tracked in the GitHub milestone "Carbon Copy launch": one epic issue per week with its blocking edges, split into tracer-bullet tickets as each week starts.

Gates: CDG revenue is forecast at zero until written terms exist; the agent surface ships primitives, not a platform; the proof layer anchors hashes, never data, and the app works without the chain; x402 waits for demand (0021).

## P1: after CDG answers, or in parallel where independent

| Item | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Merchant-provided pay link on `/i/*` (shipped 2026-09-18) | The merchant pastes their own hosted payment page; unpaid invoices show Pay online. No integration, no card data, no claims (decision 0014). | Yes. | None. |
| App UI on shadcn/ui (shipped 2026-09-18, decision 0011) | Forms, tables, badges, and alerts on shared components so screens are faster to add and consistent. | Yes. | None. |
| Recurring invoices (shipped 2026-09-18) | Service businesses bill monthly. Schedules generate drafts; the merchant approves or auto-sends. | Yes. | None. |
| Partial payments and payment records (shipped 2026-09-18, decision 0019) | Record deposits, installments, and offline payments against an invoice; balance due on the document. | Yes. | None. |
| Credit notes and voids with reason (void reason shipped 2026-09-18; credit-note documents later) | Corrections without deleting history. | Yes. | None. |
| Client statements (page shipped 2026-09-18; email later) | One page per client: open invoices, paid, balance. Emailable. | Yes. | None. |
| CSV export (shipped 2026-09-18) | Invoices and payments for a bookkeeper. | Yes. | None. |
| Team roles | Owner, member, read-only. Needed before agencies adopt. | Yes. | None. |
| Invoice templates and default terms (defaults shipped 2026-09-18; line-item presets later) | Net terms, default notes, line-item presets. | Yes. | None. |
| Vertical landing kits (shipped 2026-09-18 at `/for/*`) | Pages for contractors, agencies, consultants, wholesale, each tying the invoice tool to the CDG pricing that fits them. | Yes: content from templates. | Uses existing links. |
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
