# 0001: Content site stays the front door; invoices are a product page, not the hero

Status: Accepted 2026-09-18

## Context

clientbilling.com runs two things: a CDG Commerce review and comparison site that earns affiliate referrals from search traffic, and a new invoice app at `/app` that cannot yet collect payments. The homepage hero belonged to the content site while a "Create an invoice" card sat halfway down, the header link "Invoices" jumped straight to a sign-up form, and an indexed `/invoices` page said invoices were "not available yet" and collected waitlist emails through a third party. Two products were telling two stories on the same domain.

## Decision

- The homepage hero and primary navigation stay with the content site until a payer can actually pay an invoice through CDG.
- `/invoices` becomes the invoice product page: what it does today, what it does not do yet, one sign-up CTA. The waitlist and the "fake door" tracking are removed.
- The header link reads "Invoices" and goes to `/invoices`, never straight to sign-up. Sign-up is one click further, with context.
- The homepage keeps one invoice card, pointing to `/invoices`.

## Reasons

- The content site is the only proven traffic and revenue engine. Rewriting the hero for a product with no payment path would trade real referrals for a promise.
- A fake door and a live sign-up cannot coexist. Visitors who hit the "not available yet" page after clicking "Create an invoice" lose trust in both products.
- Sending nav clicks to a bare sign-up form with no product explanation is the worst of both: low conversion and confused sign-ups.

## Consequences

- The invoice tool grows through its own page and through contextual links in guides, not through the hero.
- The `InvoiceFakeDoorLink` and `InvoiceWaitlistForm` components are deleted; interest is now measured by real sign-ups and first invoices (see 0007).

## Revisit when

A payer can pay an invoice through CDG and at least twenty merchants have sent an invoice. At that point the hero decision should be made on funnel data, not on instinct.
