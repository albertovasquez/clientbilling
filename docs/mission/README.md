# Mission docs: read this first

ClientBilling is two things that must stay in one shape: an invoicing product, and a merchant-account path to CDG Commerce. These files are the source of truth for both. An agent or a person changing code, copy, or configuration reads them in this order and cites them in the pull request.

Reading order

1. `north-star.md`: what we are building, what we will never be, and the R=470 rule.
2. `compliance-boundary.md`: the hard lines on card data, funds, and merchant-of-record status. Violations are rejected, not negotiated.
3. `affiliate-cdg.md`: how CDG is presented, which links are allowed, and what is still unconfirmed.
4. `product-principles.md`: how we decide what to build and how it should feel.
5. `../product/invoice-mvp.md`: what exists today. `../product/roadmap.md`: what comes next and why.
6. `../agents/operating-manual.md`: what an agent may change on its own, and when it must stop and ask.
7. `../agents/definition-of-done.md`: what "shipped" means here. `../agents/api.md`: the API an agent uses to operate an account.
8. `../decisions/`: the record of choices already made. Newer supersedes older.
9. `../STYLE_GUIDE.md`: tokens, primitives, voice, CTA ladder.
10. `../brand/brief.md`: the Carbon Copy identity and the three proofs it must pass (decision 0021); `../brand/proofs/` holds the approved artboards; `../STYLE_GUIDE.md` section 2 holds the target tokens.
11. `../strategy/`: research and briefs. Read `2026-09-18-research-profitable-differentiated-product.md` (the current plan: competitive landscape, two revenue engines, proof architecture, eight-week roadmap) and, for the longer horizon, `2026-09-18-research-niche-and-monetization.md`. Both carry editor's notes; decisions override them.

Ownership

| File | Who may change it |
| --- | --- |
| `north-star.md`, `compliance-boundary.md` | The founder only. An agent may propose a change in a PR but must not merge it. |
| `affiliate-cdg.md` | The founder for anything about terms, residuals, or permitted claims. Agents may update link inventories and dates. |
| `product-principles.md`, `../product/roadmap.md` | Agents may propose by PR; the founder approves. |
| `../decisions/*` | Append-only. A new decision that reverses an old one says so. |
| `../agents/*` | Agents may propose; the founder approves. |
| `../product/invoice-mvp.md` | Agents keep it current as part of any PR that changes scope. |

The one-line summary an agent should be able to repeat: free invoicing that works without payments, and a CDG Commerce merchant account, referred through R=470, when the merchant wants to collect cards online. Never card data, never funds, never merchant of record.
