# ClientBilling traffic and conversion gap report

Date: 2026-09-17
Scope: what clientbilling.com is missing to drive qualified traffic to CDG Commerce and convert it. Based on a repo audit, screenshots of the rendered site, CDG Commerce's own pages, a teardown of five merchant-services review sites, and Google's current documentation.

## Summary

The site has the right funnel shape (guides, a hub, channel pages, soft-then-hard CTAs, click tracking) but four things hold it back:

1. The quote CTA sends people to the wrong place. Every "Get a Free CDG Quote" button opens CDG's secure online application. CDG's real quote form is `/applynow/?R=470` (name, email, phone, business type). A quote request is a much smaller ask than a merchant application, and it is the step CDG itself uses.
2. Internal funnel language leaks into visitor-facing copy ("mid-funnel", "secondary hard convert", "R=470 landings", "bottom-of-funnel"), and "as CDG states" appears 28 times. Together they read as a disclaimer wall, not credibility.
3. There is no trust scaffolding of the kind every ranking review site has: no rating, no verdict box, no methodology page, no named author, no visible "updated" dates.
4. Nothing measures the funnel. Click tracking logs to the console and a dataLayer that nothing reads.

Everything below is ordered by expected payoff for effort.

## 1. Fix the funnel destination and pre-framing

| Finding | Evidence | Action |
| --- | --- | --- |
| Quote clicks go to the full application | `siteConfig.affiliateSignupUrl` is `secure.cdgcommerce.com/onlineapp/...` and is the default for `TrackedAffiliateLink`. CDG's own Sign Up links on the R=470 landings go to `https://www.cdgcommerce.com/applynow/?R=470`, a quote form. | Add a separate `quoteUrl` (applynow with R=470 and UTMs). Route all quote-labelled CTAs there. Keep the secure app for "Start an application" only. Verify with CDG that applynow attributes R=470 to agent 470. |
| Landing pages have no form above the fold | `my_landing/?R=470&type=internet` renders the Payment Gateways page; retail renders POS; wireless renders Mobile Payments. No volume question, no hero form. | Do the pre-qualification on our side: business type and monthly volume, then link to the matching CDG pricing page with R=470 or to the quote form. Set the expectation that the next step is a quote form and a phone call, not self-serve signup. |
| Volume bands do not match CDG | Homepage uses under $10K, $10K-25K, $25K-200K, $200K+. CDG's pricing pages use $1K-10K (Flat Rate), $10K-200K (Interchange Plus), $200K+ (Wholesale). The $25K split is ours. | Use CDG's three bands and name the plan each band maps to. |
| Business type labels do not match CDG's form | CDG's quote form offers Retail/Service, Restaurant, E-Commerce, B2B/Industrial, Non-Profit, Specialty/Other. Our chips are Online, Retail, Mobile, Recurring, B2B. | Use CDG's six labels on the chooser so people are not re-asked with different buckets. |

## 2. Copy and credibility

| Finding | Evidence | Action |
| --- | --- | --- |
| Internal jargon in visitor copy | `get-started/page.tsx:54-56, 94`, `page.tsx:229`, `recurring-billing/page.tsx:78`, `b2b/page.tsx:121`, `about/page.tsx:75`, `affiliate-disclosure/page.tsx:38` | Remove. The style guide bans these words in `src/app` and `src/components`. |
| "as CDG states" repeated 28 times | grep across `src` and `content` | Attribute once per section with a source line ("Source: CDG Commerce pricing page, checked Sep 2026") and link the source. |
| No rating, no verdict | Merchant Maverick, NerdWallet, Forbes Advisor, Fit Small Business all lead with a numeric score, a "Best for" tag, and end with a verdict box. Google's review guidance asks for quantitative measurements and comparisons. | Add an editorial score with three sub-scores (pricing transparency, contract, support), a "Best for" line, and a verdict box on the review post, the hub page, and comparison posts. |
| No methodology page | Every ranking competitor links "How we rate". | Add `/methodology` explaining the sub-scores, the data sources, and how compensation is separated from ratings. |
| Organization byline only | Google's Article guidance "strongly recommends" an author `url` or `sameAs` to a person page. | Add an author page and a `Person` author. This needs a named person and a short bio; decision for the owner. |
| No "updated" dates | Competitors show "Updated Jul 20, 2026" or "Audited and verified Mar 2, 2026". | Add `updated` to post frontmatter, show it under the title, and feed it to `dateModified` and the sitemap. |
| Disclosure is fine but inconsistent | Four different disclosure sentences across pages. | One sentence, one component, always directly under the title. |

## 3. Technical SEO

| Item | Status | Action |
| --- | --- | --- |
| Per-post OG image | Done 2026-09-17: `app/blog/[slug]/opengraph-image.tsx` renders title, score if any, byline, and site mark. | None. |
| Organization JSON-LD | Missing | Add to the root layout with `logo`, `url`, `sameAs`. |
| BreadcrumbList JSON-LD | Missing (visual breadcrumb exists on posts) | Add on posts and channel pages. |
| Article JSON-LD | Present, org author only, no `dateModified` | Add `dateModified` and an author URL. |
| FAQPage JSON-LD | Not present, and no longer useful | Do not add. Google removed the FAQ rich result on 2026-05-07. Keep FAQs as visible content. |
| Review JSON-LD | Missing | Optional. A single editorial `Review` nested in a `Product` is eligible; an `AggregateRating` from one author is not. Only add once the score is real and disclosed. |
| Sitemap lastmod | Static routes use `new Date()` at build time | Use real dates: `updated` for posts, a manual date for static pages. |
| `rel="sponsored"` | Present on tracked links | Keep. Google's site-reputation FAQ says properly marked affiliate links are fine. |
| Core Web Vitals | Not measured | Thresholds unchanged (LCP 2.5s, INP 200ms, CLS 0.1). Check once analytics is in. |

