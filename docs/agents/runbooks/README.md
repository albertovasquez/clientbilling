# Runbooks

Repeatable operational procedures an agent may run. Each runbook states its purpose, preconditions, exact steps, verification, and the stop-and-ask triggers that apply. Add one whenever an operation is likely to be repeated.

| Runbook | Purpose |
| --- | --- |
| `move-database-region.md` | Move the Neon project to us-east-1 with pooled and direct URLs (decision 0005). |
| `move-vercel-account.md` | Move the Vercel project between accounts without losing env vars, the domain, or history. |
| `revoke-a-service-account.md` | Stop an agent identity and account for what it did (decisions 0026, 0027). |
| `rotate-a-webhook-secret.md` | Replace a leaked `whsec_` without losing queued deliveries (decision 0026). |
| `inspect-webhook-deliveries.md` | Find out whether an event reached its receiver, and replay it by hand. |
| `create-and-send-invoice.md` | Create and send through the API on a merchant's behalf. |
| `chase-unpaid.md` | Follow up on overdue invoices through the API. |
| `concierge-collect.md` | Turn an "Enable card payments" request into a CDG application by hand. |
