# North star

Owner: founder. Agents propose changes by PR and never merge them.

## Thesis

Small U.S. businesses that bill clients want two things at once: a simple way to send an invoice today, and, when card volume justifies it, a real merchant account with published interchange-plus pricing instead of a flat-rate aggregator. ClientBilling is the invoice tool that makes the first easy and the on-ramp that makes the second obvious.

Framing in one sentence: free invoice UX on top of a CDG Commerce Quantum merchant account. Unpaid invoices always work (link, email, PDF). Online card collection is opt-in and starts CDG's merchant approval or, later, connects an existing Quantum login.

## What we are building

1. An invoicing and billing product: create, send, track, chase, and record payment against invoices, for U.S. service businesses, contractors, agencies, and B2B sellers.
2. A merchant-account path: when a merchant wants to collect cards from the invoice page, we route them to CDG Commerce (affiliate agent R=470, appcode CLIENTBILLING). CDG underwrites, settles, and owns the card relationship. Quantum Gateway is the pay surface.
3. An editorial site that earns trust and search traffic on merchant accounts and fees, and feeds both of the above.

## The R=470 rule

Every link that leads to a CDG application, quote, or agent-attributed landing page carries the referral. The canonical URLs live in `src/lib/site.ts` and nowhere else. A page never hand-writes a CDG URL. A change that drops, rewrites, or adds a CDG destination is a stop-and-ask change (see `../agents/operating-manual.md`).

## What we will never become

| Never | Why | Instead |
| --- | --- | --- |
| Merchant of record or payment facilitator | It would make us the party to every dispute and every regulator, and it is not the business. | The merchant's own CDG merchant account. |
| A handler of card data, even in transit | PCI scope, breach liability, and it is unnecessary with a hosted pay page. | Quantum hosted checkout or iframe; card fields never render on our origin. |
| A holder or mover of funds | Money transmission rules, float risk, and trust we have not earned. | Funds settle from CDG to the merchant's bank. We record, we never touch. |
| A lender, factor, or cash-advance provider | Different business, different regulator. | Nothing. Decline. |
| An accounting suite, payroll, or tax filer | Someone else's core. | Exports and integrations. |
| A multi-processor marketplace | The single-partner economics and the honesty of the reviews depend on one clear recommendation. | One partner, revisited by decision record, not by drift. |
| A Stripe wrapper | Stripe is what our target merchant is leaving. | Interchange-plus through CDG. |

## How the two halves reinforce each other

Invoices create payer demand for card payment. That demand is the trigger for a merchant to want a merchant account. The merchant account makes the invoice tool worth using forever, and the referral pays for the free tool. Every feature is judged by whether it strengthens that loop without crossing the boundary.
