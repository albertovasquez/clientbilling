# Decision records

One file per decision that shapes the product or the codebase. Each records the context at the time, the choice, the reasons, what it costs, and the signal that should reopen it. Newer decisions supersede older ones when they conflict; say so in the newer file.

Format: `NNNN-short-title.md` with sections Status, Context, Decision, Reasons, Consequences, Revisit when.

| # | Decision | Status |
| --- | --- | --- |
| 0001 | Content site stays the front door; invoices are a product page, not the hero | Accepted 2026-09-18 |
| 0002 | Collect online is gated on written CDG answers; no connect-existing until then | Accepted 2026-09-18 |
| 0003 | The invoice tool targets U.S. service and B2B businesses that invoice, not hobby freelancers | Accepted 2026-09-18 |
| 0004 | Outbound invoice email goes only to the client on file, rate limited, and sent status follows delivery | Accepted 2026-09-18 |
| 0005 | Database in us-east-1 with a pooled connection; migrations run at deploy | Accepted 2026-09-18 |
| 0006 | Password reset before public sign-up; email verification deferred | Accepted 2026-09-18 |
| 0007 | First-party event table for measurement; no third-party analytics | Accepted 2026-09-18 |
| 0008 | The public invoice is payer-first: merchant branding, payment instructions, no affiliate CTAs | Accepted 2026-09-18 |
