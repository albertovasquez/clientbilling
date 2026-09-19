# ClientBilling style guide

This is the source of truth for how clientbilling.com looks, reads, and asks for action. The code enforces the parts a script can catch (`npm run style:check`); this document covers the rest. Read it before touching a page or writing a post.

Why it exists: the site's job is to earn a reader's trust on a money decision and then hand them to CDG Commerce at the right moment. Consistency is what makes a ten-page site feel like a publication instead of a landing page.

## 1. Principles

1. Numbers are the product. Published rates, set large and sourced, are what a reader came for. Everything else is quieter.
2. Facts sit in rules, decisions sit in cards. A bordered box means "decide something here". Nothing else gets a box.
3. Say who said it, once. A source line per section replaces hedging in every sentence.
4. One primary action per screen. Two buttons at most, the third action is a text link.
5. Plain words, sentence case, no exclamation marks, no internal jargon.

## 2. Tokens

The identity is Carbon Copy (`docs/brand/brief.md`, decision 0021). Tokens are defined in `src/app/globals.css` under `@theme`; pages use only the semantic utilities. Raw palette classes are allowed only in `src/components/ui/`. The code holds these values since ticket #42; the retired names `action`, `action-hover`, `action-tint`, `verdict`, `verdict-tint`, and `verdict-rule` are aliases of `carbon`, `carbon-deep`, `carbon-tint`, `due`, `due-tint`, and a due-toned rule for one release (removal is issue #49).

| Token | Value | Utilities | Use |
| --- | --- | --- | --- |
| paper | #FBFAF6 | `bg-paper` | page background, warm white |
| sheet | #FFFFFF | `bg-sheet`, `text-sheet` | documents, inputs, the invoice itself, button text |
| ink | #15142B | `text-ink` | headings, primary text, totals |
| ink-soft | #3E3D52 | `text-ink-soft` | body and list text |
| muted | #6E6C80 | `text-muted` | captions, labels, meta, source notes |
| field | #F4F3EE | `bg-field` | alternating section band, app background |
| rule | #E6E3DA | `border-rule`, `divide-rule` | hairlines |
| rule-strong | #C8C4B6 | `border-rule-strong` | table heads, totals rule, secondary button border |
| rule-print | #DDD9CF | PDF only | ledger and invoice lines on paper |
| carbon | #3F3BA6 | `bg-carbon`, `text-carbon` | the one accent: primary button, links, the mark, copy labels |
| carbon-deep | #2C2986 | `hover:bg-carbon-deep` | hover and pressed |
| carbon-tint | #ECEBF8 | `bg-carbon-tint` | selected states, the offset sheet behind a record |
| cleared | #1E7A4D | `text-cleared` | paid, settled, received, verified |
| cleared-tint | #E4F3EA | `bg-cleared-tint` | paid badge ground, the recommended rail row |
| due | #B4451D | `text-due` | overdue, errors, void |
| due-tint | #FBEBE4 | `bg-due-tint` | overdue badge ground |

New code uses the new names. Existing pages and posts keep working through the aliases until #49 removes them.

Type

One family, three roles: IBM Plex.

| Utility | Face | Size / line | Use |
| --- | --- | --- | --- |
| `text-display-xl` | Plex Sans 600, tracking -0.025em | 3.5rem / 1.05 | page h1 (falls to lg on mobile) |
| `text-display-lg` | Plex Sans 600, tracking -0.02em | 2.25rem / 1.15 | section h2 |
| `text-display-md` | Plex Sans 600, tracking -0.02em | 1.75rem / 1.2 | prose h2, card titles |
| `text-display-sm` | Plex Sans 600, tracking -0.01em | 1.375rem / 1.3 | h3 |
| `text-body` | Plex Sans 400 | 1.0625rem / 1.55 | default |
| `text-small` | Plex Sans 400 | 0.9375rem / 1.5 | secondary text, buttons, rows |
| `text-caption` | Plex Sans 400 | 0.8125rem / 1.5 | meta, source notes, disclosure |
| `font-mono` | Plex Mono 400 or 500 | inherits | money, percentages, dates, invoice numbers, record IDs, rate formulas, API output |

`font-display` is Plex Sans semibold; there is no serif. Plex Mono is for values from the record, not for labels, names, or status words. Figures are tabular by default on `body`.

The mark is the stacked record: three sheets offset by 3 px, the front sheet white with a carbon rule at its head, the two behind in carbon tint; wordmark in Plex Sans semibold, one weight. The registration mark (thin circle with a cross) marks the proof seal and nothing else, at most one per view. See `docs/brand/proofs/Specimen.dc.html`.

