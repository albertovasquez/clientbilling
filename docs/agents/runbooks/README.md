# Runbooks

Repeatable operational procedures an agent may run. Each runbook states its purpose, preconditions, exact steps, verification, and the stop-and-ask triggers that apply. Add one whenever an operation is likely to be repeated.

| Runbook | Purpose |
| --- | --- |
| `move-database-region.md` | Move the Neon project to us-east-1 with pooled and direct URLs (decision 0005). |
| `create-and-send-invoice.md` | UI procedure until the API in roadmap P0 exists. |
| `chase-unpaid.md` | Follow up on overdue invoices with the reminder feature. |
| `concierge-collect.md` | Turn an "Enable card payments" request into a CDG application by hand. |
