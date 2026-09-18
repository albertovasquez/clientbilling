# ClientBilling style guide and rollout: design spec

Date: 2026-09-17
Status: approved in conversation, implementation on branch `style-guide`
Companion: `docs/research/2026-09-17-traffic-gap-report.md`

## Goal

Give clientbilling.com one written style guide (visual, editorial, CTA) and make the codebase follow it: semantic tokens, a primitives layer, a fixed CTA ladder, a check script that fails on violations, and every existing page migrated. Fix the funnel defects the research found while touching those pages.

## Decisions made

- Keep the current direction (teal action color, slate neutrals, Source Serif display, Source Sans body) and refine it with three upgrades: rates as the hero, facts in rules and decisions in cards, and a verdict system.
- Quote-labelled CTAs go to CDG's quote form `https://www.cdgcommerce.com/applynow/?R=470` with UTMs. "Start a CDG application" keeps the secure application URL. The owner verifies with CDG that applynow attributes R=470.
- Author is Alberto Vasquez, with an author page and `Person` JSON-LD.
- Volume bands and business-type labels match CDG's published ones.
- Out of scope: new posts, the fee calculator, analytics vendor setup, per-post OG images beyond the existing site image. These stay on the roadmap.

## 1. Tokens

Defined once in `src/app/globals.css` under `@theme`. Pages and components use only semantic utilities (`text-ink`, `bg-action`, `border-rule`). Raw palette classes (`teal-800`, `slate-600`, `amber-50`) are allowed only inside `src/components/ui/` and `globals.css`.

Color

| Token | Value | Use |
| --- | --- | --- |
| ink | #0f172a | headings, primary text |
| ink-soft | #334155 | body text in prose |
| muted | #64748b | captions, meta, source notes |
| paper | #ffffff | page and card surface |
| field | #f8fafc | alternating section band, footer |
| rule | #e2e8f0 | hairline dividers, table rules |
| rule-strong | #cbd5e1 | secondary button border, table header rule |
| action | #115e59 | primary button fill, links, focus ring |
| action-hover | #0f766e | hover state |
| action-tint | #f0fdfa | decision card surface, "fits" column only |
| verdict | #b45309 | score and best-for text |
| verdict-tint | #fffbeb | verdict box surface only |
| verdict-rule | #fde68a | verdict box border only |

Type

| Token | Face | Size / line | Use |
| --- | --- | --- | --- |
| display-xl | Source Serif 4, 600 | 3rem / 1.1 (2.25rem on mobile) | page h1 |
| display-lg | Source Serif 4, 600 | 2.25rem / 1.15 | section h2 |
| display-md | Source Serif 4, 600 | 1.75rem / 1.2 | sub-section h2 in prose, rate figures |
| display-sm | Source Serif 4, 600 | 1.375rem / 1.3 | h3, card titles |
| body | Source Sans 3, 400 | 1.0625rem / 1.6 | default |
| small | Source Sans 3 | 0.9375rem / 1.5 | secondary text, buttons |
| caption | Source Sans 3 | 0.8125rem / 1.5 | meta, source notes, disclosure |

All figures use `font-variant-numeric: tabular-nums`. Measure: prose 68ch, article container 44rem, page container 72rem.

Shape and depth: buttons radius 0.5rem; DecisionCard and VerdictBox radius 1rem; nothing else is rounded or boxed. No drop shadows except the sticky header's hairline. No gradients.

Spacing: sections `py-14 sm:py-20`; stacked content gaps from the 2/3/4/6/8 scale; nothing ad hoc.

Motion: hover color change only, 150ms. No entrance animations. `prefers-reduced-motion` respected by default because nothing else moves.

## 2. Primitives (`src/components/ui/`)

Each is a server component unless noted, accepts `className` for layout only, and owns its colors.

| Component | Purpose | Key props |
| --- | --- | --- |
| Button | The only button styling | `variant: primary / secondary / quiet`, `size: md / lg`, renders `Link`, `a`, or wraps `TrackedAffiliateLink` via `tracked` prop |
| Container | Width and gutter | `width: page / article / prose` |
| Section | Vertical rhythm and band | `band: paper / field`, optional `rule` top border |
| Heading | Display scale | `level: 1-3`, `size: xl / lg / md / sm` |
| Kicker | Informational line above a heading, sentence case, muted | children |
| SourceNote | "Source: CDG Commerce pricing page, checked Sep 2026" with link | `source: { label, href }`, `checked: date` |
| FactRows | Ruled definition rows (label / value) replacing fact cards | `rows: { label, value }[]`, `columns: 1 / 2` |
| RateLockup | Large tabular figure with label and source | `figure`, `label`, `source?`, `size: md / lg` |
| DecisionCard | The only boxed unit, at most one per screen of content (a long article may have a mid and an end one): heading, body, up to two buttons, one quiet link | `tone: action / verdict`, `title`, children, `actions` |
| Badge | Best-for and tag pills | `tone: verdict / neutral` |
| RatingBadge | Numeric score with sub-scores | `score`, `subscores: { label, value }[]` |
| VerdictBox | Score, best-for, who should, who should not, primary and secondary CTA | `rating`, `bestFor`, `forList`, `notForList`, `actions` |
| CompareTable | Side-by-side table, first column sticky on mobile scroll | `columns`, `rows` |
| ProsCons | Two lists | `pros`, `cons` |
| Disclosure | One fixed sentence with link to the disclosure page | `compact?` |
| Breadcrumb | Visual breadcrumb plus `BreadcrumbList` JSON-LD | `items` |

Existing `SoftCdgCta`, `MidArticleCdgCard`, `EndArticleCdgCta`, `AffiliateCTA`, `FitNotFit`, `PostCard`, `Header`, `Footer` are rebuilt on top of the primitives or replaced. `TrackedAffiliateLink` stays as the tracked anchor.

