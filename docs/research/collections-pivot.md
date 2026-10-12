# Collections pivot research: AI client collections

Date: 2026-10-12. Status: research only. **This is not legal advice.** Have a collections or fintech attorney review the launch path before any outreach to debtors. Every external claim is linked to its source. Numbers are the sources' own figures and have not been verified independently.

## TL;DR

- **Launch path:** B2B-only (business owing business), and **first-party software**. The creditor's agent sends messages in the creditor's own name from the creditor's own domain, payments go to the creditor's own pay link, and the creditor approves settlement policy. We are a software vendor, not an agency. This avoids most of the FDCPA/Reg F regime and most state licensing.
- **The catch with "15% only if you get paid":** a percentage of collections combined with us negotiating is what an agency does. Courts look at whether the vendor *meaningfully participates* in collection. Messaging written by our AI, a negotiation agent and handling debtor replies all point toward participation. Lower-risk pricing is **SaaS plus a success fee framed as a software outcome fee**, never sending under our name, and with the creditor approving policy. Even then, get counsel's sign-off on the success fee. The consumer-debt and debt-buying ideas (AT&T-style old-debt settlements) are phase 3, and they require licensing.
- **Brand:** a separate name that shows up only on the creditor's dashboard. The debtor sees the creditor. For example "ClientBilling Recover" internally; the debtor never sees it.

## 1. Legal and licensing (US first)

**FDCPA / Reg F scope.** Reg F covers *consumer* debt only, meaning personal, family or household obligations. Business debt is excluded. https://www.law.cornell.edu/cfr/text/12/1006.2 , https://files-prod.consumerfinance.gov/f/documents/cfpb_fair-debt-collection-practices-act-fdcpa-procedures_2022-12.pdf

**Who counts as a "debt collector":** anyone who regularly collects debts owed to *another*. A creditor collecting its own debts is excluded **unless it uses a name other than its own** that suggests a third party. https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text , https://www.law.cornell.edu/cfr/text/12/1006.2

**Flat-rating (15 USC 1692j):** it is unlawful to furnish forms that make a consumer believe a third party is collecting when it isn't. Vendors that *do* meaningfully participate become collectors. In Echlin v. PeaceHealth, the court counted screening accounts, composing letters, answering debtor questions and running an account portal as participation. https://uscode.house.gov/quicksearch/get.plx?section=1692j&title=15 , https://www.consumerfinancialserviceslawmonitor.com/wp-content/uploads/sites/880/2018/05/Echlin-v.-PeaceHealth.pdf , https://www.ballardspahr.com/insights/alerts-and-articles/2018/05/involvement-in-hallmark-debt-collection-activities-not-required-meaningful-participation
→ Design implication: in the creditor's name, we must not pose as a third party. If we ever brand ourselves to debtors as a collector, we are one and we must be licensed.

**Reg F rules that apply if we ever touch consumer debt:**
- Validation notice in the first communication or within 5 days (12 CFR 1006.34, model form B-1).
- Every email or text needs a clear opt-out (1006.6(e)), plus documented procedures for email addresses and phone numbers (1006.6(d)).
- No more than 7 calls in 7 days, and no call within 7 days after a conversation (1006.14).
https://www.law.cornell.edu/cfr/text/12/1006.6 , https://www.govinfo.gov/content/pkg/CFR-2025-title12-vol8/pdf/CFR-2025-title12-vol8-part1006-subpartB.pdf

**State law:**
- **California:** SB 1286 extended the Rosenthal Act to "covered commercial debt" where a *natural person* owes or guarantees up to $500k, for debts entered, renewed, sold or assigned on or after 7/1/2025. The creditor side covered is lenders, commercial financing providers and debt buyers. It **excludes** commercial collection from DFPI licensing. The Rosenthal definition of debt collector includes anyone who "composes and sells... forms, letters... used for debt collection," and it covers first parties collecting their own debts, so a California consumer-side product would be squarely covered. https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB1286 , https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=1.&chapter=&division=3.&lawCode=CIV&part=4.&title=1.6C. , https://katten.com/california-enacts-new-requirements-related-to-collection-of-commercial-debt-in-amounts-less-than-500000
- **Texas:** third-party collectors as defined by the FDCPA must file a $10,000 surety bond with the Secretary of State. https://statutes.capitol.texas.gov/?artSec=392.101&chapter=FI.392&code=FI&tab=1 , https://www.sos.texas.gov/statdoc/faqs2900.shtml
- **New York City:** a DCWP license ($150 for 2 years, plus a $5,000 bond) is required to collect *personal or household* debts from NYC residents, including for out-of-state agencies and debt buyers. The SHIELD Rule takes effect 1/1/2027. https://www.nyc.gov/site/dca/businesses/license-checklist-debt-collection-agency.page , https://portal.311.nyc.gov/article/?kanumber=KA-01855
- **Florida** and many other states require registration for consumer collection agencies. Not researched in depth; counsel should run a 50-state matrix before any consumer launch.

