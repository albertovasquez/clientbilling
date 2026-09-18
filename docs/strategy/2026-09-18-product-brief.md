# ClientBilling: product potential, UI stack, and agent alignment

Date: 2026-09-18. Author: the session agent, at the founder's request. Opinionated by design. Anything about CDG residuals is flagged as unconfirmed until `docs/mission/affiliate-cdg.md` says otherwise.

## 1. Executive narrative

ClientBilling can become the default invoicing tool for U.S. service businesses that have outgrown flat-rate processing, and the way those businesses get a real merchant account without reading a rate sheet. Not because free invoicing is scarce (Wave, Zoho, and Invoice Ninja give it away) but because none of them turn payer demand into a merchant account with published interchange-plus pricing. The invoice is the moment a business discovers it wants card payments; the merchant account is what makes that moment pay for the free tool.

The ceiling over 12 to 24 months, if we stay disciplined: a few thousand active invoicing accounts, a few hundred CDG merchant accounts referred through the product rather than the blog, and a residual stream that funds the product without a paid tier. That is a small, durable business with agent-run operations and near-zero marginal cost, and it is a defensible position as long as we never drift into becoming a processor.

Who wins with us, in order: U.S. contractors, consultants, and agencies that invoice clients and process $10K to $200K a month by card (this is where CDG's published markups beat Square, PayPal, and Stripe by hundreds of dollars a month); B2B sellers with invoices in the four figures where per-transaction fees matter less than percentage; and the "internet" vertical already in the funnel, meaning online services that invoice. Retail and restaurant, also in the funnel, are not invoice businesses; they stay content-only referrals. Hobby freelancers under a few thousand a month can use the tool, and the content should keep telling them a flat-rate processor is cheaper for them.

The activation loop that ties the two halves together: create invoice, send, payer opens, payer asks to pay by card, merchant sees demand, merchant clicks Collect, CDG quote, approval, pay link on the invoice, paid invoices, residuals. Every P0 item below is a link in that chain, and the loop is measurable end to end with the event table that now exists.

## 2. Moats: real and fake

Real, for us specifically:

- **Residual economics via R=470**, if confirmed. A referral that pays on volume for the life of the merchant means the invoice tool can be free forever without a paid tier, which no VC-funded invoicing product can match on an SMB that processes $30K a month. Diligence flag: questions 1 and 2 to CDG are still open.
- **Vertical copy that already ranks.** The reviews and comparisons earn trust on the exact question the merchant is asking at the moment of Collect. Competitors' invoicing tools have no editorial voice on processor choice; they are the processor.
- **Payer-demand data.** Knowing which merchants' payers are asking to pay by card is a targeting signal nobody else in this niche has. It makes concierge onboarding efficient.
- **Agent-operable operations.** A product whose runbooks let one person plus agents onboard, chase, and support hundreds of merchants keeps costs near zero. This is a moat only if the runbooks are real and the API exists.
- **Speed and calm.** A two-minute create-and-send on a phone, no analytics bloat, no upsell modals. Boring, and rare.

Fake, for us:

- "Free invoicing." Wave has it, with payments, today.
- "No card data on our servers." Table stakes; every hosted-checkout product says it.
- Network effects. Payers do not become merchants at any meaningful rate.
- The Quantum integration itself. Anyone with an agent agreement can build it.
- Design. It helps conversion; it does not stop a copy.

## 3. Non-goals

| We will not | Because | We do instead |
| --- | --- | --- |
| Become merchant of record, a payfac, or a money transmitter | Liability, regulation, and it is not the business | Merchant's own CDG account; Quantum hosted pay |
| Touch card data, even transiently | PCI scope and breach exposure | Hosted page or iframe on Quantum's origin |
| Hold, move, or refund funds | Money transmission; float risk | Settlement from CDG to the merchant's bank |
| Store gateway credentials | A breach would compromise merchants' processing | Merchant-side configuration; signed post-backs to us |
| Add a second processor | The single-partner economics and the honesty of one recommendation | Revisit only by decision record, with CDG's answer in hand |
| Build accounting, payroll, tax, or lending | Someone else's core and regulator | CSV and QBO-format exports |
| Sell to payers | The payer is the merchant's customer | Payer pages carry only the merchant |
| Run third-party analytics | Owner's choice; privacy page simplicity | First-party event table |

## 4. Feature backlog

Agent-operable means an agent can perform or verify the feature through a documented API, UI, or runbook without inventing policy. CDG dependency is stated honestly; "uses existing links" means only the already-allowed R=470 URLs.

### P0 (four to six weeks)

| Feature | Why it matters | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Payer card-intent loop | The honest demand signal and the trigger for Collect. On unpaid public invoices: "Prefer to pay by card? Let {merchant} know." Records an event, emails the merchant, shows a count on the dashboard. Copy says card payment is planned. | Yes (event + email) | None |
| Overdue detection and reminders | Chasing is the second most valuable thing an invoice tool does. Nightly cron marks overdue; manual "Send reminder"; opt-in auto reminders at +3 and +10 days, capped, to the client on file only. | Yes (cron + endpoint) | Resend only |
| Aging view | Outstanding by bucket, paid this month, oldest unpaid. The screen a merchant opens every Monday. | Yes (read-only) | None |
| Branded PDF | Merchants attach invoices to email threads and portals. Server-rendered from data, logo and instructions included, downloadable from `/i/*`. | Yes (route handler) | None |
| Concierge Collect | "Enable card payments" captures business type and monthly volume in CDG's own labels, records the request, emails the founder, shows the CDG quote link. Human walks the merchant through. Measures Collect demand before any integration exists. | Capture yes; walk is human | Uses existing links |
| Agent surface v1 | Personal API keys; REST for clients, invoices, send, status, reminders; runbooks for create-and-send, chase unpaid, open collect. Makes everything above operable by an agent. | This is the enabler | None |

### P1

| Feature | Why | Agent-operable | CDG dependency |
| --- | --- | --- | --- |
| Quantum pay link on `/i/*` with post-back status | The product's reason to exist. Hosted pay page for the merchant's account; amount and invoice reference passed in; paid status by signed post-back. | Yes once built | CDG: permission, method, sandbox |
| Recurring invoices | Monthly billing is the norm for services. Schedules generate drafts; auto-send optional. | Yes | None |
| Partial payments and payment records | Deposits and installments; balance due on the document. | Yes | None |
| Credit notes | Corrections without deleting history. | Yes | None |
| Client statements | Per-client open and paid view; emailable. | Yes | None |
| CSV export | The bookkeeper handoff. | Yes | None |
| Team roles | Agencies need a second seat before they commit. | Yes | None |
| Templates and default terms | Net terms, default notes, line presets. | Yes | None |
| Vertical landing kits | Contractors, agencies, consultants, wholesale: each page ties the invoice tool to the CDG pricing that fits. | Yes (content) | Uses existing links |
| MCP server | The same operations as tools, so any agent client can run the runbooks. | Agent surface v2 | None |

### P2

Client portal, multi-currency (only on a real request; check CDG support first), attachments, QuickBooks-format export, cash-flow view, CRM-lite notes, referral program. Multi-currency and referral wait until retention is known.

Rejected as written, with the Quantum-shaped alternative: "save card for next time" (Quantum-side card on file only, if it exists there); "instant payout" (nothing; CDG funds the merchant); "refund from the app" (link to Quantum); "collect a deposit before approval" (record an offline deposit, no card).

## 5. Look and feel and component libraries

Recommendation: **shadcn/ui on Radix and Tailwind for the app**, keep the existing marketing primitives, add **cmdk** (already inside shadcn's Command), **shadcn charts on Recharts** for the aging and cash-flow views, **React Email with Resend** for all outbound email, and **@react-pdf/renderer** for PDFs. Do not adopt Catalyst, Mantine, Chakra, or Park UI.

| Option | Fit for ClientBilling | Trade-offs | Verdict |
| --- | --- | --- | --- |
| shadcn/ui + Radix + Tailwind | Copy-in components you own, Tailwind v4 support, CSS variables map directly onto the existing `ink / paper / action` tokens, excellent Table, Dialog, Sheet, Command, Toast, Form patterns for dense app chrome. RSC-friendly: most components are server-safe, the interactive ones are marked client. | You maintain the copied code; no upstream upgrades for free. Radix adds some client JS on interactive screens only. | Winner for `/app` |
| Catalyst (Tailwind UI) | Beautiful dense chrome, sidebar layouts. | Paid license, overlaps shadcn almost entirely, Headless UI instead of Radix, harder to theme onto our tokens. | Skip; borrow layout ideas only |
| Tremor | Dashboard blocks out of the box. | Heavier, opinionated visuals, another theming layer over Recharts. | Skip; shadcn charts give the same on Recharts with our tokens |
| Recharts (via shadcn charts) | Aging bars, paid-vs-outstanding lines, tokens applied through CSS variables. | Client-side only; fine for two or three charts. | Use |
| React Email + Resend | Typed, previewable invoice and reminder emails; Resend is already the provider. | Adds a render step per send. | Use |
| @react-pdf/renderer | Deterministic branded PDFs from the same data as the page; runs in a Node route handler. | Layout is its own primitive set, not HTML; fonts must be registered. Print-CSS is the fallback but headless rendering on Vercel is heavier. | Use |
| cmdk | Power-user and agent-like command menu ("new invoice", "find client", "send reminder"). | None meaningful. | Use, through shadcn Command |
| Mantine, Chakra, Park UI / Ark | Complete systems. | Their own styling runtimes fight Tailwind tokens; the bundle grows; RSC boundaries are noisier. Park UI is closest in spirit but smaller ecosystem. | Skip |

Migration sketch from the current UI:

1. Keep `src/components/ui` for marketing pages; it already matches the style guide. Install shadcn with the Tailwind v4 preset into `src/components/app/ui` and map its CSS variables to the existing tokens in `globals.css` (`--background` to paper, `--foreground` to ink, `--primary` to action, `--muted` to field, `--border` to rule, `--destructive` to verdict). No second palette.
2. First components: Button, Input, Label, Textarea, Select, Table, Dialog, Sheet, DropdownMenu, Toast, Command. Replace `form-styles.ts` and the hand-rolled buttons in `/app` with them, screen by screen: sign-in, dashboard, invoice editor, invoice detail, clients, settings.
3. Replace `AppShell` with a sidebar layout (Catalyst-style structure, shadcn parts): invoices, clients, aging, settings, and the command menu on a shortcut.
4. Add React Email templates for invoice, reminder, and reset; render them in the existing send route and the reset action.
5. Add the PDF route: `/api/invoices/[id]/pdf` for the merchant, and a signed public variant linked from `/i/*`.
6. Charts last, when the aging view lands.

Visual system, in short:

- Type: Source Serif 4 for display and for the invoice document's totals; Source Sans 3 for everything else; tabular figures always on.
- Color: ink on paper, one action color (teal), one verdict color (amber) for warnings and best-for; no gradients, no purple. Status chips are neutral with the action color reserved for paid.
- Density: comfortable on marketing, compact in app tables (small text, 40px rows), generous on the invoice document.
- Empty states: one sentence of what this screen will show, one primary action, no illustration.
- The invoice document on `/i/*`: a white sheet on a field background with real margins, the merchant's name and logo top left, the number and status top right, ruled line items, a right-aligned totals block, the "How to pay" section as the only box, and ClientBilling only in the footer. It should print as the same document it displays.

## 6. Mission and agent documentation

Proposed and created in this PR. Each file's purpose:

- `docs/mission/README.md`: index and reading order for agents; the ownership table saying who may edit what; the one-line summary of the business. Read first, every session.
- `docs/mission/north-star.md`: the thesis, the two halves, the R=470 rule, and the "never become" table. Founder-owned. Cited in any PR that touches Collect or CDG.
- `docs/mission/compliance-boundary.md`: the six hard lines and the allowed shapes for pay buttons, status, refunds, onboarding. Founder-owned. The file that rejects features.
- `docs/mission/affiliate-cdg.md`: the diligence table with status and evidence, the allowed destinations and audiences, how CDG is described, what the relationship does not permit. Updated with every CDG answer.
- `docs/mission/product-principles.md`: ten principles, from "unpaid invoices always work" to "agents must be able to operate it".
- `docs/product/invoice-mvp.md` (exists): the current scope, flows, env, and ops. Evolves with every scope change; it must never describe something that is not shipped.
- `docs/product/roadmap.md`: P0, P1, P2 with agent-operability and CDG dependency per item, plus the "deliberately not on the roadmap" list.
- `docs/agents/operating-manual.md`: what an agent may do alone, the nine stop-and-ask triggers, the PR citation block, copy rules, runbook location.
- `docs/agents/definition-of-done.md`: the checklist for code, product, documentation, and process, including real-database verification and live checks.
- `docs/decisions/` (exists): append-only decision records.

Editing rights and the citation rule are in the README and the operating manual. The short version: the founder owns the north star, the boundary, and the affiliate terms; agents propose everything else by PR and must cite mission files when the diff touches Collect, CDG copy, fees, legal pages, auth, or email.

## 7. Examples worth studying

Simple invoicing UX:
- Wave Invoicing: the create screen, where line items, tax, and send live on one page with no wizard. Copy the flow, not the look.
- Stripe Invoicing's editor: the live preview beside the form, and the "send" step that shows exactly what the customer will receive.
- Invoice Ninja (open source): the client and product presets, and recurring schedules; a reference for data model completeness, not for visual design.

Public invoice document:
- Stripe hosted invoice page: one sheet, merchant identity first, one pay action, a PDF link, nothing else. Our `/i/*` should feel like it with the pay action replaced by instructions until Quantum lands.
- PayPal invoice page: shows what to avoid, the processor's brand louder than the merchant's.
- Wave's public invoice: a good "how to pay" block for offline methods.

Merchant apply and payments onboarding without merchant-of-record positioning:
- Helcim's sign-up: pricing before the form, a plain volume question, and an honest "we will call you" step. The closest model for our Concierge Collect.
- CDG's own quote form: four fields and a phone call. Our pre-qualification should ask the same business-type labels so the merchant is not re-asked.
- Square's onboarding: study the speed, and remember it is the aggregator model we do not copy.

## 8. First two weeks if one agent owns execution

Week 1

1. Day 1: this docs PR merged; `AGENTS.md` points to `docs/mission/README.md`; a runbooks folder with the first three runbooks stubbed from real procedures.
2. Days 2 to 3: payer card-intent loop. Button on unpaid `/i/*`, event, email to the merchant, dashboard count, decision record.
3. Days 4 to 5: overdue cron and reminders. Vercel Cron route, status flip, manual reminder from the invoice page, React Email template for reminders.

Week 2

4. Days 6 to 7: branded PDF route and download link on `/i/*` and the invoice page; email attaches it.
5. Days 8 to 9: agent surface v1. API keys table, REST endpoints under `/api/v1/*`, runbooks updated to use them, a smoke script against Docker Postgres.
6. Day 10: aging view on the dashboard with shadcn installed and mapped to tokens; the first `/app` screen migrated.

Throughout: check the funnel page daily; Concierge Collect capture ships whenever a half day frees up because it is mostly a form and an email.

## 9. Open questions for the founder

1. Has CDG answered questions 1 and 2? Everything about Collect beyond concierge waits on that, and if the answer is no, the north star's second half needs a new partner or a new plan.
2. Will you personally run Concierge Collect for the first fifty merchants? The loop needs a human until the pay link exists.
3. Free forever funded by residuals, or a paid tier for teams? The roadmap assumes free forever; a paid tier changes priorities toward team roles and exports.
4. Do you want the shadcn migration to start now on `/app` or after P0 features ship in the current primitives? The recommendation is after, so features are not blocked on chrome.
5. Is the accountant channel (CSV, QBO) a real acquisition path for you, or a checkbox? It changes whether exports are P1 or P2.
6. Has the Neon project moved to `us-east-1` yet? Latency is the cheapest win on the list.
