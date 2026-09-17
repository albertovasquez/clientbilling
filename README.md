# ClientBilling (clientbilling.com)

Next.js App Router site that helps businesses **choose a payment processing setup**, with a transparent affiliate funnel into **CDG Commerce**.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Markdown posts in `content/blog` (gray-matter + remark)
- No auth, no database, no paid analytics required for MVP

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
| `NEXT_PUBLIC_AFFILIATE_SIGNUP_URL` | Recommended | Bottom-of-funnel CDG merchant apply URL. Defaults to the ClientBilling agent link with UTMs. |

Default apply URL (only tracked conversion URL for money intent):

`https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site`

Optional mid-funnel landings live in `src/lib/site.ts` (`partnerLandings`) but **Explore** paths use internal `/cdgcommerce/*` pages first.

## Funnel model

1. Soft CTAs → internal guides (`/cdgcommerce`, channel pages)
2. Mid-article cards → soft research CTAs
3. Bottom-of-funnel → tracked affiliate apply URL only
4. No nav/footer links to bare `cdgcommerce.com` marketing pages

## Key routes

- `/` — Decision homepage (volume selector, soft CTAs)
- `/cdgcommerce` — Primary money page (pricing, features, fit, FAQ)
- `/cdgcommerce/online-payments` | `/retail` | `/recurring-billing` | `/wireless`
- `/get-started` — Light path into internal CDG guides
- `/blog`, `/blog/[slug]` — Reviews + guides with mid + end CTAs
- `/about`, `/affiliate-disclosure`, `/privacy`
- `/sitemap.xml`, `/robots.txt`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Deploy

Vercel deploys from `main` on `albertovasquez/clientbilling`.

## Deferred / not in this pass

- Deterministic fit quiz page
- Full compare hub
- Sticky mobile CTA
