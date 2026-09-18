# Runbook: create and send an invoice

Purpose: create and send an invoice on a merchant's behalf with the merchant's consent (decision 0017).

Preconditions: the merchant created an API key for you at `/app/settings/api` and shared it through a secret channel. Never sign in as a merchant; use the key.

1. Find or create the client: `GET /api/v1/clients`, or `POST /api/v1/clients` with name and email.
2. Create the invoice: `POST /api/v1/invoices` with `clientId` (or `newClient`), `lines` (description, quantity, unitPrice in dollars), `taxRate` percent, `dueDate`, `notes`. It is a draft.
3. Read back `GET /api/v1/invoices/:id` and confirm totals against the merchant's request. Fix by asking the merchant to edit in the app; there is no update endpoint yet.
4. Send: `POST /api/v1/invoices/:id/send`. If the client has no email (400), ask the merchant for one or hand them `publicUrl` to share, then `POST /api/v1/invoices/:id/status` with `sent`.
5. Report `publicUrl` and `pdfUrl` to the merchant.

Reference: `docs/agents/api.md`.

Stop and ask: any request to change payment instructions or the pay link, to send to an address other than the client on file, or to mark an invoice paid without the merchant's confirmation.
