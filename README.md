# ClientBilling (clientbilling.com)

Next.js App Router site with **payments and billing guidance** for businesses that want to get paid better, plus a transparent affiliate funnel into **CDG Commerce**.

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
| `NEXT_PUBLIC_AFFILIATE_SIGNUP_URL` | Optional | Bottom-of-funnel CDG merchant apply / free-quote URL. Defaults to the ClientBilling agent link with UTMs. |

Default apply / quote URL (tracked money CTA):

`https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site`

Mid-funnel R=470 landings (Online / Retail / Wireless Explore on `/get-started`):

- `https://www.cdgcommerce.com/my_landing/?R=470&type=internet`
- `https://www.cdgcommerce.com/my_landing/?R=470&type=retail`
- `https://www.cdgcommerce.com/my_landing/?R=470&type=wireless`

Recurring & B2B Explore stay on internal `/cdgcommerce/recurring-billing` and `/cdgcommerce/b2b`.

## Funnel model

1. Soft CTAs → **See CDG Options** / **Get a Free CDG Quote**
2. Mid-funnel Explore → R=470 landings (Online/In-Person/Mobile) or internal guides (Recurring/B2B)
3. Hard convert → Check eligibility / Apply for a merchant account (lower on pages)
4. Tracked via `TrackedAffiliateLink` + `affiliate_cta_click`

## Key routes

- `/` — Editorial homepage (volume selector, soft CTAs)
- `/cdgcommerce` — Primary money page (glance, fit/not-fit, pricing models, features, FAQ)
- `/cdgcommerce/online-payments` | `/retail` | `/wireless` | `/recurring-billing` | `/b2b`
- `/get-started` — Why CDG + five intent paths + prequalification
- `/cdg-commerce` → redirects to `/cdgcommerce`
- `/blog`, `/blog/[slug]` — Guides with contextual mid + end CTAs
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