Width: `max-w-page` (72rem) for grids, `max-w-article` (44rem) for long-form pages, `max-w-prose-guide` (68ch) for running text. Use the `Container` component rather than the utilities directly.

Shape and depth: buttons radius 6px; documents and sheets radius 4px; badges radius 3px. No drop shadows; the only depth is the offset sheet behind a record. No gradients. No paper texture, perforations, or stamps: the carbon copy is a metaphor, not a look.

Spacing: `Section` gives `py-14 sm:py-20`. Inside a section, stack with `mt-2`, `mt-4`, `mt-6`, `mt-8`, `mt-10`. Grids use `gap-6` or `gap-8`. Numbers right-aligned in columns, always.

Motion: color changes on hover only. No entrance animations, no parallax.

## 3. Components

All in `src/components/ui`, imported from `@/components/ui`.

| Component | Use it for | Do not use it for |
| --- | --- | --- |
| `Section` | every top-level block; alternate `band="field"` to separate topics; `rule` for a hairline | nesting inside another Section |
| `Container` | width and gutter inside a Section | anything else |
| `Heading` | all headings; `level` is semantic, `size` is visual | body text |
| `Kicker` | one sentence-case line above a heading that carries information (updated date, section) | decorative labels, all caps |
| `Disclosure` | directly under the h1 of every page that shows CDG numbers or CTAs, and in the article header (the disclosure and privacy pages are exempt) | anywhere else on the page |
| `SourceNote` | the last line of any block that shows numbers | mid-paragraph hedging |
| `FactRows` | facts: at a glance, fees, company details | anything with a button |
| `RateLockup` | a published rate set large; group three or four in a grid, then a SourceNote | invented or estimated numbers |
| `CompareTable` | side by side plans or providers | layout |
| `ProsCons` | review posts and channel pages | the homepage |
| `RatingBadge` | score plus sub-scores at the top of a review or the hub | posts without a `rating` in frontmatter |
| `VerdictBox` | the end of a review, the hub, or a comparison | anywhere above the fold |
| `DecisionCard` | one decision point: title, one or two sentences, two buttons, one quiet link | facts, lists of features |
| `Badge` | `tone="verdict"` for best-for; `tone="neutral"` for tags | buttons |
| `CtaButton` | every call to action | links to internal pages that are not CTAs (use `Button` or a text link) |
| `Button` | internal navigation styled as a button | outbound affiliate links |
| `Breadcrumb` | posts and channel pages | the homepage |
| `AuthorCard` | end of every post | the hub or homepage |
| `RecordMark` | the stacked-record mark as the logo (header, favicon, PDF corner); `variant="registration"` as the corner mark of a document or section rule, at most one per view | decoration, bullets |
| `CopyLabel` | top right of a document view: `client`, `file`, or `agent` | badges, status words, tags |

The homepage hero's example invoice (`HeroInvoice`) is the file copy: `CopyLabel kind="file"`, a real table with column headers, and a source line naming CDG and the checked date. Its figures come from `src/lib/payment-costs.ts` through `src/lib/example-invoice.ts`; do not type numbers into it.

Example of a money section:

```tsx
<Section band="field" rule id="pricing">
  <Container>
    <Heading level={2}>Interchange plus, published markups</Heading>
    <div className="mt-8 grid gap-8 sm:grid-cols-3">
      {plan.rates.map((r) => (
        <RateLockup key={r.label} figure={r.figure} label={r.label} detail={r.detail} />
      ))}
    </div>
    <SourceNote source={plan.source} checked={CDG_CHECKED} className="mt-6" />
    <DecisionCard
      title="Want these rates on your own volume?"
      className="mt-10"
      actions={
        <>
          <CtaButton cta="quote" position="after_pricing" />
          <CtaButton cta="fit" position="after_pricing" variant="secondary" />
        </>
      }
    >
      CDG answers a quote request with a rate sheet and a phone call. Business type and monthly volume are the two questions they ask.
    </DecisionCard>
  </Container>
</Section>
```

### Site navigation

The header and footer read their items from `src/lib/site.ts`. A page never writes a nav item, and the header button is a CTA rung (`siteConfig.headerCta`), never a label typed into the header.

