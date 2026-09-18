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
| 0009 | Concierge Collect until the pay link exists; the founder runs it with agent assistance | Accepted 2026-09-18 |
| 0010 | The invoice tool is free, funded by CDG residuals; no paid tier | Accepted 2026-09-18 |
| 0011 | shadcn/ui for the app, adopted after the P0 features | Accepted 2026-09-18 |
| 0012 | The accountant channel is a feature, not an acquisition channel, for now | Accepted 2026-09-18 |
| 0013 | Payer card intent is the activation signal; honest, rate limited, never a payment | Accepted 2026-09-18 |
| 0014 | Proceed without asking CDG; merchants paste their own pay link; no integration, no claims | Accepted 2026-09-18 |
| 0015 | Overdue is set by a daily sweep; reminders are manual, one a day, to the client on file | Accepted 2026-09-18 |
| 0016 | Invoice PDFs are rendered server-side from the same data as the page, with built-in fonts | Accepted 2026-09-18 |
| 0017 | Personal API keys and a small REST surface so agents can operate the product | Accepted 2026-09-18 |
