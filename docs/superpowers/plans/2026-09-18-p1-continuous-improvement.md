# P1 continuous improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the highest-leverage P1 merchant value (aging, bookkeeper export, defaults, void reason, PDF logo, opt-in auto-reminders, client statements, vertical kits) in a safe PR stack without touching CDG integration or team auth.

**Architecture:** Keep domain logic in `src/lib/invoices/*` and thin Next.js routes/actions. Prefer read-only and download features before new outbound email. Reuse existing reminder sender, payment math, and PDF renderer. One decision record per non-obvious product call.

**Tech Stack:** Next.js 16 App Router, Prisma/Postgres, Resend, `@react-pdf/renderer`, existing shadcn app UI, GitHub Actions CI (`npm run check`, `npm run test:db`).

**Spec:** `docs/product/roadmap.md` (P1 + deferred P0 slices), `docs/product/invoice-mvp.md`, decisions 0004, 0012, 0015, 0016, 0019, 0020, 0021.

## Global Constraints

- Work in a git worktree; never commit on the primary `main` checkout.
- `npm run check` and relevant `npm run test:db` cases must pass before each PR merge.
- No card data, no funds, no MoR, no `COLLECT_ONLINE`, no gateway credentials (`docs/mission/compliance-boundary.md`).
- No em dashes or en dashes in copy, comments, or docs.
- Cite mission files in PRs that touch email, auth, CDG, legal, or Collect.
- Stop-and-ask before new email types, CDG URL/claim changes, or auth/session loosening (`docs/agents/operating-manual.md`).
- Update `docs/product/invoice-mvp.md` in the same PR when scope changes.

---

## Wave overview (PR stack)

| PR | Scope | Size | Schema | Stop-and-ask |
| --- | --- | --- | --- | --- |
| 1 | Aging buckets on dashboard | S | No | No |
| 2 | CSV export (invoices + payments) | S | No | No |
| 3 | Default terms on business profile | S/M | Yes | No |
| 4 | Void with required reason | S | Yes | No |
| 5 | Logo on PDF | M | No | Soft (fetch limits) |
| 6 | Opt-in automatic reminders (+3 / +10) | M | Yes | Cite 0004/0015; same body as manual |
| 7 | Client statement page (no email) | M | No | Email later needs ask |
| 8 | Vertical landing kits | M | No | Yes for new CDG claims/URLs |

**Defer:** full credit-note documents, team roles, MCP server, emailable statements, QBO CSV, Recharts, webhooks, client portal.

---

### Task 1: Aging buckets on dashboard

**Files:**
- Modify: `src/app/app/page.tsx`
- Create (optional helper): `src/lib/invoices/aging.ts`
- Test: extend `scripts/test-db-flows.ts` with pure aging helper cases (no DB required for bucketing math)

**Interfaces:**
- Consumes: open invoice rows with `dueDate`, `totalCents`, `paidCents`, statuses in `sent|viewed|overdue`
- Produces: `agingBuckets(invoices, now) => { current, d1to30, d31to60, d60plus }` balances in cents (outstanding = total - paid)

- [ ] **Step 1: Add pure bucketing helper and assertions in `test-db-flows.ts` (or a tiny node assert block)**
- [ ] **Step 2: Render four bucket tiles (or a second row) under the existing summary cards on `/app`**
- [ ] **Step 3: Keep Outstanding / Overdue / Paid this month; do not remove them**
- [ ] **Step 4: `npm run check`; commit; open PR; update `invoice-mvp.md` Measurement/dashboard note**

**Verify:** Dashboard with mixed due dates shows correct bucket cents; empty state unchanged.

---

### Task 2: CSV export of invoices and payments

**Files:**
- Create: `src/app/app/export/route.ts` (or `/app/export/page.tsx` + download links)
- Create: `src/lib/invoices/export-csv.ts`
- Modify: `src/app/app/page.tsx` or settings to link "Download CSV"
- Modify: `docs/product/invoice-mvp.md`, cite decision 0012
- Test: unit assertions on CSV escaping in `test-db-flows.ts`

**Interfaces:**
- Consumes: `prisma.invoice` + `prisma.payment` for `userId`
- Produces: `text/csv` attachments `invoices-YYYY-MM-DD.csv` and `payments-YYYY-MM-DD.csv`

- [ ] **Step 1: CSV helpers with RFC-style quoting for commas/quotes/newlines**
- [ ] **Step 2: Auth-gated GET routes scoped by `requireUser()`**
- [ ] **Step 3: Columns: invoice number, status, client, dates, money fields, paidCents, balance; payment amount, method, paidOn, invoice number**
- [ ] **Step 4: Link from dashboard or settings; no QBO-specific format**
- [ ] **Step 5: check + commit + PR**

**Verify:** Export with a partial payment shows balance correctly; signed-out request redirects/401.

---

### Task 3: Default terms on business profile

**Files:**
- Modify: `prisma/schema.prisma` (`BusinessProfile` defaults)
- Create migration under `prisma/migrations/`
- Modify: `src/app/app/actions.ts` (`businessSchema`, `updateBusinessAction`)
- Modify: `src/components/app/BusinessForm.tsx`
- Modify: invoice create path (`InvoiceEditor` / `createInvoiceAction`) to prefill
- Modify: `docs/product/invoice-mvp.md`

