# 0014: Proceed without asking CDG; merchants paste their own pay link; no integration, no claims

Status: Accepted 2026-09-18. Supersedes the "wait for written answers" part of 0002; the compliance rules in 0002 stand.

## Context

The founder decided not to ask CDG the one-pager questions. Decision 0002 gated all collect-online work on those answers. Without them, the earlier plan (a Quantum hosted-pay integration blessed by CDG) has no path. Merchants still want a way to be paid online from an invoice.

## Decision

- ClientBilling does not integrate with Quantum or CDG. It does not ask CDG anything, does not send the one-pager, and does not claim residuals on processed volume. Referral links to CDG's quote form and application stay, because they are true today and attributed by the form itself.
- A merchant may paste a payment link of their own into their business profile: a hosted payment page from their CDG Commerce Quantum account, or any pay page they already use. It renders as a "Pay online" button on unpaid public invoices, opening in a new tab. Nothing else changes: the merchant marks the invoice paid, as they do for a check.
- The link must be `https://`, at most 500 characters, and is shown to payers exactly as pasted. ClientBilling never adds amount or card parameters, never stores credentials, and never sees the payment.
- When a pay link exists, the card-intent button is not shown; the payer can simply pay.
- `COLLECT_ONLINE` and the Quantum connection fields remain unused. The roadmap item "Quantum pay link with post-back" is removed; "merchant-provided pay link" replaces it and ships now.
- Concierge Collect (0009) continues: it sends merchants to CDG's quote form and follows up by hand. It does not require CDG's involvement beyond the form they already publish.

## Reasons

- It gives merchants online payment today with zero dependency on a partner conversation the founder has chosen not to have.
- A merchant-provided link is the same compliance shape as a PayPal.me or Venmo link on a paper invoice: we are a document, not a party to the payment. Card data is entered on the merchant's own gateway page.
- Not claiming residuals keeps every public statement true. If residuals exist for agent 470 on Quantum volume, they arrive without us asserting them.

## Consequences

- No automatic paid status from online payments. The merchant marks paid. A future post-back integration would need a partner conversation, which is out of scope until the founder reopens it.
- The affiliate diligence table records questions 1 to 5 as "not asked by choice".
- The one-pager stays in the repo as a record, unsent.

## Revisit when

The founder chooses to open a conversation with CDG, or a merchant asks for automatic paid status from their Quantum account.
