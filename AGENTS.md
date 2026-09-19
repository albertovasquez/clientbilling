<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Style guide

Read `docs/STYLE_GUIDE.md` before editing any page, component, or post. It defines tokens, primitives (`src/components/ui`), the CTA ladder (`src/lib/cta.ts`), voice, attribution, and page templates. `npm run check` runs typecheck, lint, and the style check; it must pass before a commit. No em dashes or en dashes anywhere.

# Mission

Before any change, read `docs/mission/README.md` and follow its reading order. It owns the product thesis, the compliance boundary (no card data, no funds, not merchant of record), the CDG affiliate rules (R=470 on every CDG link), the agent operating manual with its stop-and-ask triggers, and the definition of done. Cite the mission files in a PR that touches Collect, CDG copy, fees, legal pages, auth, or email.

Strategy research lives in `docs/strategy/`. Read `docs/strategy/2026-09-18-research-profitable-differentiated-product.md` (the current plan) and `docs/strategy/2026-09-18-research-niche-and-monetization.md` after the mission files to understand where the business is headed: product-first positioning, payment-aware invoicing, an agent billing API, and x402 for machine payments. It is input, not policy. Their editor's notes say what decisions 0021 and 0022 adopted and what remains open (reopening 0014 is the founder's call); a decision in `docs/decisions/` wins.
