# 0024: U.S.-first. Colombia and Brazil deferred behind demand triggers. FX becomes a first-class object, and 0014 reopens for CDG economics only

Status: Accepted 2026-09-19 by the founder. Answers `../strategy/2026-09-19-research-colombia-brazil-beachhead.md`. Keeps 0003 and `../mission/north-star.md` intact. Reopens 0014 narrowly, as 0021 allowed.

## Context

A research report of 2026-09-19 recommends launching Colombia as a positioning beachhead and Brazil as the scale market immediately behind it, on the strength of a real market and real timing: Brazil's national NFS-e becomes mandatory for Simples Nacional micro and small businesses on 2026-11-01, Pix is already the dominant everyday rail, Bre-B is rolling out in Colombia, and Colombian service exports are growing. The report is filed as strategy, not policy.

The recommendation is not an expansion of the current product. It is a different initial market with a materially different product: different customer size, different payment rails, fiscal-document requirements in two jurisdictions, localization, a different support burden, and local acquiring partners in place of the single-partner model. Calling it "international expansion" would obscure that. It would supersede 0003, amend the north star's single-partner clause, and push ClientBilling partly into fiscal compliance.

Nothing about the report is wrong. The question is whether evidence justifies changing the company, or whether research momentum would be changing it for us.

## Decision

- **ClientBilling remains U.S.-first.** 0003 stands: U.S. service businesses, contractors, agencies, and B2B sellers that invoice and process, or expect to process, $10,000 a month or more. `../mission/north-star.md` is unchanged.
- **Colombia and Brazil are a researched expansion hypothesis, not a roadmap commitment.** Deferred, not rejected. Until a revisit trigger below fires: no epics, no milestones, no fiscal-adapter tickets, no DIAN or NFS-e work, no Asaas, Bold, or Wompi contact, and no wayfinding map against the report. An agent that finds itself specifying any of that has misread this record.
- **The LatAm research does not touch 0021's positioning or the Carbon Copy identity.** The report's own corrected claim about competitors' published rates is already 0021's position and is already enforced by `scripts/style-check.mjs`.
- **FX becomes a first-class object in the core model, independent of geography.** A U.S. merchant billing a foreign client has the payment-awareness problem in a currency the model cannot represent today, so this belongs to epic #32 and not to a LatAm box. The requirements are in the next section.
- **0014 reopens for CDG economics only.** Five questions, listed below. No API discussion, no feature request, no integration commitment, implied or otherwise. 0014's substance stands: no integration with CDG or Quantum, merchants paste their own pay link, `COLLECT_ONLINE` stays off. 0021 already named this reopening as permitted, limited to attribution mechanics, attribution duration, residual versus bounty, and termination and tail provisions.
- **Until CDG answers in writing, recurring CDG economics stay modelled at $0.** 0022 is unchanged by the act of asking.

## What FX as a first-class object requires

The model must represent a payment end to end, for example an invoice of USD 2,500 received as EUR 2,500 at 0.8462, with $31.40 of conversion cost and $8.00 of rail cost, settling at $2,460.60 equivalent.

- **Estimated and realized economics are different things and must not share a field.** What the merchant was shown before the payment (from a rate snapshot, per 0021's product rule) and what actually happened after reconciliation are separate records, and the difference between them is a number the merchant is entitled to see.
- First-class fields, not strings hung off a payment: invoice currency, settlement currency, conversion rate, the rate's source and the time it was quoted, explicit fees, inferred spread where it is defensible to infer one, and net proceeds.
- An inferred spread is labelled as inferred, with its basis. Where it cannot be inferred defensibly, the model says the cost is not known rather than estimating it, which is 0021's product rule applied to FX.
- This extends `src/lib/payment-costs.ts` and the epic #32 invoice work. It does not require a payment integration: a merchant who reconciles by hand still benefits from the record distinguishing what they expected from what they kept.

## The CDG inquiry

Five questions, and nothing else:

1. Is compensation a one-time bounty, an ongoing residual, or both?
2. If residual, what is the precise basis: processing volume, markup, net processing revenue, gateway revenue, or another measure?
3. How long are residuals paid while a referred merchant remains active?
4. What happens if the partner agreement ends, and is there a contractual tail?
5. How is a merchant attributed to us, and does that attribution and any residual survive the merchant changing pricing plan or product?

`../mission/affiliate-cdg.md`'s diligence table is where the answers land, and the founder owns that file's terms rows. The questions about integration permission and the preferred Quantum pay method stay closed, per 0014.

## Revisit when

Demonstrated demand, not a date. Research that ages is better than a roadmap built on a hypothesis.

- **Primary trigger:** repeated qualified demand from a single country, sufficient to justify maintaining a country-specific fiscal adapter as an ongoing obligation. "Qualified" means merchants who match the product's economics, not sign-ups. One-off interest is not a trigger; a pattern is.
- **Second trigger:** a fiscal or payment partner approaching us with distribution or economics unusually favourable enough to change the arithmetic on its own.
- **Also revisit** if CDG's answers make U.S. monetization materially worse than 0022 assumes, since the case for a second market rests partly on the first one's economics.

When a trigger fires, the entry point is a founder decision superseding 0003, then wayfinding, then a spec. Not a ticket.

## Reasons

- The immediate path is small and already sequenced: Carbon Copy and 0021's positioning, then the payment-aware event and reconciliation model, then FX, then the CDG economics answer. Then ship and learn. Adding two countries to that list would not accelerate it.
- Fiscal adapters are an ongoing obligation, not a build. Both governments change their schemas, and Brazil's is changing right now. Taking one on before there is demand to carry it is how a small product acquires a maintenance burden it cannot retire.
- The CDG question is different in kind from the LatAm question: it resolves an uncertainty in the strategy we already have, rather than proposing a new one. It is cheap, it is one email, and the answer changes the financial model either way.
- FX earns its place on the U.S. product alone. Promoting it out of the LatAm report is what keeps the report from being the reason we build it.
- The report supplies a useful architectural test, which this decision keeps: if the billing record is country-neutral enough that FX, Pix, Bre-B, cards, ACH, stablecoins, and fiscal documents could eventually attach to it, the core is right. Holding epics #32 and #33 to that standard captures most of the report's value at no cost, and none of it requires building an adapter now.
- Deferring with a written trigger is not the same as forgetting. The failure this record guards against is a research document quietly becoming policy, or quietly becoming archaeology.

## Consequences

- `docs/research/deep-research-report.md` moved to `../strategy/2026-09-19-research-colombia-brazil-beachhead.md` with an editor's note, so its status is legible without reading this record.
- Epic #32 gains the FX requirements above. The estimated-versus-realized distinction is a schema decision and wants its own record when #32 is specified.
- A CDG inquiry goes out. `../mission/affiliate-cdg.md` is updated when there is an answer, and 0022's $0 assumption holds until then.
- 0003's target-merchant definition is now load-bearing for a decision it did not anticipate. It stays as written; this record is what points at it.