**Debt buying** (buying old debt at a discount) makes us a debt buyer and collector. That means licenses in many states, NYC included, plus capital risk. Not an MVP.

**TCPA / AI voice.** The FCC ruled (Feb 2024) that AI-generated voices count as "artificial/prerecorded," so prior express consent is required. **No AI voice calls in the MVP.** https://www.fcc.gov/document/fcc-confirms-tcpa-applies-ai-technologies-generate-human-voices

**AI disclosure.** California's bot law (SB 1001) requires disclosing a bot used to influence a commercial transaction, and Utah has AI-disclosure duties (summarized in https://www.retellai.com/blog/tcpa-compliance-playbook-voice-ai-outbound ). Policy: **always disclose**, e.g. "I'm an AI assistant for [Creditor]; you can reach a person any time." It's the right thing to do anyway and fits "be human, be considerate."

**Colombia, briefly.** Ley 2300 de 2023 applies to anyone doing cobranza, directly or through third parties. It allows only channels the debtor has authorized; contact Mon–Fri 7am–7pm and Sat 8am–3pm, never Sundays or holidays; at most once a day and not several channels in the same week. https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=213990 . Habeas data (Ley 1581/2012) applies to the uploaded debtor data (not researched in depth). Colombia is a reasonable second market for B2B, with the scheduler enforcing these windows.

