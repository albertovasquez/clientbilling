# Runbook: chase unpaid invoices

Purpose: follow up on unpaid invoices without inventing policy (decisions 0015, 0017).

1. `GET /api/v1/invoices?status=overdue` (and `status=viewed` for opened but unpaid). In the app, the Overdue tile shows the same.
2. For each, `POST /api/v1/invoices/:id/remind`. It emails the client on file with the number, amount, due date, public link, pay link if any, and the payment instructions. `429` means a reminder went out in the last 24 hours; skip it.
3. If the client has no email on file (400), tell the merchant; do not look for another address.
4. After a week with no response, report the list to the merchant and let them decide; the agent does not escalate.

Reference: `docs/agents/api.md`.

Stop and ask: any late fee, interest, collections language, contacting anyone other than the client on file, or sending from any address other than the app.