## 3. CTA ladder (`src/lib/cta.ts`)

Fixed labels and destinations. No page invents button text.

| Key | Label | Destination | Tracking `cta_type` |
| --- | --- | --- | --- |
| compare | Compare CDG pricing | /cdgcommerce | compare |
| fit | See if CDG fits | /cdgcommerce#fit | fit |
| quote | Get a free quote from CDG | `siteConfig.quoteUrl` (applynow, R=470, UTMs) | quote |
| apply | Start a CDG application | `siteConfig.affiliateSignupUrl` (secure app) | apply |
| exploreOnline / exploreRetail / exploreMobile | Explore CDG online payments, in-person payments, mobile payments | R=470 landings | explore |

Placement rules

- One primary button per section; at most two buttons in a group; a third action is a quiet link.
- Hero: compare (primary) and quote (secondary). Never apply.
- After the first pricing table or RateLockup group: quote (primary) and compare or fit (secondary).
- End of page: VerdictBox on review, hub, and comparison pages; DecisionCard elsewhere. Apply appears only inside VerdictBox, DecisionCard, or the footer.
- Articles: no buttons before the first pricing content; mid-article DecisionCard after the pricing section, VerdictBox or DecisionCard at the end.
- `ctaPosition` values: hero, after_pricing, inline, verdict, end, footer, nav, card.

## 4. Editorial rules

Voice: plain, second person, sentence case, active verbs, no exclamation marks, no rhetorical questions in headings. Say what CDG publishes, say what we could not verify, say who a plan is not for.

Attribution: numbers carry a source once per section through SourceNote. Inline "as CDG states" is banned. Third-party figures name the third party.

Banned in visitor-facing copy: "as CDG states", "as CDG publishes", "as CDG lists", "mid-funnel", "bottom-of-funnel", "hard convert", "soft CTA", "secondary hard", "R=470", "tracked link", "money page", em dashes, en dashes, arrows appended to link text, tracked all-caps labels.

Disclosure: one sentence, one component, directly under every page title: "ClientBilling may earn a commission if you apply to CDG Commerce through our links. It does not change your pricing. Details." Affiliate anchors keep `rel="sponsored noopener"`.

Frontmatter: add `updated` (ISO date), `author` (slug), `sources` (list of `{ label, href }`), optional `rating` (`{ overall, pricing, contract, support }`), optional `bestFor`. `posts.ts` validates and exposes them. Article JSON-LD gains `dateModified` and a `Person` author with `url`.

Templates (section order; CTA positions in brackets)

- Review, 2,000-3,000 words: title, disclosure, RatingBadge and best-for, at a glance (FactRows), pros and cons, who it is for, pricing (CompareTable with RateLockups) [after_pricing DecisionCard], features, contract and fees, support, reputation, VerdictBox [verdict], author card, related.
- Comparison, 1,800-2,500: title, disclosure, quick answer (choose X if / choose Y if), CompareTable, pricing worked example at a stated volume [after_pricing], features, choose X if / choose Y if, VerdictBox [verdict], FAQ.
- Pricing explainer, 1,500-2,500: definition, how it works, example transaction with real numbers, what a quote looks like, versus alternatives, pitfalls and questions to ask, which processors offer it [after_pricing DecisionCard], should you switch [end DecisionCard].
- Best for vertical, 1,500-2,500: quick answer, what the vertical needs, CDG fit with rates for that vertical [after_pricing], alternatives considered, VerdictBox [verdict].
- Channel page (hub sub-pages): title, disclosure, RateLockup group for that channel, FactRows, who it fits, DecisionCard [end].

## 5. Pages added

- `/methodology`: how scores are built (pricing transparency, contract terms, support; each 1-5; overall is the mean), sources used, how compensation is separated from ratings, update cadence.
- `/authors/alberto-vasquez`: name, role, short bio, links; target of every byline and of `Person.url` in JSON-LD.
- Root layout gains `Organization` JSON-LD.

## 6. Enforcement

`scripts/style-check.mjs`, run by `npm run style:check` and included in `npm run check` with typecheck and lint. It scans `src/app`, `src/components` (excluding `ui/`), and `content/` and fails with `file:line` for: banned phrases, em and en dashes in `.tsx` string literals and in markdown body, raw palette color classes outside `ui/`, `uppercase` combined with `tracking-`, and literal arrows. `AGENTS.md` gets a line pointing to `docs/STYLE_GUIDE.md` and the check.

## 7. Migration scope

All pages: `/`, `/cdgcommerce` and five sub-pages, `/get-started`, `/blog`, `/blog/[slug]`, `/about`, `/affiliate-disclosure`, `/privacy`, `/not-found`, Header, Footer. Content posts: frontmatter additions, jargon and attribution cleanup, em dashes removed; the CDG review post gets the review template with provisional scores the owner can adjust.

Homepage volume chooser becomes three CDG bands (under $10K flat rate, $10K-200K interchange plus, $200K+ wholesale) and six CDG business types.

## 8. Verification

- `npm run check` green (tsc, eslint, style-check).
- `npm run build` green.
- Screenshots of `/`, `/cdgcommerce`, a channel page, the review post, and `/get-started` at 1280 and 390 widths reviewed against the guide.
- Grep confirms zero occurrences of banned phrases and zero raw palette classes outside `ui/`.
- Every quote-labelled anchor resolves to the applynow URL; every apply-labelled anchor to the secure app URL.

## Risks

- Attribution of the applynow form to agent 470 is unverified; the owner confirms with CDG before merge.
- Scores are editorial and provisional; the methodology page describes how they are set, and the owner adjusts values in the review post frontmatter.