### Lowest-risk launch path
1. **B2B only.** At onboarding, the creditor attests that debts are commercial and owed by businesses. Block accounts that look like individuals or consumers. In California, avoid individuals and personal guarantors.
2. **Creditor's name, creditor's domain** (verified sending domain or the creditor's mailbox via OAuth). No "collections" branding toward debtors.
3. **The creditor sets policy** (floors, plan limits, tone) and approves templates. Above set thresholds a human approves; the agent negotiates only inside the creditor's own pre-approved rules.
4. **Money goes directly to the creditor** (their pay link / PayPal / Stripe). We never touch funds, which is consistent with decision 0014.
5. **Pricing:** SaaS base plus a "success fee" on payments made through the tracked links. **Counsel question #1:** does a percentage fee combined with AI negotiation make us a third-party collector in the target states? A fallback is flat per-account or per-recovery fees, or SaaS-only.
6. **Email and web chat only.** No calls, no SMS, no AI voice.
7. **Phase 3 (licensed):** consumer accounts and old-debt settlements through a licensed agency partner, or our own licensing (TX bond, NYC DCWP, CA DFPI, etc.).

## 2. Competitors

| Player | Segment | Model / pricing (public) | Gap vs us |
|---|---|---|---|
| Chaser | B2B AR reminders + agency services | about $259 / $779 / $1,169 per month (https://debtagent.ai/debt-collection-software-pricing) | Dunning templates, no negotiation agent, monthly fee |
| Upflow | B2B AR | Free analytics tier; collections quote-only (https://upflow.io/pricing) | Mid-market focus |
| Kolleno | B2B AR | about €545–1,245/user/mo (https://www.kolleno.com/pricing/) | Expensive per seat |
| Tesorio, Gaviti | Mid-market/enterprise AR | Quote-only, Tesorio about $25–40k/yr (https://toolmasta.com/blog/accounts-receivable-automation-pricing) | Not built for freelancers or SMBs |
| TrueAccord | Licensed consumer agency, ML-driven digital | Contingency, undisclosed; HeartBeat ML engine (https://blog.trueaccord.com/2021/12/how-trueaccord-embraces-machine-learning-to-create-positive-consumer-experiences-in-debt-collections/) | Consumer, enterprise clients |
| InDebted, Receeve, Symend, Kompato | Consumer agency or engagement platforms for lenders and telcos | Enterprise or contingency (not verified) | Not available to small businesses |
| Collectly | Healthcare patient billing | Performance-based; one listed tier $19–199/mo (https://debtagent.ai/debt-collection-software-pricing) | Healthcare-specific |
| Peach Finance | Loan servicing/collections infrastructure for lenders | Enterprise (not verified) | Lenders only |
| Vodex, Skit.ai | AI voice collection agents | Usage or enterprise (not verified) | Voice brings TCPA risk |
| Traditional agencies | All | 20–50% contingency by age (below) | Slow, impersonal, damage the relationship |
| "AI agency" newcomers | SMB | Claim 5–15% (https://www.agentcollect.com/blog/how-much-do-collection-agencies-charge) | Direct analogs; check their licensing positioning |

**Gap:** a cheap, relationship-preserving collector for freelancers and SMBs. It runs in *their* name, negotiates within *their* rules, tracks everything, and charges only when money comes in. B2B AR tools are monthly-fee dunning, and AI agencies are third-party. The "first-party agent with outcome pricing" position looks open.

## 3. Evidence

- **Recovery decays with age (commercial):** CLLA figures via NACM put recovery at 94% at 30 days, 74% at 90 days, 58% at 6 months, 43% at 9 months and 27% at 1 year. https://msbureau.com/blog/the-90-day-rule-b2b-account-age-recovery/ . Agency dollar-recovery benchmarks: 40–55% at 61–90 days, 15–25% at 6–12 months, under 5% beyond 3 years; about 1% of collectability lost per week after 90 days. https://collectionagencies.com/hire/collection-agency-success-rates
- **Typical contingency rates:** about 20–25% under 90 days, 25–35% at 90–180 days, 35–45% at 180–365 days, and 40–50% after a year or when legal work is involved. https://www.swrecovery.com/resources/blog/collection-agency-fees-average-percentage-who-pays/ , https://ergroupllc.com/blog/how-much-do-collection-agencies-charge . **So a flat 15% is very aggressive (cheap) for fresh debt and unsustainable for old debt.** Tier it by age.
- **Empathetic, digital-first collection works, per vendor case studies:** TrueAccord reports 23% higher liquidation on some portfolios and, in one lender A/B test, a 30% better late-stage result. https://blog.trueaccord.com/2024/09/client-success-story-online-lender/ (vendor data, not independent).
- **Selling point:** speed matters more than fee. Starting at day 1–30 instead of day 120 is the biggest lever, and that favors software the creditor runs early over agency placement.

## 4. Product design

### Onboarding upload (CSV/XLSX or ClientBilling import)
Required: `debtor_name, debtor_type (business|individual), contact_name, email, amount_owed, currency, original_due_date, description`.
Optional: `invoice_number, phone, country/state, last_contact_date, last_payment_date, documents_url, notes`.
Validation: individuals are blocked in MVP; dates are parsed; age buckets are computed; duplicates are detected. Accounts already in ClientBilling auto-import with their history.

### Per-account Q&A (with defaults from the category, so the owner only fills in what differs)
1. Relationship: active client / ended / one-off / want to keep working together?
2. Any dispute or quality complaint? (yes → human-first flow, no negotiation)
3. Minimum acceptable settlement % (floor), and the opening ask.
4. Max plan length (months) and minimum installment.
5. Tone: warm / neutral / firm.
6. Escalation: what happens if there's no reply by day X (owner call, small claims, agency referral, write-off). **The bot never threatens action the owner hasn't approved and won't take** (FDCPA-style deception rules are good practice even for B2B).
7. Hard stops: never contact after date X, CC person Y, language.

### Category taxonomy and learned flows
Categories = age bucket (0–30, 31–90, 91–180, 181–365, 1–3y, 3y+) × relationship (active/ended) × size band × dispute flag. Each category maps to a **playbook**: cadence, tone, opening ask, floor and plan limits, escalation. New accounts get the nearest playbook; owner overrides are saved and become that owner's default for the category. Later, outcome data (reply rate, recovery %) ranks playbook variants with a simple bandit. No black box: the dashboard shows "why this flow."

### Negotiation policy engine (deterministic, outside the LLM)
The LLM drafts language. **Code** decides offers: it gets `policy = {floor_pct, opening_pct, max_months, min_installment, concession_steps, expiry_days}` and validates every proposed offer before it can be sent. Anything outside policy goes to a human approval queue. Concession ladder: full balance → plan at full balance → small discount for lump sum → floor. Every offer is logged with the policy version.

### Agent workflows
- **Email agent:** a sequence in the creditor's name with dry-run previews. Inbound replies are parsed (intent: pay / plan / dispute / hardship / wrong person / stop / angry), and it answers within policy or hands off.
- **Chat agent:** a link on the pay page, `/r/<token>`, where the debtor can ask about the balance, see the invoice and pick a plan or settlement. Proposals come from the policy engine.
- **Human handoff when:** dispute, legal mention or lawyer, bankruptcy, hardship or emotional distress, "stop contacting" (also enforced as a hard stop), wrong person, offer below the floor, a third angry message, or any question the agent can't answer from facts.
- **Finalize:** settlement or plan agreement (generated PDF, click-to-sign with an ESIGN-style consent record: name, timestamp, IP, hash) → creates invoice(s) or a RecurringSchedule in ClientBilling → pay link → reminders → on a missed payment the agreement terms apply → completion receipt.

### Compliance guardrails (built in from day one)
AI disclosure in every message; opt-out link plus honoring "stop"; send windows by debtor timezone (Colombia's Ley 2300 windows); frequency caps (default ≤2 emails/week per account); no third-party disclosure (only the listed contact); a content filter (no threats, no false urgency, no legal claims); the B2B attestation; data retention settings.

### Audit trail and dashboards
Every message in/out, every offer with the policy version, approvals, signatures, payments, opt-outs. Dashboards: recovered $ vs placed, by age bucket and category; pipeline (contacted / engaged / promised / plan active / paid / handed off); fees owed; per-account timeline.

### Framework: Vercel eve vs alternatives
eve (https://eve.dev/docs , https://github.com/vercel/eve) is a filesystem-first framework for **durable** backend agents with persistent sessions, tools, channels, schedules, subagents, evals and Agent Runs observability on Vercel. That matches this workload: long-lived per-account negotiations lasting weeks, scheduled follow-ups and inbound email/chat channels. **Verdict: good fit, prototype it**, with three caveats. (a) It's new; check the bundled docs in `node_modules/eve/docs` for version maturity. (b) Keep the policy engine, ledger and audit in our Prisma/Neon DB, not inside agent session state. (c) Avoid lock-in by keeping offers as plain tool calls. Alternatives: Vercel Workflow / Inngest / Trigger.dev durable steps plus the AI SDK (more control, more glue), or Temporal (heavy). Fallback if eve disappoints: AI SDK plus Vercel Cron and a DB state machine. That's very doable, because the state machine is simple.

### Email and chat infrastructure
- **Outbound:** Resend is already in `src/lib/email.ts`. Add per-creditor verified domains, or send through the creditor's Gmail/Outlook via OAuth (best deliverability and first-party optics).
- **Inbound:** Resend inbound or Postmark inbound webhooks with a reply-to address per account.
- **Chat:** our own web chat on the `/r` page, using the AI SDK UI or eve's frontend client.
- **E-sign:** build the minimal in-house version (click-to-sign plus audit record) for B2B MVP; later Dropbox Sign or Documenso.
- **Avoid SMS and voice in the MVP** (TCPA).

## 5. Messaging and pricing

**Headline:** "Get paid without losing the client."
Sub: "An AI collections assistant that writes like you, negotiates within your rules, and only gets paid when you do."
Bullets: Human and considerate (AI that discloses itself, never threatens, always offers a person) · Your name, your terms (you set floors, plans, tone) · Payment plans and settlements, signed and tracked automatically · Every message and offer logged · Free to start, success fee only on recovered money · Money goes straight to you; we never hold funds.

**Pricing options (validate with counsel):**
- A. **Outcome-only, tiered by age:** 10% (<90d), 15% (90–365d), 25% (>1y). Undercuts agencies (20–50%) while staying sustainable on hard accounts.
- B. **Hybrid:** $19–49/mo plus 5–8% of recovered amounts. Lower legal ambiguity and predictable revenue.
- C. **Flat:** $X per resolved account. Most clearly "software", least aligned with "we only get paid if you get paid."
Recommendation: launch with **A, labeled a software success fee**, but have B ready if counsel flags collector risk. Fees are invoiced to the creditor monthly through ClientBilling itself (we never skim payments).

## MVP plan (about 3–4 weeks, reusing ClientBilling)

Reuse: Client, Invoice, RecurringSchedule (plans), Payment (partial), InvoiceEvent/Event (audit), `/i` pay pages and pay-link (PayPal.me prefill), Resend email, auth, v1 API.

- **Week 1:** ADR 0020 ("Collections: first-party, B2B, no funds"). Models: `CollectionAccount`, `Playbook`, `Policy`, `Offer`, `Agreement`, `Message`, `Approval`. CSV upload with validation and B2B attestation. Q&A form with category defaults.
- **Week 2:** Policy engine with unit tests. Email agent (outbound sequences plus inbound reply classification) in a dry-run/approval-first mode. Opt-out, send windows, frequency caps, disclosure footer.
- **Week 3:** `/r/<token>` debtor page with chat, offer selection, click-to-sign agreement, creation of a plan or settlement invoice, and reminders. Handoff queue.
- **Week 4:** Dashboards (recovered by bucket, pipeline, fees), audit export, success-fee invoicing. Eve spike in parallel in week 2 (decide by end of week 2). Pilot with 3–5 friendly freelancers or agencies on their own old receivables.

**Before launch:** a 1-hour consult with a collections attorney on (1) the success fee plus AI negotiation versus third-party collector status, (2) B2B-only attestation sufficiency, and (3) California SB 1286 guarantor edge cases.
