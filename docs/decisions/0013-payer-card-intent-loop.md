# 0013: Payer card intent is the activation signal; it is honest, rate limited, and never a payment

Status: Accepted 2026-09-18

## Context

Nothing tells a merchant that their payers want to pay by card until the merchant already has a merchant account. The loop in the north star needs that signal before Collect exists, and it must not pretend to be a payment.

## Decision

- On an unpaid public invoice, under "How to pay", a single button reads "Prefer to pay by card? Let {merchant} know". It posts to `/api/invoices/card-intent` with the invoice's public id. No form fields, no card data, no payer identity collected.
- The route records an `InvoiceEvent` of type `card_intent` and an `Event` named `payer_card_intent` attributed to the merchant, and emails the merchant once per invoice ("A client asked to pay invoice #N by card"). Repeat clicks are counted but do not email again.
- The payer sees: "Thanks. We let {merchant} know. Card payment for this invoice is planned; use the instructions above in the meantime."
- The merchant dashboard shows the count of intents in the last 30 days with the CDG quote link; the invoice page shows when a payer asked. The funnel page counts the step.
- Rate limit: 10 intents per IP per hour.

## Reasons

- It is the one demand signal a merchant cannot get elsewhere, and it is the honest trigger for Collect and for concierge outreach.
- No payer data is stored, which keeps the privacy page true and the payer as the merchant's customer.

## Consequences

- Copy must say "planned". When the pay link ships, the button is replaced by the pay action and the intent count becomes historical.

## Revisit when

The pay link ships (decision 0002 revisited).
