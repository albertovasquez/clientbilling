# Runbook: chase unpaid invoices

Purpose: help a merchant follow up on unpaid invoices without inventing policy (decision 0015).

1. On `/app`, the Overdue tile shows the count and amount past due. The list marks overdue invoices.
2. Open each overdue or opened invoice. Use "Send a reminder". It emails the client on file with the number, amount, due date, public link, pay link if any, and the payment instructions. One reminder per invoice per day.
3. If the client has no email on file, add one on the client record first, or hand the public link to the merchant to send themselves.
4. After a week with no response, tell the merchant and let them decide; the agent does not escalate.

Stop and ask: any late fee, interest, collections language, contacting anyone other than the client on file, or sending from any address other than the app.
