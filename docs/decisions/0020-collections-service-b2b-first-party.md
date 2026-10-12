# 0020: Collections is a separate, B2B-only, first-party service; no funds, approval on every message

Status: Accepted 2026-10-12 (founder approved the launch path; pricing amended the same day: no percentage of collected funds)

## Context

ClientBilling has no customers yet, and the CDG referral path has not produced a response. Research (`docs/research/collections-pivot.md`) found an opening for a considerate, AI-assisted collections service for small businesses. Collection law is the main risk. The FDCPA and Regulation F cover consumer debts, and a vendor that meaningfully takes part in collecting someone else's debts can be treated as a third-party debt collector. Third-party collectors need licenses or bonds in many states (for example Texas and New York City). This is not legal advice. An attorney reviews it before any message reaches a debtor.

## Decision

- Collections is a **separate service** from ClientBilling invoicing. Invoicing stays free (decision 0010 still applies to invoicing). Collections lives in the same app under `/app/collections` for now, with its own name to be chosen.
- **Business debts only.** Every import requires the user to confirm that each account is money a company owes their business. Consumer, personal, family, and household debts are refused. Disputed accounts are paused for the owner and never negotiated by the assistant.
- **First-party agent.** We host one agent per user. It acts only within what that user authorizes (minimum settlement, longest plan, tone, escalation). It sends only from the user's own email or accounts, in the user's name, and never under a ClientBilling or collection-agency name.
- **No funds.** Payments go only to the user's own pay links. We never collect, hold, or forward money (compliance boundary, hard line 2).
- **Approval on every message.** At launch, every outbound message the agent drafts waits for the user's explicit approval. Relaxing this needs a new decision.
- **Disclosure and a person.** The assistant always says it is an AI acting for the user, and always offers to connect the debtor with a person.
- **Pricing: never tied to the amount recovered.** No contingency, success fee, or percentage of collected funds, on any plan. Plans are flat subscriptions sized by active accounts and agent emails:

| Plan | Price | Active accounts | Agent emails per month |
| --- | --- | --- | --- |
| Starter | $4.99/mo | 3 | 100 |
| Pro | $19.99/mo | 25 | 1,000 |
| Business | $79.99/mo | 150 | 6,000 |
| Unlimited* | $499/mo | Fair use: 5,000 | Fair use: 100,000 |

*Above fair use, custom pricing. Overage on any plan: $0.50 per additional active account per month and $0.03 per additional agent email. An account is **active** only while it is being worked. It stops counting once it is paid, settled, or paused.

  Research behind this choice: `docs/research/success-fee-legal.md` (a contingency fee is the strongest signal of a third-party collector, and it removes the "we sell software" argument). Outcome pricing, if ever offered, would come only through a licensed partner agency acting as collector of record, under a new decision.
- **Channels.** Email and a web page with chat only. No phone calls, AI voice, or SMS (TCPA).
- **Week 1 scope.** CSV import with the business-debt confirmation, a per-account questionnaire, and the data model. No outbound messages.

## Reasons

- B2B debt is outside the FDCPA and Reg F. Acting in the creditor's own name, within limits they set and approve, keeps us a software tool rather than a collector.
- Approval on every message is the clearest evidence that the creditor is the one collecting. It also lets us learn what good messages look like before automating.
- Pricing by usage (accounts worked, emails drafted) rather than by recovery keeps us paid for software, not for collecting. Counting only active accounts means users are never charged for accounts that are paid, settled, or paused.

## Consequences

- No account ever moves to messaging without a completed questionnaire. Disputed accounts land in "paused".
- California's Rosenthal Act now reaches some commercial debts owed or guaranteed by individuals (SB 1286). Accounts with a person as the debtor or guarantor need counsel's view before messaging.
- A future debt-buying or consumer product would need licensing and a new decision.

## Revisit when

Counsel advises on the B2B launch; a licensed partner agency offers outcome pricing; a user asks for consumer accounts, phone, or SMS; or approval-on-every-message has enough history to justify auto-approval within limits.
