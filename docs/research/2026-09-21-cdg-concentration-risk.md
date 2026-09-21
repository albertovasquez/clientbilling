# CDG concentration: what breaks if the relationship ends

Written 2026-09-21, prompted by the founder asking what happens if CDG stops responding. Input to a decision, not a decision.

## The question

CDG has not replied to the economics inquiry sent 2026-09-19 (issue #58). Two days is not a non-response and nothing is concluded from it here. But the question it raised is worth answering on its own: if the CDG relationship ended tomorrow, by silence, termination, or the partner simply going away, what would break?

## What does not break

**Nothing in the product.** CDG appears in the codebase as outbound URLs and published numbers. There is no API call, no webhook, no SDK, no shared session, no runtime dependency of any kind. Decision 0014 kept it that way and `COLLECT_ONLINE` stays off. Invoicing, PDFs, public pages, recurring, reminders, payments, the REST API, and MCP would all run unchanged.

**Nothing in the revenue model.** Decision 0022 models recurring CDG revenue at $0 until written terms exist, and describes CDG as "upside on top of the Machine tier, not the base". Its stated reason is precisely this scenario: "A business whose only recurring revenue is a contract it does not control is not a durable business." Losing CDG removes upside that was never counted.

**Nothing in the compliance posture.** ClientBilling is not the merchant of record, holds no card data, and moves no funds. Ending an affiliate relationship does not touch any of that.

## What does break

The exposure is editorial, and it is larger than the revenue exposure.

| Surface | Count | Share |
| --- | --- | --- |
| Blog posts with CDG in the title | 5 | 5 of 13 posts |
| Dedicated `/cdgcommerce/*` routes | 6 | all sitemap-listed |
| Source files referencing CDG | 47 | mostly links and disclosures |

Five of thirteen posts and six routes are built on a single processor. Three consequences follow.

**Traffic concentration.** A large share of the organic surface targets one partner's brand terms. If the relationship ends, those pages still rank and still help readers, but they stop earning anything and they advertise a company ClientBilling no longer has a relationship with.

**Attribution risk that is invisible.** Every CDG link carries `R=470`. If CDG changed or retired that agent id without telling us, the links keep working and keep sending merchants, and nothing in the site would show that attribution had stopped. There is no callback confirming a referral was credited. The only present check is that the quote form posts a hidden `R=470` field, confirmed by inspection 2026-09-18.

**Numbers with a checked date.** `src/lib/cdg.ts` carries `CDG_CHECKED = "2026-09-17"`. Every published CDG figure traces to a source URL checked on that date. If CDG changes its pricing and nobody rechecks, the site publishes stale numbers about a company that may not answer questions about them. The mission file requires the source note; it does not require the date to be recent.

## What the architecture already allows

The cost engine is not CDG-shaped. `src/lib/payment-costs.ts` takes generic `RateSnapshot` values, each carrying a `RateSource` with `name`, `href`, and `checkedAt`. `cdgOnlineSnapshots()` is one adapter feeding a processor-neutral calculator, not a special case inside it.

This matters: broadening to several processors is mostly adding rate data and content, not refactoring. Epic #32 already builds the versioned rate-source registry that would hold them, so the work lands in a place the roadmap was going anyway.

## Options

**Broaden to multi-processor.** Keep the CDG posts, which are real sourced comparisons that rank on their own merit, and add rate data and comparison content for other processors so no single partner is load-bearing for traffic. Removes the dependency structurally rather than by hoping. Costs content work; fits epic #32's registry.

**Freshness guard.** Make a stale `checkedAt` visible, in the style check or a script, so published numbers cannot drift silently. Cheap, and worth doing whatever else is decided.

**Wind CDG down.** Remove affiliate links, keep the posts as neutral reviews. Loses bounty upside for a relationship that may still be fine. Premature on two days of silence.

## Recommendation

Broaden, and add the freshness guard. Both are justified by decision 0022's own reasoning regardless of what CDG says, because the point of that decision was that a partner ClientBilling does not control should not be load-bearing. Right now CDG is not load-bearing for revenue, which 0022 fixed, but it is still load-bearing for traffic, which nothing has fixed yet.

Do not wind CDG down on this evidence. Two days is a slow reply, not a dead relationship. `docs/mission/affiliate-cdg.md` now records when silence should be treated as an answer.

## What would change this assessment

- A reply from CDG that establishes residual terms in writing. Then the relationship has recurring economics and concentration is a smaller worry, though still a worry.
- Evidence that `R=470` attribution has stopped working. That would move this from concentration risk to an active problem.
- Real traffic data showing the CDG pages carry a different share of visits than they do of page count. The table above counts pages, not visitors, because there is no traffic yet to count.
