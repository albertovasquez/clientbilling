# Runbook: concierge Collect follow-up

Purpose: turn a merchant's "Enable card payments" request into a CDG application, by hand, without making claims we cannot back (decisions 0009, 0014).

Trigger: an email titled "Collect request: ..." to the admin address, or a `collect_requested` event on the funnel page. The payload has business type, monthly card volume band, whether the merchant already has a pay link, and an optional note.

## Steps

1. Look up the merchant in the app (admin sees the funnel only; the founder has the account email from the request). Read their last few invoices for average ticket and cadence. Do not open their invoices' payer data beyond what the follow-up needs.
2. Decide the fit using `src/lib/cdg.ts` and the site's own guidance:
   - Under $10K a month: say plainly that CDG's flat rate (2.90% + $0.30 swiped, 3.50% + $0.30 online, $9.95 a month) is not cheaper than a flat-rate processor at that volume, and that a pay link from any provider they already use works on ClientBilling today. Offer the quote link anyway if they want a dedicated merchant account.
   - $10K to $200K a month: interchange plus with the gateway included is the case. Quote the published markups for their channel and say interchange is separate.
   - $200K and up: wholesale membership, billed annually; say so.
3. Draft the follow-up email from the merchant's business name and the numbers above. Template:

   Subject: Card payments for {business name}

   Hi {first name},

   You asked to enable card payments on your ClientBilling invoices. Here is the honest picture for a {business type} doing {volume band}: {one paragraph from step 2, with the published rates and the source page}.

   If that fits, the next step is CDG's quote form: {quote link}. It asks for your name, email, phone, and business type, and a CDG representative calls you with a rate sheet. Once your account is approved, CDG gives you a hosted payment page; paste its link into Business settings on ClientBilling and every unpaid invoice gets a Pay online button.

   ClientBilling earns a commission if you apply through that link. It does not change your pricing, and you contract with CDG, not with us.

   {founder name}

4. The founder sends it from the founder's address. The agent does not send it.
5. Record the outcome as a decision note in the funnel review: applied, declined, or no reply after seven days.

## Never

- Promise approval, rates, or timelines. Quote only what `cdg.ts` holds, with its source.
- Collect application data (SSN, EIN, bank details) on our side.
- Contact the merchant's clients.
- Claim residuals or any partnership beyond the referral.
