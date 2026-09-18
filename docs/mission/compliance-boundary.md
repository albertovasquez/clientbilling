# Compliance boundary

Owner: founder. These lines are not design trade-offs. A feature that needs to cross one is rejected and re-shaped, never partially built.

## Hard lines

1. **No cardholder data.** No primary account number, expiry, CVV, or track data is ever rendered on, posted to, logged by, or stored on any ClientBilling origin, database, log, or email. This includes "just the last four" typed by a merchant, and includes screenshots and support tickets.
2. **No funds.** ClientBilling never receives, holds, moves, or refunds money on a merchant's behalf. Payment settles from the processor to the merchant's bank account.
3. **Not the merchant of record, payfac, or money transmitter.** Every card transaction is between the payer, the merchant, and the merchant's own CDG Commerce merchant account.
4. **No credentials for the gateway.** Quantum gateway passwords, RestrictKeys, or API keys are never stored in the database or environment. If a future integration needs a merchant credential, it is scoped, minimal, and reviewed by the founder first (stop-and-ask).
5. **No claims ahead of the agreement.** Nothing public says card payment "runs on" or "is available" through ClientBilling until CDG has confirmed in writing that the integration is permitted and how residuals apply. Until then the word is "planned".
6. **Bank details are the merchant's free text.** Payment instructions on invoices are text the merchant types. We do not validate, connect to, or verify bank accounts.

## What is allowed, by shape

| Need | Allowed shape | Not allowed |
| --- | --- | --- |
| A "Pay" button on the public invoice | Link or iframe to a Quantum hosted pay page for the merchant's own account, with amount and invoice number passed in. | Card fields on `/i/*`, tokenizing on our server, "pay with saved card". |
| Knowing an invoice was paid by card | Quantum post-back or a signed webhook to our endpoint that carries a reference and amount, never card data. | Polling gateway reports with stored credentials. |
| Refunds and disputes | Merchant does them in Quantum or with CDG. We show status if the gateway tells us. | Any refund initiated from ClientBilling. |
| Merchant onboarding | Link to CDG's quote form or application with R=470. Concierge by email is fine. | Collecting SSN, EIN, or bank data on our forms to "speed up" the application. |
| Payer convenience | Payment instructions, PDF, email link, reminders. | Storing a payer's card for the merchant. |

## Signals that a feature crosses the line

- The spec contains the words token, PAN, vault, card on file, capture, settlement, payout, balance, or refund as something we do.
- A form field on our domain asks for anything printed on a card.
- We would need a PCI questionnaire beyond SAQ A for our own origin.
- Money would sit in an account we control for any length of time.

When in doubt, stop, describe the feature in one paragraph, and ask the founder. Cite this file in the PR.
