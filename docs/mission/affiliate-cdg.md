# CDG Commerce: the affiliate relationship

Owner: founder for terms, residuals, and permitted claims. Agents may update link inventories and check dates.

## Status of diligence (update this table, not prose elsewhere)

| Question | Status | Evidence |
| --- | --- | --- |
| Does R=470 attribute the quote form submission to agent 470? | Confirmed by inspection 2026-09-18: the form at `applynow/?R=470` posts a hidden `R=470` field. | Session research, `docs/decisions/0002` context. |
| Do residuals apply when a referred merchant later processes through Quantum from our invoice UI? | Open. Asked in the one-pager. | `docs/partners/cdg-clientbilling-quantum-one-pager.md` question 1. |
| Is an invoice-app integration permitted under the agent agreement? | Open. Question 2. | Same. |
| Preferred Quantum pay method for third-party invoices (Interactive, Web Order Form, ILF)? | Open. Question 3. | Same. |
| Branding or claim restrictions from CDG? | None found published as of 2026-09-17. Asked as question 4. | Research report, `docs/research/2026-09-17-traffic-gap-report.md`. |
| Sandbox credentials contact? | Open. Question 5. | Same. |

Per decision 0014 (2026-09-18), these questions are not being asked. There is no integration with CDG or Quantum, no residual is claimed, and merchants paste their own pay link. `COLLECT_ONLINE` stays off.

## Allowed destinations

All CDG URLs live in `src/lib/site.ts` and are reached through the CTA ladder in `src/lib/cta.ts`. The rungs and their audiences:

| Rung | Destination | Where it may appear | Where it may not |
| --- | --- | --- | --- |
| quote | CDG quote form, `applynow/?R=470` | Marketing pages, app collect panel, settings | Public invoice pages, emails to payers |
| apply | CDG secure application, `agentid=470` | Same as quote, always secondary to quote | Same |
| explore* | CDG agent-attributed solution pages | Marketing pages, get-started | App, public invoices, emails |

Payers are never an audience for CDG links. Merchants are.

## How CDG is described

- Numbers come only from `src/lib/cdg.ts`, each with a source URL and a checked date. A page that shows a CDG number ends the section with a source note.
- Fees CDG does not publish are attributed to the third party that reports them, by name.
- We never invent a statistic, a savings promise, or a residual figure. The fee calculator is labeled illustrative and says it is not a quote.
- Every page with a CDG link carries the disclosure component under its title. Outbound affiliate anchors carry `rel="sponsored"`.
- The editorial score for CDG is ours, set by the method on `/methodology`, and is not influenced by the commission. It can go down.

## What the relationship does not permit us to do

- Present ClientBilling as CDG, as a processor, or as the party the merchant contracts with.
- Commission our own processing account through the referral.
- Collect application data on our forms on CDG's behalf.
- Promise approval, rates, or timelines.

## When this file must be updated

Any answer from CDG, any change to a CDG URL, any new rung or new placement in the table above, and any change to how CDG is scored or described. The PR cites this file and `north-star.md`. Rungs of type `product` in `cta.ts` carry no CDG URL and are outside this file.
