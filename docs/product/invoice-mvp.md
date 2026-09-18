# Invoice MVP (Level B)

Updated: 2026-09-18. Decisions that shaped this are in `docs/decisions/`.

## Architecture

- ClientBilling owns invoice UX: accounts, clients, drafts, public invoice pages, email link share, payer-facing payment instructions.
- CDG Commerce / Quantum Gateway would own Pay and settlement after the merchant is underwritten. That integration is planned and gated (decision 0002).
- ClientBilling is not a payfac, MoR, or money transmitter. We never store cardholder data.

## Flows

1. Sign up at `/app/sign-up` (email + password). Rate limited per IP.
2. Business profile at `/app/settings`, including payment instructions that appear on every invoice.
3. Create clients and invoices under `/app`. Invoice numbers increment atomically and are unique per user.
4. Public view at `/i/[publicId]` (noindex, payer-first, no affiliate links). "Viewed" is recorded by a client beacon, not on GET.
5. Send: `/api/invoices/[id]/send` emails the client on file through Resend; "sent" is set only on delivery. Copy link always works. 20 emails per user per hour.
6. Status transitions follow `src/lib/invoices/status.ts`. A daily cron (`/api/cron/overdue`, 06:00 UTC, requires `CRON_SECRET`) flips past-due sent or opened invoices to overdue. Merchants send reminders from the invoice page: client on file only, one per invoice per 24 hours (decision 0015).
7. Getting paid: payers see the merchant's payment instructions and, when the merchant has pasted a hosted payment page link, a Pay online button (decision 0014). The merchant marks paid. `COLLECT_ONLINE` is unused.

## Measurement

First-party `Event` table (decision 0007). Server events: `signup`, `invoice_created`, `invoice_sent`, `invoice_viewed`, `invoice_paid`, `invoice_void`. Browser events through `POST /api/events`: `affiliate_cta_click`, `calculator_complete`. Funnel page at `/app/admin/funnel` for `ADMIN_EMAILS`.

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes for /app and /i | Neon pooled connection string (`-pooler` host). |
| `DIRECT_URL` | Yes in production | Neon direct connection string, used only by migrations. Falls back to `DATABASE_URL` if unset. |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32`. |
| `AUTH_URL` / `NEXTAUTH_URL` | Yes | `https://www.clientbilling.com`. |
| `RESEND_API_KEY` | For email | Without it, the app offers copy link only. |
| `RESEND_FROM` | Required with the key | Verified sender, e.g. `ClientBilling <invoices@clientbilling.com>`. |
| `COLLECT_ONLINE` | Optional | `on` enables collect UI beyond the CDG links. Leave unset. |
| `ADMIN_EMAILS` | Optional | Comma-separated emails allowed to view `/app/admin/funnel`. |
| `CRON_SECRET` | Yes for the overdue sweep | Vercel Cron sends it as a bearer token; the route refuses without it. |

## Ops checklist

1. Move the Neon project to `us-east-1` (decision 0005): create a new project there, restore from the São Paulo project (Neon branch restore or `pg_dump` / `pg_restore`), set `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) in Vercel, redeploy, verify `/app` works, delete the old project.
2. Migrations run at build (`scripts/migrate-if-db.mjs` before `next build`). Test a migration against a Neon branch before merging.
3. Set `RESEND_FROM` to a verified domain sender before setting `RESEND_API_KEY` in production.
4. Add `ADMIN_EMAILS` to see the funnel page, and `CRON_SECRET` so the daily overdue sweep runs.
5. Monthly: delete `Event` rows older than 180 days (`DELETE FROM "Event" WHERE "createdAt" < now() - interval '180 days'`).
6. Never put Quantum RestrictKeys or gateway passwords in env or the database.

## Residual diligence

Partner questions live in `docs/partners/cdg-clientbilling-quantum-one-pager.md`. Nothing on the collect path is built until questions 1 and 2 are answered in writing (decision 0002).
