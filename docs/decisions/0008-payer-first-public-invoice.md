# 0008: The public invoice is payer-first: merchant branding, payment instructions, no affiliate CTAs

Status: Accepted 2026-09-18

## Context

The public invoice at `/i/[publicId]` is the only page a merchant's customer ever sees. It opened with "ClientBilling" above the merchant's name, printed the raw status enum ("Status: viewed"), and, when the merchant had no payment connection, showed the payer a "Sender: start a CDG application" affiliate button. It also flipped the invoice to "viewed" on every GET, including link scanners in email clients, so "viewed" fired within seconds of sending regardless of whether a person opened it.

## Decision

- The merchant's business name and logo lead the page. ClientBilling appears once, in the footer, as the software provider.
- Merchants get a `paymentInstructions` field on their business profile (bank details, check address, "pay by the link below" once collect exists). It renders in the Pay section. When empty, the section says to contact the sender.
- No CDG or affiliate links ever render on `/i/*`. The payer is not our audience for referrals.
- Status is shown in plain words the payer cares about: due date, paid, or void. Internal states like "viewed" are not shown to payers.
- "Viewed" is recorded by a small client-side beacon after the page renders, only for invoices in `sent` state, and `status` no longer changes on a GET.

## Reasons

- The invoice is the merchant's document. Branding it as ours devalues the merchant and confuses the payer.
- Affiliate CTAs to payers are off-target and advertise that the merchant has not set up payments.
- A "viewed" signal that scanners trip is worse than none, because merchants make follow-up calls on it.

## Consequences

- One new nullable column on `BusinessProfile` and a small route for the beacon.
- Merchants without instructions see a prompt in their dashboard to add them.

## Revisit when

Collect online launches (decision 0002). The Pay section then gets the hosted-pay link above the instructions.