- The header is Invoices, Payments, For agents, Developers, Guides, Sign in, in that order, with the `createInvoice` button (decision 0021). The button goes to sign-up and the Invoices item to the product page, so the two never share a destination. CDG is not a brand in the header; its pages live in the footer and in the guides, keeping their URLs.
- For agents and Developers both point at `/docs/api` until the agent landing page exists (week 5). They stay separate items because they are separate audiences.
- Six items plus a button do not fit a 390 px phone, so below `lg` they collapse into a native `details` disclosure. The mark, the site name, and the button stay visible at every width. No JavaScript: the menu must open and take keyboard focus without it.
- `scripts/test-navigation.ts` holds the contract and runs inside `npm run check`: the six labels in order, their destinations, no CDG page in the header, the button going to sign-up without repeating a nav destination, and the CDG URL inventory still linked. The footer spreads the same CDG list the inventory is built from, so the two cannot drift.

### App screens: shadcn/ui

Screens under `/app` use shadcn/ui (decision 0011). The components are copy-in code in `src/components/shadcn` and are imported from `@/components/shadcn/<name>` (lowercase file names): `button`, `input`, `label`, `textarea`, `native-select`, `card`, `table`, `badge`, `alert`, `separator`. Add more with `npx shadcn@latest add <name>`; `components.json` already points the `ui` alias at that folder so nothing lands in `src/components/ui`.

- The shadcn variables (`--primary`, `--border`, `--destructive`, and the rest) are defined in `globals.css` as references to the tokens above. There is one palette and no dark mode. Do not set a raw color on a shadcn variable.
- `bg-muted` in upstream components was rewritten to `bg-field` because `muted` is a text color in this guide. Keep that substitution when adding or updating a component.
- Button variants: `default` for the one primary action on a screen, `outline` for secondary actions, `ghost` for navigation and low-emphasis controls, `destructive` only for revoke, void, and delete.
- Forms: `Label` above `Input`, `Textarea`, or `NativeSelect`, one `grid gap-1.5` wrapper per field. Errors render in `Alert variant="destructive"` with `role="alert"`; notices in `Alert` with `role="status"`.
- Records (invoices, clients, keys, schedules, funnel steps) render in `Table`. Status words render in `Badge`. Panels render in `Card`, never nested.
- `Heading`, `Section`, and `Container` from `@/components/ui` still set page titles and layout in the app. Marketing pages do not use shadcn.

## 4. CTA ladder

Labels and destinations live in `src/lib/cta.ts`. Pages pick a rung and a position; they never write button text.

| Rung | Label | Goes to | Type |
| --- | --- | --- | --- |
| compare | Compare CDG pricing | /cdgcommerce | compare |
| fit | See if CDG fits | /cdgcommerce#fit | fit |
| quote | Get a free quote from CDG | CDG quote form, agent 470 | quote |
| apply | Start a CDG application | CDG secure application, agent 470 | apply |
| exploreOnline, exploreRetail, exploreMobile | Explore CDG online / in-person / mobile payments | CDG solution pages, agent 470 | explore |
| exploreRecurring, exploreB2b | Read the recurring billing / B2B payments guide | internal | explore |
| signUp | Create an invoice, free | /app/sign-up | product |
| createInvoice | Create an invoice | /app/sign-up | product |
| api | See the API | /docs/api | product |

Placement

