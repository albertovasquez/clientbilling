# ClientBilling: free invoice → CDG collect strategy

Date: 2026-09-18  
Related: `2026-09-18-business-case.md`

## Verdict

Architecturally feasible as light SaaS + CDG residual. Market is crowded (Wave, Square, PayPal). Win only with niche (true MID / IC+) or proof users will wait for underwriting. Prefer **Level B** (ClientBilling invoices + Quantum hosted pay after CDG) over MoR. Fake-door / concierge before building.

## Competitor pattern (VERIFIED)

| Player | Free invoices? | Collect how? |
| --- | --- | --- |
| Wave | Yes (Starter) | Separate payments application; Wave payfac fees |
| Square Free | Yes | Square processing from day one |
| PayPal | Yes | PayPal fees when paid |
| Stripe Invoicing | Needs Stripe account | Stripe Payments + ~0.4–0.5%/paid invoice |
| Helcim | Free PDF generator; full send needs Helcim MID | **Inverse**: merchant account first |
| Invoice Ninja | Free forever limited | BYO Stripe/PayPal/Square |
| Invoice Simple | Metered free then paid SaaS | Stripe/PayPal fees |

## Levels

- **A** Invoice-only + CDG quote CTA (low PCI, weak Pay UX)
- **B** After CDG: BYO Quantum `gwlogin` → hosted Pay (recommended)
- **C** ClientBilling as MoR — do not

## Quantum GAP

Public QGW APIs charge / vault / recurring / hosted pay. **No** public “create QGW invoice & email” API. ClientBilling must own invoice lifecycle.

## MVP test

Auth → invoice PDF/link → rate-limited email → CTA enable payments → applynow?R=470; optional BYO Quantum pay. Kill if after 200–500 senders CDG CTA ≪10% or apply→approve ≈0.

## Sources

See chat research + executor brief Sep 18, 2026 (Wave, PayPal, Stripe, Square, QGW developers, CDG solutions).
