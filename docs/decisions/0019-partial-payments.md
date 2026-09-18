# 0019: Payment records with partial payments; marking paid records a payment

Status: Accepted 2026-09-18

## Context

Invoices had one bit of payment state: paid or not. Service businesses take deposits, installments, and offline payments, and their bookkeeper needs to see what arrived and when. The roadmap listed partial payments and payment records as the first P1 item.

## Decision

- A `Payment` row records money the merchant received against an invoice: amount in cents, method (cash, check, bank transfer, card, other), the date received, an optional note, and the source (app, API, or migration). ClientBilling only records payments. It never moves funds, which keeps the compliance boundary intact.
- `Invoice.paidCents` is the running sum and is updated in the same transaction as every payment write. Balance due is total minus paid.
- Recording the full balance flips the invoice to paid with `paidAt` set to the date received. A partial payment leaves the status where it is (sent, opened, overdue) and shows "still due" in the app and "Balance due" on the public page and PDF. Overpayment is rejected.
- "Mark as paid" stays as a button. It now records one payment for the remaining balance with method "other" and the note "Marked paid", so payments are the single source of truth. Invoices already paid before this change received one balancing record in the migration.
- Removing a payment reverses the sum. If that reopens a paid invoice, it returns to overdue when past due, otherwise to opened or sent, or draft if it was never sent.
- Editing an invoice cannot lower the total below the amount already paid.
- The dashboard's Outstanding and Overdue tiles show balances, and Paid this month sums payments received in the month rather than invoices flipped to paid.
- The API gains `GET` and `POST /api/v1/invoices/:id/payments` and `DELETE /api/v1/invoices/:id/payments/:paymentId`; the invoice object gains `paidCents` and `balanceCents`.

## Reasons

- One place for money received keeps the CSV export and client statements (next on the roadmap) simple: they read payments, not status flips.
- Rejecting overpayment and total reductions below paid avoids negative balances without adding credit notes, which are a separate decision.
- Void keeps its payment history; a void invoice with money against it is a refund conversation the merchant has outside the product.

## Consequences

- Reminder emails mention the remaining balance when a partial payment exists.
- Payments are visible only to the merchant. Payers see totals, paid to date, and balance due, never the method or note.

## Revisit when

A merchant needs refunds or credit notes, or the accountant channel needs payment exports with more fields.