- Homepage hero: `signUp` primary with `event="hero_signup_click"` and `api` secondary (decision 0021). No CDG rung in the homepage hero.
- Hero of a CDG page: `compare` primary and `quote` secondary. Never `apply` in a hero.
- After the first pricing content (RateLockup group or CompareTable): `quote` primary, `fit` or `compare` secondary, inside a DecisionCard.
- End of review, hub, and comparison pages: VerdictBox with `quote` primary and `apply` secondary.
- End of other pages: DecisionCard with `quote` primary and `apply` as a quiet link.
- Header: `createInvoice` (decision 0021). It goes to `/app/sign-up`, whose heading and product paragraph sit above the form (#46); 0021 superseded 0001's navigation clause. The Invoices item carries the product page, so the button never repeats it. Footer: `quote` secondary and `apply` quiet.
- Articles: nothing clickable before the first pricing content except the disclosure link.
- One primary per section. Two buttons per group. Third action is `variant="quiet"`.

`position` values: `hero`, `after_pricing`, `inline`, `verdict`, `end`, `footer`, `nav`, `card`. They flow into the `affiliate_cta_click` event. Product rungs record the browser event named in `event`, from the allowlist in `src/lib/browser-events.ts`.

## 5. Voice

Four rules from the brand brief come first: state the number; state its source; admit uncertainty; never imply savings you cannot calculate. Never claim a competitor hides what it publishes.

- Second person, active verbs, sentence case. "You pay interchange at cost" not "Merchants are charged interchange".
- Short sentences. One idea each. No exclamation marks. No rhetorical questions as headings.
- Say what CDG publishes, say what we could not verify, say who a plan is not for. Readers trust a site that tells them when to leave.
- Name the next step honestly. A quote request ends in a phone call. Say so.
- No em dashes or en dashes anywhere, including code and commit messages. Use a comma, a colon, or a period.
- No arrows in link text. The link is the affordance.
- No all-caps labels. Use a Kicker in sentence case only when it carries information.

Banned in visitor-facing copy (the check script fails on these): "as CDG states", "as CDG publishes", "as CDG lists", "mid-funnel", "bottom-of-funnel", "hard convert", "soft CTA", "secondary hard", "R=470", "tracked link", "money page".

## 6. Attribution

- Every number traces to an entry in `src/lib/cdg.ts` or to a `sources` item in a post's frontmatter.
- Each section that shows numbers ends with one `SourceNote`. Inside the section, state the number plainly.
- Facts CDG does not publish are attributed to the third party by name ("Merchant Maverick reports a $25 chargeback fee").
- When CDG's own pages disagree, cite the more specific page and say there is a conflict.
- Never aggregate other sites' ratings into ours. Our score is ours; see `/methodology`.

Disclosure: the `Disclosure` component, directly under every h1. Outbound affiliate anchors carry `rel="noopener noreferrer sponsored"` (handled by `TrackedAffiliateLink`).

## 7. Posts

Frontmatter

```yaml
title: "CDG Commerce review 2026: pricing, fees, and who it fits"
description: "One or two sentences, plain, no colon-stacking."
date: "2026-09-16"
updated: "2026-09-17"
author: "alberto-vasquez"
tags: ["CDG Commerce", "review", "pricing"]
featured: true
bestFor: "U.S. merchants doing $10K to $200K a month"   # optional
rating:                                                  # optional, reviews only
  pricing: 4.5
  contract: 4.0
  support: 4.5
sources:
  - label: "CDG Commerce interchange plus pricing"
    href: "https://www.cdgcommerce.com/pricing/interchange-plus-processing/"
```

`overall` is computed as the mean of the three sub-scores unless given. Sources render at the end of the post.

Templates (section order; CTA positions in brackets)

Review, 2,000 to 3,000 words
1. Title, disclosure, RatingBadge with best-for
2. At a glance (FactRows)
3. Pros and cons
4. Who it is for
5. Pricing: CompareTable of plans, RateLockups for the plan most readers land on [DecisionCard, after_pricing]
6. Features
7. Contract and fees (third-party fees attributed)
8. Support
9. Reputation and complaints
10. VerdictBox [verdict]
11. AuthorCard, sources, related guides

Comparison "X vs Y", 1,800 to 2,500 words
1. Title, disclosure
2. Quick answer: choose X if / choose Y if
3. CompareTable: pricing, contract, hardware, support, best for
4. Pricing worked example at a stated monthly volume [DecisionCard, after_pricing]
5. Features that differ
6. Choose X if / choose Y if
7. VerdictBox [verdict]
8. FAQ

Pricing explainer, 1,500 to 2,500 words
1. Definition and how it works
2. Example transaction with real numbers
3. What a quote looks like
4. Versus the alternatives
5. Pitfalls and questions to ask
6. Which processors offer it, with CDG's published markup [DecisionCard, after_pricing]
7. Should you switch [DecisionCard, end]

Best for a vertical, 1,500 to 2,500 words
1. Quick answer
2. What the vertical needs from a processor
3. How CDG fits, with the rates that apply [DecisionCard, after_pricing]
4. Alternatives considered, honestly
5. VerdictBox [verdict]

Channel page (hub sub-pages)
1. Breadcrumb, Kicker with updated date, h1, one-paragraph summary, Disclosure
2. RateLockup group for that channel plus SourceNote
3. FactRows: what is included
4. Who it fits, who it does not (two lists)
5. DecisionCard [end] with quote primary and the matching explore rung secondary

## 8. Checklist before publishing

- `npm run check` passes.
- Disclosure under the h1.
- Every section with numbers ends with a SourceNote.
- No button label written by hand; every CTA is a `CtaButton`.
- No box that is not a DecisionCard or VerdictBox.
- Updated date present and true.
- Read it aloud once. Cut every sentence that hedges instead of informs.

## 9. Enforcement

`npm run style:check` scans `src/` and `content/` for banned phrases, em and en dashes, raw palette classes outside `ui/` (the shadcn folder uses the mapped variables, so it passes), `uppercase` with `tracking-`, and arrows. `npm run check` runs typecheck, lint, and the style check together. Run it before every commit.
