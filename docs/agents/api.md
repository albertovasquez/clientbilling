# ClientBilling API v1

For scripts and agents operating a merchant's account with the merchant's consent (decision 0017). Base URL `https://www.clientbilling.com`. All requests carry `Authorization: Bearer cb_live_...`, created at `/app/settings/api`. A key acts as the account that created it. 120 requests per key per minute. Errors are `{ "error": "..." }` with a meaningful status.

Money is integer cents. Dates are ISO 8601. `status` is one of `draft`, `sent`, `viewed`, `overdue`, `paid`, `void`.

## Clients

`GET /api/v1/clients` lists clients.

`POST /api/v1/clients` creates one.

```json
{ "name": "Jane Client", "email": "jane@example.com", "company": "Client Co", "phone": "555-0100" }
```

Returns `201 { "client": { "id", "name", "email", "phone", "company", "createdAt" } }`.

## Invoices

`GET /api/v1/invoices?status=overdue` lists invoices, newest first, optionally filtered by status.

`POST /api/v1/invoices` creates a draft. Give either `clientId` or `newClient`.

```json
{
  "newClient": { "name": "Jane Client", "email": "jane@example.com" },
  "lines": [
    { "description": "Water heater replacement, labor", "quantity": 4, "unitPrice": 125 },
    { "description": "50 gal water heater unit", "quantity": 1, "unitPrice": "750.00" }
  ],
  "taxRate": 7,
  "dueDate": "2026-10-02",
  "notes": "Net 14."
}
```

`unitPrice` is in dollars (number or string); it is stored as cents. `taxRate` is a percent. Returns `201 { "invoice": {...} }` with `publicUrl` and `pdfUrl`.

`GET /api/v1/invoices/:id` returns one invoice.

`POST /api/v1/invoices/:id/status` with `{ "status": "sent" | "paid" | "void", "reason"?: "..." }`. Void requires a non-empty `reason` (max 500 characters); `400` without it. Only allowed transitions succeed; `409` otherwise.

`POST /api/v1/invoices/:id/send` emails the invoice, with the PDF attached, to the client on file. `400` if the client has no email, `429` past 20 emails per hour, `503` if email is not enabled on the deployment. On success the invoice becomes `sent`.

`GET /api/v1/invoices/:id/payments` lists payments recorded against the invoice, newest first.

`POST /api/v1/invoices/:id/payments` records money received (decision 0019). Body: `{ "amountCents": 12500, "method": "bank_transfer", "paidOn": "2026-09-18", "note": "Deposit" }`. `method` is one of `cash`, `check`, `bank_transfer`, `card`, `other` (default `other`); `paidOn` defaults to now and cannot be in the future. Paying the full balance flips the invoice to `paid`. `400` if the amount is zero or exceeds `balanceCents`, `409` on void or already paid invoices. Returns `201 { "payment": {...}, "invoice": {...} }`.

`DELETE /api/v1/invoices/:id/payments/:paymentId` removes a payment record. A paid invoice reopens as `overdue`, `viewed`, `sent`, or `draft` depending on its history.

`POST /api/v1/invoices/:id/status` with `{ "status": "paid" }` records one payment for the remaining balance with method `other`, so payment records stay the source of truth.

`POST /api/v1/invoices/:id/remind` sends one reminder to the client on file. `429` within 24 hours of the last reminder.

## Invoice object

```json
{
  "id": "cmu...", "number": "1001", "publicId": "abc123def456",
  "publicUrl": "https://www.clientbilling.com/i/abc123def456",
  "pdfUrl": "https://www.clientbilling.com/i/abc123def456/pdf",
  "status": "sent",
  "client": { "id": "cmu...", "name": "Jane Client", "email": "jane@example.com" },
  "issueDate": "2026-09-18T00:00:00.000Z", "dueDate": "2026-10-02T00:00:00.000Z",
  "currency": "USD", "taxRateBps": 700,
  "subtotalCents": 125000, "taxCents": 8750, "totalCents": 133750,
  "paidCents": 50000, "balanceCents": 83750,
  "notes": "Net 14.",
  "lineItems": [{ "id": "cmu...", "description": "...", "quantity": 4, "unitPriceCents": 12500 }],
  "sentAt": "...", "viewedAt": null, "paidAt": null, "voidedAt": null, "voidReason": null,
  "createdAt": "...", "updatedAt": "..."
}
```

## Examples

```bash
export CB_KEY=cb_live_...
curl -s https://www.clientbilling.com/api/v1/invoices?status=overdue -H "Authorization: Bearer $CB_KEY"

curl -s -X POST https://www.clientbilling.com/api/v1/invoices \
  -H "Authorization: Bearer $CB_KEY" -H "Content-Type: application/json" \
  -d '{"newClient":{"name":"Jane Client","email":"jane@example.com"},"lines":[{"description":"Consulting, September","quantity":10,"unitPrice":150}],"taxRate":0,"dueDate":"2026-10-15"}'

curl -s -X POST https://www.clientbilling.com/api/v1/invoices/INVOICE_ID/send -H "Authorization: Bearer $CB_KEY"

curl -s -X POST https://www.clientbilling.com/api/v1/invoices/INVOICE_ID/payments \
  -H "Authorization: Bearer $CB_KEY" -H "Content-Type: application/json" \
  -d '{"amountCents":50000,"method":"check","paidOn":"2026-09-18","note":"Check 1042"}'
```

## Not in v1

Updating or deleting invoices and clients, webhooks, scopes, team access. Poll `GET /api/v1/invoices` for status changes.
