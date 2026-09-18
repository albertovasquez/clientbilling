# Keyword to page map

Date: 2026-09-18
Owner checklist (cannot be done from this repo): verify Google Search Console on **https://www.clientbilling.com** (www host), submit `sitemap.xml`, confirm property ownership in the owner's Google account.

Intent labels: `review` | `compare` | `pricing` | `vertical` | `education` | `tool`
Priority: **P0** ship or already live and keep fresh | **P1** next | **P2** backlog

URLs are site-relative. Planned pages are marked `planned`.

## P0: CDG core queries

| Query cluster | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| CDG Commerce review, CDG review 2026, CDG Commerce fees | review | P0 | `/blog/cdg-commerce-review-2026-pricing-fees-features` | Live |
| CDG Commerce pricing, CDG fees explained | pricing | P0 | `/blog/cdg-commerce-pricing-explained` | Live |
| CDG interchange plus, CDG wholesale membership explained | pricing | P0 | `/blog/cdg-commerce-pricing-explained` (wholesale section); dedicated wholesale explainer | Partial; wholesale deep-dive planned |
| CDG Commerce hub, CDG merchant account | review | P0 | `/cdgcommerce` | Live |
| Get CDG quote / apply | pricing | P0 | `/get-started`, CTA ladder to quote then apply | Live |

## P0 / P1: comparisons

| Query cluster | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| CDG Commerce vs Square, Square vs CDG | compare | P0 | `/blog/cdg-commerce-vs-square` | Live |
| CDG Commerce vs Stripe, Stripe vs CDG | compare | P0 | `/blog/cdg-commerce-vs-stripe-for-growing-businesses` | Live (upgrade depth when capacity allows) |
| CDG Commerce vs Helcim, Helcim vs CDG | compare | P0 | `/blog/cdg-commerce-vs-helcim` | Live 2026-09-18 |
| CDG Commerce vs Stax, Stax vs CDG | compare | P1 | `/blog/cdg-commerce-vs-stax` | Planned |
| CDG Commerce vs PayPal, PayPal vs CDG | compare | P1 | `/blog/cdg-commerce-vs-paypal` | Planned |
| Square alternatives, alternatives to Square | compare | P1 | `/blog/square-alternatives` | Planned |
| Stripe alternatives, alternatives to Stripe | compare | P1 | `/blog/stripe-alternatives` | Planned |

## P0 / P1: verticals

| Query cluster | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| Best merchant account for ecommerce, ecommerce merchant account | vertical | P0 | `/blog/best-merchant-account-for-ecommerce` | Live 2026-09-18 |
| Best merchant account for restaurants, restaurant credit card processing | vertical | P1 | `/blog/best-merchant-account-for-restaurants` | Planned |
| Best merchant account for nonprofits, nonprofit payment processing | vertical | P1 | `/blog/best-merchant-account-for-nonprofits` | Planned (CDG publishes nonprofit markup) |
| Best merchant account for B2B, B2B payment processing | vertical | P1 | `/blog/best-merchant-account-for-b2b` | Planned; support with `/cdgcommerce/b2b` |
| Best payment processor for recurring billing | vertical | P1 | `/blog/best-payment-processor-for-recurring-billing` | Live (lighter guide) |

## P1: tools and fee depth

| Query cluster | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| Credit card processing fee calculator, interchange plus calculator | tool | P1 | `/tools/fee-calculator` | Planned |
| CDG chargeback fee, CDG ACH fee, full fee schedule | pricing | P1 | `/blog/cdg-commerce-fees-schedule` or hub section | Planned; attribute Merchant Maverick where CDG does not publish |
| Wholesale membership explained ($49 to $199) | pricing | P1 | `/blog/cdg-wholesale-membership-explained` | Planned |

## P2: education (existing, keep, do not prioritize new)

| Query cluster | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| Interchange plus vs flat rate | education | P2 | `/blog/interchange-plus-vs-flat-rate-payment-processing` | Live |
| Choosing billing software for B2B SaaS | education | P2 | `/blog/choosing-billing-software-for-b2b-saas` | Live |
| Dunning without damaging trust | education | P2 | `/blog/dunning-without-damaging-trust` | Live |
| Invoice clarity reduces late payments | education | P2 | `/blog/invoice-clarity-reduces-late-payments` | Live |
| Subscription billing metrics | education | P2 | `/blog/subscription-billing-metrics-that-matter` | Live |
| Usage-based billing pitfalls | education | P2 | `/blog/usage-based-billing-pitfalls` | Live |

## Channel and trust pages (supporting)

| Query / need | Intent | Priority | URL | Status |
| --- | --- | --- | --- | --- |
| CDG online payments | pricing | P0 | `/cdgcommerce/online-payments` | Live |
| CDG retail / POS | pricing | P0 | `/cdgcommerce/retail` | Live |
| CDG wireless / mobile | pricing | P0 | `/cdgcommerce/wireless` | Live |
| CDG recurring billing | pricing | P0 | `/cdgcommerce/recurring-billing` | Live |
| How we rate | review | P0 | `/methodology` | Live |
| Author | review | P0 | `/authors/alberto-vasquez` | Live |

## Suggested build order after this ship

1. Fee calculator (unique vs CDG's own site)
2. Best merchant account for restaurants
3. CDG vs Stax
4. Square alternatives (honest list with CDG as one option)
5. Nonprofit vertical (published CDG nonprofit rate is a differentiator)
6. Wholesale membership explainer
7. Stripe alternatives, vs PayPal, B2B vertical

## Notes

- Do not invent CDG fees. Cite CDG pricing pages or Merchant Maverick as in `docs/research/2026-09-17-traffic-gap-report.md` section 7.
- Comparison and vertical posts use the templates in `docs/STYLE_GUIDE.md`. CTA ladder stays quote then apply; never rewrite quote/apply URLs in `src/lib/cta.ts`.
- New markdown under `content/blog/` is picked up by `getAllPosts()` and appears in `/sitemap.xml` automatically.
