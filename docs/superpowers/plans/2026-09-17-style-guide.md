# Style guide and rollout implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write `docs/STYLE_GUIDE.md`, encode it as tokens, primitives, a CTA ladder and a check script, and migrate every page and post onto it.

**Architecture:** Tokens live in `globals.css` under Tailwind v4 `@theme` with semantic names. A primitives layer in `src/components/ui/` is the only place raw palette classes are allowed. A `cta.ts` ladder is the only source of button labels and destinations. `scripts/style-check.mjs` fails the build on violations. Pages are then rewritten to compose primitives.

**Tech Stack:** Next 16.3 App Router, React 19, Tailwind 4 (`@theme`), TypeScript 5, ESLint 9, Node 22 script (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-09-17-style-guide-design.md`

## Global Constraints

- Work only in the worktree `/Users/alberto/Work/bitlabs/clientbilling-style-guide` on branch `style-guide`. Run `pwd` before editing.
- No em dashes or en dashes anywhere: code, copy, markdown, commit messages. Use a comma, colon, or hyphen.
- No `Co-Authored-By` or generated-with trailers in commits.
- Raw palette classes (`teal-`, `slate-`, `amber-`, `emerald-`, `white`, `black` as colors) only in `src/components/ui/**` and `src/app/globals.css`. Everywhere else use semantic utilities: `text-ink`, `text-ink-soft`, `text-muted`, `bg-paper`, `bg-field`, `border-rule`, `border-rule-strong`, `bg-action`, `text-action`, `bg-action-tint`, `text-verdict`, `bg-verdict-tint`, `border-verdict-rule`.
- Visitor-facing copy never contains: "as CDG states", "as CDG publishes", "as CDG lists", "mid-funnel", "bottom-of-funnel", "hard convert", "soft CTA", "secondary hard", "R=470", "tracked link", "money page". No literal arrows in link text. No `uppercase` with `tracking-`.
- Button labels come only from `src/lib/cta.ts`.
- Read `docs/STYLE_GUIDE.md` before touching any page.
- Verification for every task: `npm run check` (tsc, eslint, style-check) passes.

---

### Task 1: Tokens

**Files:**
- Modify: `src/app/globals.css`

**Produces:** utilities `text-ink`, `text-ink-soft`, `text-muted`, `bg-paper`, `bg-field`, `border-rule`, `border-rule-strong`, `bg-action`, `text-action`, `bg-action-hover`, `bg-action-tint`, `text-verdict`, `bg-verdict-tint`, `border-verdict-rule`, `font-display`, `font-sans`, `text-display-xl`, `text-display-lg`, `text-display-md`, `text-display-sm`, `text-body`, `text-small`, `text-caption`, `max-w-prose-guide` (68ch), `max-w-article` (44rem), `max-w-page` (72rem).

- [ ] Replace the `:root` and `@theme inline` blocks with:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-ink: #0f172a;
  --color-ink-soft: #334155;
  --color-muted: #64748b;
  --color-paper: #ffffff;
  --color-field: #f8fafc;
  --color-rule: #e2e8f0;
  --color-rule-strong: #cbd5e1;
  --color-action: #115e59;
  --color-action-hover: #0f766e;
  --color-action-tint: #f0fdfa;
  --color-verdict: #b45309;
  --color-verdict-tint: #fffbeb;
  --color-verdict-rule: #fde68a;

  --font-sans: var(--font-source-sans), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-source-serif), ui-serif, Georgia, serif;

  --text-display-xl: 3rem;
  --text-display-xl--line-height: 1.1;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-lg: 2.25rem;
  --text-display-lg--line-height: 1.15;
  --text-display-lg--letter-spacing: -0.015em;
  --text-display-md: 1.75rem;
  --text-display-md--line-height: 1.2;
  --text-display-sm: 1.375rem;
  --text-display-sm--line-height: 1.3;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.6;
  --text-small: 0.9375rem;
  --text-small--line-height: 1.5;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.5;

  --container-prose-guide: 68ch;
  --container-article: 44rem;
  --container-page: 72rem;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  font-variant-numeric: tabular-nums;
}
```

- [ ] Keep `.prose-billing` but repoint its variables at tokens and cap measure at 68ch: `max-width: var(--container-prose-guide)`.
- [ ] Verify: `npm run build` passes (dev server hot reload is enough during work).

### Task 2: CTA ladder and tracking types

**Files:**
- Create: `src/lib/cta.ts`
- Modify: `src/lib/site.ts` (add `quoteUrl`, keep `affiliateSignupUrl`)
- Modify: `src/lib/affiliate-track.ts` (`cta_type` union)
- Modify: `src/components/TrackedAffiliateLink.tsx` (accept `CtaType`, drop unused `_e`)

**Produces:**

```ts
export type CtaKey =
  | "compare" | "fit" | "quote" | "apply"
  | "exploreOnline" | "exploreRetail" | "exploreMobile"
  | "exploreRecurring" | "exploreB2b";
export type CtaType = "compare" | "fit" | "quote" | "apply" | "explore";
export type CtaPosition =
  | "hero" | "after_pricing" | "inline" | "verdict" | "end" | "footer" | "nav" | "card";
export type Cta = { key: CtaKey; label: string; href: string; type: CtaType; external: boolean };
export const ctas: Record<CtaKey, Cta>;
export function cta(key: CtaKey): Cta;
```

- [ ] Labels: compare "Compare CDG pricing" (/cdgcommerce); fit "See if CDG fits" (/cdgcommerce#fit); quote "Get a free quote from CDG" (`siteConfig.quoteUrl`); apply "Start a CDG application" (`siteConfig.affiliateSignupUrl`); exploreOnline "Explore CDG online payments" (landing internet); exploreRetail "Explore CDG in-person payments" (landing retail); exploreMobile "Explore CDG mobile payments" (landing wireless); exploreRecurring "Read the recurring billing guide" (/cdgcommerce/recurring-billing); exploreB2b "Read the B2B payments guide" (/cdgcommerce/b2b).
- [ ] `siteConfig.quoteUrl` default: `https://www.cdgcommerce.com/applynow/?R=470&utm_source=clientbilling&utm_medium=cta&utm_campaign=quote`, overridable by `NEXT_PUBLIC_CDG_QUOTE_URL`. Document in `.env.example` and README.
- [ ] Remove `softCtaCopy` from `site.ts` once no page imports it (final task).
- [ ] Verify: `npx tsc --noEmit` passes.

### Task 3: Primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `CtaButton.tsx`, `Container.tsx`, `Section.tsx`, `Heading.tsx`, `Kicker.tsx`, `SourceNote.tsx`, `FactRows.tsx`, `RateLockup.tsx`, `DecisionCard.tsx`, `Badge.tsx`, `RatingBadge.tsx`, `VerdictBox.tsx`, `CompareTable.tsx`, `ProsCons.tsx`, `Disclosure.tsx`, `Breadcrumb.tsx`, `AuthorCard.tsx`, `index.ts`

**Produces (exact signatures):**

```tsx
// Button: internal or plain external link with the only button styling
type ButtonProps = {
  href: string; variant?: "primary" | "secondary" | "quiet"; size?: "md" | "lg";
  external?: boolean; className?: string; children: React.ReactNode;
};
// CtaButton: label, destination, tracking all from the ladder
type CtaButtonProps = {
  cta: CtaKey; position: CtaPosition; variant?: "primary" | "secondary" | "quiet";
  size?: "md" | "lg"; articleSlug?: string; className?: string;
};
type ContainerProps = { width?: "page" | "article" | "prose"; className?: string; children };
type SectionProps = { band?: "paper" | "field"; rule?: boolean; className?: string; id?: string; children };
type HeadingProps = { level: 1 | 2 | 3; size?: "xl" | "lg" | "md" | "sm"; className?: string; id?: string; children };
type KickerProps = { className?: string; children };
type SourceNoteProps = { source: { label: string; href: string }; checked: string; note?: string; className?: string };
type FactRowsProps = { rows: { label: React.ReactNode; value: React.ReactNode }[]; columns?: 1 | 2; className?: string };
type RateLockupProps = { figure: string; label: string; detail?: string; size?: "md" | "lg"; className?: string };
type DecisionCardProps = { tone?: "action" | "verdict"; title: string; actions: React.ReactNode; note?: React.ReactNode; className?: string; children? };
type BadgeProps = { tone?: "verdict" | "neutral"; children };
type Rating = { overall: number; pricing: number; contract: number; support: number };
type RatingBadgeProps = { rating: Rating; bestFor?: string; size?: "md" | "lg"; className?: string };
type VerdictBoxProps = { rating: Rating; bestFor: string; forList: string[]; notForList: string[]; actions: React.ReactNode; title?: string; className?: string };
type CompareTableProps = { caption?: string; columns: string[]; rows: { label: string; values: React.ReactNode[] }[]; className?: string };
type ProsConsProps = { pros: string[]; cons: string[]; className?: string };
type DisclosureProps = { compact?: boolean; className?: string };
type BreadcrumbProps = { items: { label: string; href?: string }[]; className?: string };
type AuthorCardProps = { className?: string };  // reads the author from src/lib/author.ts
```

- [ ] `CtaButton` renders `TrackedAffiliateLink` when `external`, else `Link`; passes `ctaPosition={position}`, `ctaType={type}`, `ctaText={label}`.
- [ ] `Disclosure` text: "ClientBilling may earn a commission if you apply to CDG Commerce through our links. It does not change your pricing." followed by a "Details" link to `/affiliate-disclosure`.
- [ ] `Breadcrumb` emits `BreadcrumbList` JSON-LD with absolute URLs from `siteConfig.url`.
- [ ] `RatingBadge` renders the overall score at `font-display` size with "/ 5" small, then three sub-scores as a ruled row.
- [ ] Verify: `npx tsc --noEmit` passes; a scratch page renders each primitive (delete before commit).

### Task 4: Author and methodology

**Files:**
- Create: `src/lib/author.ts` (`export const author = { slug, name, role, bio, url, sameAs: string[] }`)
- Create: `src/app/authors/alberto-vasquez/page.tsx`, `src/app/methodology/page.tsx`
- Modify: `src/app/layout.tsx` (Organization JSON-LD), `src/app/sitemap.ts` (add routes, real dates)

- [ ] Methodology explains three sub-scores (pricing transparency, contract terms, support), each 1 to 5, overall is the mean rounded to one decimal; data sources; compensation separation; update cadence.
- [ ] Sitemap: replace `new Date()` with a `STATIC_UPDATED` constant per route and `post.updated ?? post.date` for posts.

### Task 5: Posts library and frontmatter

**Files:**
- Modify: `src/lib/posts.ts` (parse `updated`, `sources`, `rating`, `bestFor`; `author` becomes the author slug)
- Modify: all `content/blog/*.md` frontmatter and bodies

- [ ] `PostMeta` gains `updated?: string`, `sources: { label: string; href: string }[]`, `rating?: Rating`, `bestFor?: string`.
- [ ] Every post: `author: "alberto-vasquez"`, `updated: "2026-09-17"`, sources listed, em dashes replaced, banned phrases removed, attribution moved to a single source line per section.
- [ ] The CDG review post gets `rating` (provisional: pricing 4.5, contract 4.0, support 4.5, overall 4.3) and `bestFor`.

### Task 6: Style check script

**Files:**
- Create: `scripts/style-check.mjs`
- Modify: `package.json` scripts: `"style:check": "node scripts/style-check.mjs"`, `"check": "tsc --noEmit && eslint && node scripts/style-check.mjs"`

- [ ] Scan `src/app/**/*.tsx`, `src/components/**/*.tsx` (skip `src/components/ui/`), `content/**/*.md`. Rules: banned phrases (case-insensitive); `—` or `–` anywhere in `.md`, and inside string or JSX text in `.tsx` (simplest: anywhere in the file); regex `\b(bg|text|border|ring|outline|divide|from|to|via)-(teal|slate|amber|emerald|white|black)(-\d+)?\b` outside `ui/` and `globals.css`; `uppercase` and `tracking-` on the same line; literal `→` or `←`. Print `path:line: rule: snippet`, exit 1 on any hit.
- [ ] Verify: run it on the unmigrated tree and confirm it reports the known violations; it must pass on the migrated tree.

### Task 7: Style guide document

**Files:**
- Create: `docs/STYLE_GUIDE.md`
- Modify: `AGENTS.md` (append pointer), `README.md` (funnel section rewritten to the ladder, env var added)

- [ ] Sections: purpose, tokens table, type scale, layout and spacing, components (when to use each, with a JSX example), CTA ladder and placement rules, tracking positions, voice, attribution, banned list, disclosure, frontmatter, page templates, checklist before publishing, how to run the check.

### Task 8: Shell components

**Files:**
- Rewrite: `src/components/Header.tsx`, `Footer.tsx`, `PostCard.tsx`
- Delete: `src/components/AffiliateCTA.tsx`, `SoftCdgCta.tsx`, `MidArticleCdgCard.tsx`, `EndArticleCdgCta.tsx`, `FitNotFit.tsx` after their users are migrated (Task 9)

- [ ] Header: brand mark, nav, one `CtaButton cta="compare" position="nav"`.
- [ ] Footer: brand, explore links, one DecisionCard-free block with quote (secondary) and apply (quiet), disclosure and privacy links.
- [ ] PostCard: no card border; ruled list item with date, updated, title, description, best-for badge if any.

### Task 9: Page migrations (parallelizable, one agent per group)

Group A: `src/app/page.tsx`, `src/app/get-started/page.tsx`
Group B: `src/app/cdgcommerce/page.tsx` and the five sub-pages
Group C: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/not-found.tsx`
Group D: `src/app/about/page.tsx`, `src/app/affiliate-disclosure/page.tsx`, `src/app/privacy/page.tsx`

Each group: read `docs/STYLE_GUIDE.md`, compose primitives only, use `CtaButton` for every CTA, remove jargon, one Disclosure under each title, SourceNote where numbers appear, volume bands and business types per the guide. Then `npm run check`.

### Task 10: Verification and cleanup

- [ ] Delete the replaced components, `softCtaCopy`, unused `cdgClaims` fields.
- [ ] `npm run check` and `npm run build` green.
- [ ] Screenshots at 1280 and 390 of `/`, `/cdgcommerce`, `/cdgcommerce/retail`, the review post, `/get-started`; compare with the guide.
- [ ] Grep: zero banned phrases; every quote anchor resolves to applynow; every apply anchor to the secure app.
- [ ] Commit in logical chunks: tokens and ladder; primitives; guide and check; posts; pages; cleanup.