**Interfaces:**
- Produces: `defaultDueInDays Int @default(14)`, `defaultNotes String?`, `defaultTaxRateBps Int @default(0)`

- [ ] **Step 1: Migration + form fields with validation (due days 0-365, tax 0-100%)**
- [ ] **Step 2: New invoice form defaults from business profile**
- [ ] **Step 3: Recurring create can reuse the same defaults where empty**
- [ ] **Step 4: check + `test:db` smoke + PR**

**Defer in this task:** line-item preset library.

---

### Task 4: Void with required reason

**Files:**
- Modify: `prisma/schema.prisma` (`Invoice.voidReason String?`)
- Modify: `src/lib/invoices/service.ts` (`setInvoiceStatus`)
- Modify: `src/components/app/StatusForm.tsx`
- Modify: API `POST /api/v1/invoices/:id/status`
- Modify: `docs/agents/api.md`, `invoice-mvp.md`
- Decision: short record if product call needs one (void reason required)

**Interfaces:**
- Produces: void transition requires non-empty reason (max ~500 chars); stored on invoice and in `InvoiceEvent` meta

- [ ] **Step 1: Schema + require reason in service for `void`**
- [ ] **Step 2: UI confirmation field; API 400 without reason**
- [ ] **Step 3: Show reason on invoice detail; never delete payment history**
- [ ] **Step 4: check + test:db void path + PR**

**Defer:** standalone credit-note documents / numbering.

---

### Task 5: Logo on PDF

**Files:**
- Modify: `src/lib/invoices/pdf.tsx`
- Optional helper: `src/lib/invoices/logo.ts` (https-only fetch, timeout, max bytes, content-type image/*)
- Test: helper rejects http / oversized / non-image

- [ ] **Step 1: Fetch logo with 2s timeout and ~500KB cap; https only**
- [ ] **Step 2: Pass buffer/data URI into `@react-pdf/renderer` Image when present**
- [ ] **Step 3: On failure, render text header only (never fail the PDF route)**
- [ ] **Step 4: check; manual PDF download with and without logoUrl + PR**

---

### Task 6: Opt-in automatic reminders

**Files:**
- Modify: `BusinessProfile` with `autoReminders Boolean @default(false)`
- Create: `src/app/api/cron/reminders/route.ts`
- Modify: `vercel.json` cron schedule
- Modify: settings payments/business UI toggle
- Modify: `src/lib/invoices/email.ts` if markers needed (`reminder_auto_3`, `reminder_auto_10` events)
- Modify: `docs/agents/runbooks/chase-unpaid.md`, `invoice-mvp.md`
- Cite: decisions 0004, 0015 in PR body

**Interfaces:**
- Cron selects overdue invoices for users with `autoReminders`, dueDate + 3 or +10 days, no recent `reminder_sent` within 24h, under hourly email cap
- Reuses `sendInvoiceReminder` body/recipient rules (client on file only)

- [ ] **Step 1: Schema + settings toggle (off by default)**
- [ ] **Step 2: Cron with `CRON_SECRET` timing-safe auth (copy overdue pattern)**
- [ ] **Step 3: Idempotent markers so +3 and +10 each fire once**
- [ ] **Step 4: Runbook + mvp docs; check; PR**

**Stop-and-ask only if** the email body or audience would differ from the manual reminder.

---

### Task 7: Client statement page (no email)

**Files:**
- Create: `src/app/app/clients/[id]/page.tsx` (detail + statement sections)
- Optional: statement PDF route reusing money helpers
- Modify: clients list links
- Modify: `invoice-mvp.md`

- [ ] **Step 1: Page lists open invoices, paid invoices, balance owed (sum of balances)**
- [ ] **Step 2: Print-friendly layout; no affiliate CTAs**
- [ ] **Step 3: Do not add email send in this PR**
- [ ] **Step 4: check + PR**

---

### Task 8: Vertical landing kits

**Files:**
- Create marketing routes under `src/app/(marketing)/` for contractors, agencies, consultants, wholesale
- Reuse `src/lib/cdg.ts`, `src/lib/cta.ts`, STYLE_GUIDE templates
- Update sitemap

- [ ] **Step 1: Draft pages using existing sourced CDG numbers only**
- [ ] **Step 2: CTA ladder only through `CtaButton` / site.ts URLs**
- [ ] **Step 3: Stop-and-ask before any new fee claim or new CDG destination**
- [ ] **Step 4: style-check + PR**

---

## Out of scope (do not implement in this plan)

- Team roles / org membership (auth blast radius; wait for a real agency ask)
- MCP server (after export/statement API stability)
- Full credit notes as a document type
- Emailable statements (new email type: ask founder)
- Quantum / `COLLECT_ONLINE`
- QuickBooks-format CSV (P2)

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-18-p1-continuous-improvement.md` (on branch `feat/csp-and-ci`; cherry-pick or recreate on a fresh worktree from `main` after PR 19 merges).

**Two execution options:**

1. **Subagent-Driven (recommended)** - fresh subagent per task, review between tasks
2. **Inline Execution** - this session implements Wave tasks with checkpoints

Start with Task 1 after PR 19 is merged so CI stays green on `main`.
