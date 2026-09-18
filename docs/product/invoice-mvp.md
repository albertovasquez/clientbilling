# Invoice MVP (Level B)

Date: 2026-09-18

## Architecture

- **ClientBilling** owns invoice UX: accounts, clients, drafts, public invoice pages, email link share.
- **CDG Commerce / Quantum Gateway** owns Pay and settlement after the merchant is underwritten.
- ClientBilling is **not** a payfac, MoR, or money transmitter. We never store cardholder data (CHD).

## Flows

1. Sign up at `/app/sign-up` (email + password).
2. Create clients and invoices under `/app`.
3. Public view at `/i/[publicId]` (noindex). Print-friendly. No card fields.
4. **Collect online**
   - Not connected: CTA to CDG apply (`siteConfig.affiliateSignupUrl`, agent 470) or quote (`siteConfig.quoteUrl`). Secondary: connect existing Quantum stub (merchant label + non-secret reference only).
   - Connected: hosted pay button is a stub until CDG confirms preferred Quantum method (Interactive / Web Order Form / ILF). Merchants can still mark paid manually.
5. Unpaid invoices always work without payments connected.

## Residual diligence

Partner questions live in `docs/partners/cdg-clientbilling-quantum-one-pager.md`. Confirm residuals for agent 470 when pay is triggered from our invoice UI with the merchant's own Quantum `gwlogin`.

## Env

See `.env.example`: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, optional `RESEND_API_KEY`.

## Ops checklist

1. Create a Neon (or other Postgres) database.
2. Set Vercel env: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL=https://www.clientbilling.com`, `AUTH_URL` same.
3. Run `npx prisma migrate deploy` against production (or `prisma db push` for early MVP).
4. Optional: set `RESEND_API_KEY` + `RESEND_FROM` for email send.
5. Do not put Quantum RestrictKeys or passwords in env or the database.
