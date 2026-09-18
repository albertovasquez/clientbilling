# ClientBilling (clientbilling.com)

Next.js App Router site with plain-language guides to merchant accounts, processing fees, recurring billing, invoicing, and POS, plus a disclosed affiliate funnel into CDG Commerce.

Start with `docs/STYLE_GUIDE.md`. It defines the look, the voice, the CTA ladder, and the page templates, and `npm run check` enforces the parts a script can catch.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 with semantic tokens in `src/app/globals.css`
- Primitives in `src/components/ui` (the only place raw palette classes are allowed)
- Markdown posts in `content/blog` (gray-matter + remark)
- Invoice app under `/app` (Auth.js credentials + Prisma/Postgres)
- Public invoices at `/i/[publicId]` (no card fields; Quantum for Pay)
- No paid analytics required

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_AFFILIATE_SIGNUP_URL` | Optional | "Start a CDG application". CDG's secure merchant application, agent 470. |
| `NEXT_PUBLIC_CDG_QUOTE_URL` | Optional | "Get a free quote from CDG". CDG's quote form (`/applynow/?R=470`). |
| `DATABASE_URL` | For `/app` and `/i/*` | Postgres connection string (Neon recommended). |
| `AUTH_SECRET` | For `/app` | Auth.js secret (`openssl rand -base64 32`). |
| `NEXTAUTH_URL` / `AUTH_URL` | For `/app` | Site origin, e.g. `https://www.clientbilling.com`. |
| `RESEND_API_KEY` | Optional | Sends invoice emails; without it, copy-link still works. |

Defaults for CDG URLs are in `src/lib/site.ts`. See `.env.example` and `docs/product/invoice-mvp.md`.

## CTA ladder

Every button label and destination comes from `src/lib/cta.ts`. Pages render `CtaButton` with a rung and a position; see the style guide, section 4.

| Rung | Label | Destination |
| --- | --- | --- |
| compare | Compare CDG pricing | `/cdgcommerce` |
| fit | See if CDG fits | `/cdgcommerce#fit` |
| quote | Get a free quote from CDG | CDG quote form |
| apply | Start a CDG application | CDG secure application |
| explore* | Explore CDG online / in-person / mobile payments, or an internal guide | CDG solution pages or internal |

Clicks on outbound rungs fire `affiliate_cta_click` (see `src/lib/affiliate-track.ts`) with page, position, type, and label. The event goes to a DOM `CustomEvent` and `window.dataLayer`; no analytics script is loaded by default.

## Facts about CDG

`src/lib/cdg.ts` holds every CDG number the site shows, with the source URL and the date it was checked. Update it there, not in pages.

## Key routes

- `/` homepage: volume and business-type chooser, featured guides, create-invoice CTA
- `/app`, `/app/sign-up`, `/app/sign-in` invoice product (noindex)
- `/i/[publicId]` public invoice (noindex, print-friendly, no card fields)
- `/invoices` marketing / waitlist soft landing
- `/cdgcommerce` the CDG Commerce review and pricing hub
- `/cdgcommerce/online-payments`, `/retail`, `/wireless`, `/recurring-billing`, `/b2b` channel pages
- `/get-started` the chooser for readers who already know they want a quote
- `/blog`, `/blog/[slug]` guides
- `/methodology` how scores are set
- `/authors/alberto-vasquez` author page
- `/about`, `/affiliate-disclosure`, `/privacy`
- `/cdg-commerce` redirects to `/cdgcommerce`
- `/sitemap.xml`, `/robots.txt`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run style:check` | Style guide checks (banned phrases, dashes, raw palette classes) |
| `npm run check` | Typecheck, lint, and style check together. Run before every commit. |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | Push schema (early MVP; needs `DATABASE_URL`) |
| `npm run db:migrate` | Prisma migrate dev |

## Deploy

Vercel deploys from `main` on `albertovasquez/clientbilling`.