## 4. Measurement

The current instrumentation only logs to the console and pushes to `window.dataLayer`, and no tag manager is loaded. Recommended lean stack:

- Google Search Console for queries and impressions.
- An analytics tool for pageviews and outbound clicks. The owner declined Plausible on 2026-09-17. The site emits `affiliate_cta_click` as a DOM event and a `window.dataLayer` push, so Google Tag Manager, GA4, or a self-hosted Umami can be wired in later without page changes.
- Append a `ref=<slug>-<position>` parameter to outbound CDG URLs so CDG's agent reporting can be matched back to pages.
- Scroll depth at 50% and 90% on posts.

GA4 is only worth adding if multi-touch attribution is needed later.

## 5. Content roadmap

Highest-intent page types in this niche, in rough order of conversion, and where the site stands:

| Page type | Have | Add first |
| --- | --- | --- |
| "CDG Commerce review" with score and verdict | A review post without score | Upgrade the existing post to the review template |
| "CDG Commerce vs X" | vs Stripe only | vs Square, vs Helcim, vs Stax, vs PayPal (the brands people search) |
| "Best merchant account for [vertical]" | None | Restaurants, ecommerce, nonprofits (CDG publishes a nonprofit rate), B2B |
| "CDG Commerce pricing / fees" | Have | Add a full fee schedule page (chargeback, retrieval, batch, Amex, ACH), attributed to Merchant Maverick where CDG does not publish it |
| Fee calculator | None | Effective-rate estimator using CDG's published markups across the three plans. CDG has no calculator; this would be unique |
| "X alternatives" | None | "Square alternatives", "Stripe alternatives" with CDG as one honest answer |
| Wholesale membership explained | None | CDG's "Our Cost +" tiers ($49 to $199 per month, billed annually, volume caps) are unexplained on CDG's own site |

Article structure, word counts, and CTA positions for each template are in the style guide.

## 6. Off-page levers, ranked

1. Competitor "vs" and alternatives pages. Low effort, highest payoff. Google's review guidance rewards comparisons; be honest where the competitor wins.
2. YouTube Shorts explainers embedded in the matching post. Medium effort. YouTube is the most-cited domain in AI Overviews (Ahrefs, Feb 2026) and gets cited even when the page does not rank.
3. Reddit answers in r/smallbusiness and r/ecommerce as a person, with affiliation disclosed. Medium effort, high variance.
4. Digital PR with original data (a fee benchmark across processors). High effort; only original data earns links.

## 7. CDG facts to reuse, with sources

Published by CDG (cite the URL next to the number):

- Flat Rate, $1K-10K/mo: swipe and mobile 2.90% + $0.30; online 3.50% + $0.30; $9.95/mo; keyed surcharge 0.60%; mobile reader $99. https://www.cdgcommerce.com/pricing/flat-rate-processing/
- Interchange Plus, $10K-200K/mo: online IC + 0.35% + $0.15; retail IC + 0.30% + $0.10; nonprofit IC + 0.25% + $0.10; free Quantum or Authorize.Net gateway with no per-transaction gateway fee. https://www.cdgcommerce.com/pricing/interchange-plus-processing/
- Wholesale Membership, $200K+/mo: cost + $0.15 (Basic, $49/mo), $0.12 (Standard, $79), $0.09 (Plus, $99), $0.06 (Premium, $199), billed annually, with monthly volume caps. https://www.cdgcommerce.com/pricing/wholesale-subscription-processing/
- Terminal placement $79/year, no purchase required (IC+ and Wholesale pages).
- Founded 1998; BBB A+, accredited since 2020. https://www.cdgcommerce.com/about/ and the BBB profile.
- Registered ISO/MSP of Synovus Bank and Citizens Bank N.A. (site footer).
- Known inconsistency: the applynow page says flat rate has no fixed monthly fee, the flat-rate page lists $9.95/mo. Cite the flat-rate page.

Published only by third parties (attribute to them, not to CDG):

- Month-to-month, no early termination fee, chargeback $25, retrieval $15, batch $0.10, Amex surcharge 0.25%, ACH 0.75% + $0.15. Merchant Maverick, https://www.merchantmaverick.com/reviews/cdgcommerce-review/

Not verified: any published CDG rule on affiliate logo use, claims, or disclosure. None was found. Keep the FTC disclosure and attribute every number.

## Sources

- Google reviews system: https://developers.google.com/search/docs/appearance/reviews-system
- Google, writing high quality reviews: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
- Google Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google review snippet rules: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Google site reputation abuse: https://developers.google.com/search/blog/2024/11/site-reputation-abuse
- Ahrefs AI Overview citations study: https://ahrefs.com/blog/ai-overview-citations-top-10/
- Merchant Maverick CDG review: https://www.merchantmaverick.com/reviews/cdgcommerce-review/
- NerdWallet payment processing: https://www.nerdwallet.com/best/small-business/payment-processing-companies
- Fit Small Business merchant services: https://fitsmallbusiness.com/best-merchant-services/
- Lucrative Merchants (single-processor peer): https://lucrativemerchants.com/blog/interchange-plus-vs-flat-rate-pricing-2026/
- CDG pricing: https://www.cdgcommerce.com/pricing/
- CDG reseller signup: https://myapp.cdgcommerce.com/partner-signup.php
