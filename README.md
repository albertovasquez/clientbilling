# ClientBilling (clientbilling.com)

Next.js App Router site with plain-language guides to merchant accounts, processing fees, recurring billing, invoicing, and POS, plus a disclosed affiliate funnel into CDG Commerce.

Start with `docs/STYLE_GUIDE.md`. It defines the look, the voice, the CTA ladder, and the page templates, and `npm run check` enforces the parts a script can catch.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 with semantic tokens in `src/app/globals.css`
- Primitives in `src/components/ui` (the only place raw palette classes are allowed)
- Markdown posts in `content/blog` (gray-matter + remark)
- No auth, no database, no paid analytics required

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
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Set to `clientbilling.com` to load Plausible with outbound-link tracking. Unset means no analytics script. |

Defaults for both are in `src/lib/site.ts`. The explore CTAs use CDG's agent-attributed solution pages (`my_landing/?R=470&type=...`), also in `site.ts`.

## CTA ladder

Every button label and destination comes from `src/lib/cta.ts`. Pages render `CtaButton` with a rung and a position; see the style guide, section 4.

| Rung | Label | Destination |
| --- | --- | --- |
| compare | Compare CDG pricing | `/cdgcommerce` |
| fit | See if CDG fits | `/cdgcommerce#fit` |
| quote | Get a free quote from CDG | CDG quote form |
| apply | Start a CDG application | CDG secure application |
| explore* | Explore CDG online / in-person / mobile payments, or an internal guide | CDG solution pages or internal |

Clicks on outbound rungs fire `affiliate_cta_click` (see `src/lib/affiliate-track.ts`) with page, position, type, and label. The event goes to a DOM `CustomEvent`, `window.dataLayer`, and Plausible as a custom event when the script is loaded.

## Facts about CDG

`src/lib/cdg.ts` holds every CDG number the site shows, with the source URL and the date it was checked. Update it there, not in pages.

## Key routes

- `/` homepage: volume and business-type chooser, featured guides
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

## Deploy

Vercel deploys from `main` on `albertovasquez/clientbilling`.
