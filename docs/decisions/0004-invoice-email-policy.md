# 0004: Outbound invoice email goes only to the client on file, rate limited, and sent status follows delivery

Status: Accepted 2026-09-18

## Context

The send route accepted any recipient address from the request body, marked the invoice "sent" before attempting delivery (including when no email provider was configured or the provider failed), defaulted the sender to Resend's test address, and had no rate limit. A signed-in user could send arbitrary email through the site's domain; a merchant could see "sent" on an invoice nobody received; and end users were told to "set RESEND_API_KEY".

## Decision

- The recipient is always the client's email on file. To email a different address, the merchant edits the client first.
- Sending is limited to 20 emails per user per hour, counted from `InvoiceEvent` rows of type `email_sent`.
- An invoice becomes "sent" only when the provider accepts the message, or when the merchant clicks "Mark as sent" after sharing the link another way.
- `RESEND_FROM` is required whenever `RESEND_API_KEY` is set. Without a key, the UI offers copy link only and never mentions environment variables.

## Reasons

- Restricting recipients removes the spam vector without adding a confirmation step.
- A status that can be wrong is worse than no status. Merchants act on "sent".
- Resend's onboarding sender only delivers to the account owner, so a production deploy without `RESEND_FROM` silently fails for every customer.

## Consequences

- Clients without an email cannot be emailed until one is added; the form says so and links to the client.
- The rate limit is coarse and per user; it is not a defense against a compromised account, only against casual abuse.

## Revisit when

Merchants ask to CC themselves or a second contact. Add explicit CC support then, still limited to addresses stored on the client record.
