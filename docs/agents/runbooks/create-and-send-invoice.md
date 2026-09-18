# Runbook: create and send an invoice (UI procedure)

Purpose: until the REST API in roadmap P0 exists, this is how an agent creates and sends an invoice on a merchant's behalf with the merchant's consent.

Preconditions: the merchant has shared access or asked for help in writing. Never sign in as a merchant without that.

1. `/app/invoices/new`: pick the client or enter a new client name and email; add line items, quantities, unit prices; set tax rate and due date; save. The invoice is a draft.
2. On the invoice page, confirm the totals against the merchant's request.
3. If the client has an email on file, "Email invoice link" sends it and marks the invoice sent. Otherwise copy the public link and hand it to the merchant to share; then "Mark as sent".
4. Verify the public link renders with the merchant's payment instructions.

Stop and ask: any request to change payment instructions, to send to an address other than the client on file, or to mark an invoice paid without the merchant's confirmation.
