# ClientBilling (clientbilling.com)

Production-ready Next.js site for **ClientBilling** — a blog on customer billing best practices for B2B SaaS / subscription / invoicing teams, with affiliate conversion CTAs.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Markdown posts in `content/blog` (gray-matter + remark)
- No auth, no database, no paid APIs for MVP

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_AFFILIATE_SIGNUP_URL` | Recommended | Public affiliate / partner signup URL used by CTAs. Defaults to `https://example.com/signup` if unset. |

See `.env.example`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Deploy (Vercel)

This repository is configured so **Vercel deploys from `main`**.

1. Import `albertovasquez/clientbilling` in Vercel
2. Set `NEXT_PUBLIC_AFFILIATE_SIGNUP_URL` in project env
3. Deploy from the `main` branch (production)

No special build command overrides are required (`next build` / `next start` defaults).

## Project structure

```
content/blog/          Markdown posts
src/app/               App Router pages (home, blog, about, privacy, disclosure)
src/components/        Header, Footer, CTAs, PostCard
src/lib/               site config + post helpers
```

## Routes

- `/` — Home (value prop, featured posts, primary CTA)
- `/blog` — Blog index
- `/blog/[slug]` — Post pages with end-of-post affiliate CTA
- `/about` — About & how affiliate model works
- `/privacy` — Privacy stub
- `/affiliate-disclosure` — Affiliate disclosure
- `/sitemap.xml` / `/robots.txt` — SEO

## License

Private/public repo per GitHub settings; content © ClientBilling.
