# Product principles

Owner: agents may propose by PR; founder approves.

1. **Unpaid invoices always work.** Every feature must function for a merchant with no merchant account. Payments are a layer on top, never a gate in front.
2. **The payer is the merchant's customer, not ours.** Public invoice pages carry the merchant's name, the merchant's instructions, and nothing that sells to the payer. No affiliate links, no sign-up pitches, no "powered by" louder than a footer line.
3. **Honest states, plain words.** "Sent" means delivered. "Opened" means a person opened it. "Planned" means not available. Copy never runs ahead of what the code does.
4. **Numbers are sourced.** Any rate, fee, or claim about a processor carries its source and its date. Estimates say estimate.
5. **One decision per screen.** A screen asks for one thing and offers one primary action. Two buttons at most; the third action is a text link.
6. **Speed is a feature we can afford.** Fewer queries, smaller pages, no analytics scripts, database in the same region as the functions. A merchant should be able to create and send an invoice in under two minutes on a phone.
7. **Calm, not fintech cosplay.** Ink on paper, one action color, tabular figures, ruled tables. The invoice is a document, and the app should feel like the desk it sits on.
8. **Agents must be able to operate it.** Every merchant action has a documented, scriptable path (API or CLI) and a runbook. If an agent has to improvise policy to do something, the product is missing a rule, not a feature.
9. **Measure the loop, not the vanity.** The numbers that matter are invoices sent, invoices opened, payer card intent, collect clicks, and CDG applications. Pageviews are not a goal.
10. **Ship small, record why.** Every non-obvious choice gets a decision record. A PR that changes scope updates `docs/product/invoice-mvp.md`.
