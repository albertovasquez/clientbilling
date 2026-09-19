# 0023: The homepage's CDG numbers are derived from the rates module, even where the approved proof drew a different figure

Status: Accepted 2026-09-19 by the founder. Reads with 0021 (product rule) and 0007.

On remit, so a future reader does not mistake this for a breached trigger: `docs/agents/operating-manual.md` item 2 makes *a claim about CDG's fees* a stop-and-ask. Applying a rate that `src/lib/cdg.ts` already carries, with its source and checked date, to a volume stated on the page is not a new claim about CDG's fees, and was within remit to build. What needed the founder was the departure from an approved artboard, which is what this record is. It shipped as Proposed with the derived figures and was accepted without amendment to the page.

## Context

The approved homepage artboard (`docs/brand/proofs/Main.dc.html`) shows a Payments section built around an example account: $24,180 of monthly volume, 41% of it on cards, and the sentence "the markup on last quarter's card payments would have been about $85 a month". Ticket #45 also says "Every CDG number comes from the rates module".

Those two instructions disagree. CDG's published interchange-plus online rate is 0.35% + $0.15 above interchange (`src/lib/cdg.ts`, checked 2026-09-17). Applied to 41% of $24,180, which is $9,913.80 of card volume, the percentage part is $34.70. Reaching $85 would need roughly 335 card payments in the month, which is not a figure the proof states or that the example implies: a business billing $9,913.80 across invoices the size of the hero's $2,500 example makes about four of them.

The proof drew a plausible-looking number rather than computing one. Its own script only ever calculated the hero invoice; the $85 is static text in the artboard.

## Decision

- Where the proof and the rates module disagree on a number, the rates module wins and the proof is treated as a visual reference for the number's placement and framing, not for its value. Where they disagree on layout, wording, or emphasis, the proof still wins: that is spec #41's rule ("where the proof and the primitives disagree on a detail, the proof wins"), and this record narrows it to exclude figures. No mission file states a precedence; #41 is the only place the rule is written down.
- The homepage's example account lives in `src/lib/payments-example.ts`. The volume and the payment mix are illustration, flagged `illustrative` and labelled on the page as an example account. The band, the markup formula, and the dollar markup are derived through the calculator from `cdgOnlineSnapshots()`, so a rate edit in `src/lib/cdg.ts` is the only edit a rate change needs.
- Every input a derived figure depends on is either published or visible on the page. Where an input would have to be invented to produce a tidier number, the figure is split instead of estimated. `scripts/test-payments-example.ts` guards against the shortcut by asserting that no `markupCents` and no `cardPaymentsPerMonth` exist. That is a guard, not a proof: a differently named total would pass it, and the reviewer's eye is the real control.
- The page shows the two parts of the markup separately: the percentage part, $34.70 a month, which the card volume alone determines, and the published $0.15 per payment, named as a per-payment fee. It does not show a single monthly total, because totalling the fixed part needs a count of card payments that the example does not have and that we will not invent. The artboard's $85 appears nowhere.
- The same rule covers the OG image: its cost table reads from the calculator rather than repeating figures, so a share card cannot drift from the page it advertises.

## Reasons

- `docs/mission/product-principles.md` rule 4 and `docs/mission/affiliate-cdg.md` both forbid inventing a statistic. An $85 we cannot derive from a published rate is invented, whatever its provenance inside our own design file.
- Decision 0021's product rule is that nothing is estimated silently. A number chosen to look right is the silent estimate that rule exists to prevent.
- The markup is the honest quantity to show here. Interchange itself varies by card and is not knowable in advance, which is why the sentence beside the figure says so rather than presenting a total cost.
- A derived figure that moves when a rate moves is also the cheaper thing to maintain: the alternative is a number in an artboard, a number in a page, and a checked date that outruns both.

## Consequences

- The Payments section reads with a smaller, less dramatic figure than the artboard suggested, and with two numbers where the artboard had one. That is the honest result and it is not a problem to be solved by tuning. The example account's volume and mix change only for a reason independent of the markup they produce, and the reason is recorded here when they do. Raising the volume because $34.70 feels small would move the invention from the output to the input, which is the same fault wearing a different hat.
- The proofs in `docs/brand/proofs/` are no longer the source of truth for any figure. A future ticket that copies a number out of an artboard is doing the thing this record forbids.

## Revisit when

CDG publishes a different interchange-plus rate, or epic #32 replaces the example account with the merchant's own volume and rates, at which point the illustration goes away and the question does not arise.

## Adjudicated 2026-09-19

Reviewed against the mission files before acceptance. Three findings changed the
text above: the precedence rule was mis-cited to `docs/mission/README.md`, which
states no such rule; the test's guarantee was overstated; and the Consequences
section advised raising the example volume to reach a bigger number, which is
the relocation this record exists to forbid. The derivation itself was confirmed
against `src/lib/cdg.ts`: $9,913.80 at 0.35% is $34.70.

Two alternatives were considered and rejected. A single "about $35 a month"
folds the published $0.15 into a rounding it cannot justify, and on small-ticket
invoices the fixed part can exceed the percentage part, so the split stays.
Raising the illustrative volume to reach the artboard's $85 would need roughly
$240K of monthly card volume or ~335 card payments at ~$30 each, which
contradicts the hero's $2,500 example invoice and re-opens approved artboard
content.
