# 0021: Collections technology, flows as data, and the learning loop

Status: Accepted 2026-10-12

## Context

Decision 0020 set the collections boundaries: B2B only, first-party, no funds, approval on every message, AI disclosure, and flat pricing never tied to recoveries. This decision picks the technology and the part that makes the product different: flows stored as data that improve from the user's own decisions.

Tagline: "Not all of us are human, but everyone deserves to be treated like one."

## Decision

- **Stack.** Next.js on Vercel, Neon Postgres, and Prisma, the same as ClientBilling. Long-running negotiation agents use **eve** (durable sessions, email and chat channels, scheduled follow-ups). **All rules and records live in our own database**, never only in agent session state: flows, policies, offers, messages, approvals, agreements, and usage. If the eve spike fails its criteria, the fallback is the AI SDK plus Vercel Cron and a database state machine.
- **Email.** Resend sends from the user's own verified domain. Inbound replies arrive through Resend inbound webhooks, using a per-account reply address. Nothing sends without passing the conduct checker and getting user approval (decision 0020).
- **Debtor page.** `/r/<token>`: an unguessable, expiring token per account shows the balance and offers, opens an AI chat that discloses itself and offers a person, and finalizes with a click-to-sign agreement and the user's own pay link.
- **Flows are data.** A flow is a versioned playbook of ordered steps. Step types are `message` (template and tone), `offer` (within the account policy), `wait` (duration or event), and `escalate` (hand off to the user). Flows map to debtor categories. Versions are immutable once used, and every message and offer records the flow version that produced it.
- **Debtor categories.** Each account gets a deterministic category from age bucket, relationship, balance band, and dispute flag, computed from the import and questionnaire. Disputed accounts always map to the human handoff category.
- **Policy is code.** The LLM writes language. Deterministic code decides offers from the questionnaire floor, plan limit, and concession ladder, and rejects anything outside them.
- **Learning loop.**
  1. Log every user decision on a draft (approve, edit with the diff, reject with a reason) and every outcome (reply, paid, plan, settled, dispute, opt-out, no response), linked to account, flow version, step, and category.
  2. Score each flow version per category on outcome rates: recovered share of balance, time to resolution, dispute and opt-out rates, and the user's edit and reject rate.
  3. Assign new accounts the best-scoring flow for their category. A configurable share (default 20%) is A/B assigned to a challenger, so flows keep improving. Flows with too little data use the default.
  4. Start with counts, rates, and A/B tests. Embedding similarity between accounts and between user edits comes later, under a new decision.
- **Humane code of conduct, enforced in code.** Every outbound message runs through a checker before it can be queued for approval. Each rule has a test, and a failure blocks the message:
  - AI disclosure present, and the offer of a person present.
  - No threats, no legal or credit-reporting claims the user has not configured, no false urgency, no shaming, no profanity.
  - Message caps per account (default at most 2 emails a week), send windows in the debtor's timezone, and opt-out honored.
  - A hardship check-in: the sequence asks whether the debtor is facing difficulty. Any sign of hardship pauses the account and hands it to the user.
- **Usage metering.** Count active accounts (being worked, not paid, settled, or paused) and agent emails sent per billing month against the plan limits in decision 0020. Overage is metered, never priced on recoveries.
- **Marketing.** Publish a "humane collections" playbook: our code of conduct and the practices behind it, as a public page. It doubles as positioning and accountability.

## Reasons

- Flows stored as data are what we can measure, version, and improve. Prompts alone cannot be audited or A/B tested.
- Keeping records in our own database avoids lock-in to a new framework and keeps the audit trail where compliance needs it.
- Simple statistics are explainable to users ("this flow recovered 62% for similar accounts") and need little data.

## Consequences

- New models: flows, flow versions and steps, categories, decision and outcome events, assignments, usage counters. Messages, offers, and agreements arrive in later issues.
- Every outbound message is traceable: account, category, flow version, step, checker result, user decision.

## Revisit when

The eve spike fails; flow scores need more data than single users produce (pooled anonymous stats would need a new decision and consent); or embeddings show a clear gain.
