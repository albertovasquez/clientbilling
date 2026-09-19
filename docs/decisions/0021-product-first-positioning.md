# 0021: Product first. "Bill clients. Know what getting paid costs." Payments are rails attached to the record.

Status: Accepted 2026-09-18. Supersedes the hero and navigation parts of 0001. Reads with 0010 and 0014, which stand.

## Context

Decision 0001 kept the CDG content site in the homepage hero until "a payer can pay an invoice through CDG and at least twenty merchants have sent an invoice". The founder's research of 2026-09-18 (`docs/strategy/2026-09-18-research-niche-and-monetization.md`) argues the domain is primed for a product, not a publisher, and that the hero should be the invoicing product with CDG appearing at the moment a merchant wants to collect. The pay link shipped in 0014 means a payer can already pay from an invoice. The twenty-merchant threshold has not been met; the founder is deciding on strategy rather than waiting for funnel data, and says so here.

## Decision

- **Positioning.** ClientBilling is invoicing for client businesses. The line is "Bill clients. Know what getting paid costs." The homepage hero, primary navigation, and first screen belong to the product. The CDG review, comparison posts, and calculator stay indexed and linked as guides; they are the traffic and they are not deleted or demoted in search.
- **Product rule.** Whenever money moves, ClientBilling makes the economics visible: the fee on each way of getting paid, the expected net, settlement timing where known, and the cheaper alternative rail. Every number shown comes from `src/lib/cdg.ts` with its source and date, or from a value the merchant entered in settings. Nothing is estimated silently.
- **Architecture statement.** ClientBilling is the system of record. The invoice is the human-readable object. Payment-aware invoicing explains what collection costs. The API and MCP make the same billing object usable by software and agents. Payments are rails attached to the record, never the identity of the company. The site never becomes a merchant-services site, whatever CDG's economics turn out to be.
- **Navigation.** Invoices, Payments, For agents, Developers, Guides, Sign in. CDG is not a brand in the hero or the nav. It appears where a merchant decides how to collect, with the disclosure, through the existing R=470 links.
- **Sequence.** This decision is proof of positioning, not a wholesale redesign: 0021, then the brand brief (`docs/brand/brief.md`), then a homepage concept, an invoice with a file-copy economics block, and a component specimen, judged by the founder before anything propagates to the app.
- **Money modelling.** CDG is modelled as zero recurring revenue. A confirmed referral payment is revenue; anything else is upside until a written answer exists. Decision 0014 may be reopened narrowly for attribution mechanics, attribution duration, residual versus bounty, termination and tail provisions, and whether economics survive plan changes. No integration discussion is part of that reopening.
- **Agent wedge.** Build only the primitives that are valuable anyway: stable invoice IDs, idempotent create and update, webhooks, key scopes, machine-readable payment status, a small MCP surface. Publish an "Invoicing API for agents" page only once those exist. x402 is not on the critical path.

- **Next phase, ClientBilling Proof.** The third copy of every record is cryptographic. An append-only billing event log (created, sent, viewed, revised, payment requested, received, settled, failed, refunded, credited, voided) records the actor on every event: user, agent with its authorization, API key, or processor. Each event is serialized canonically, salted with a random nonce, and hashed with SHA-256; a worker batches hashes into a Merkle tree and anchors only the root on Avalanche C-Chain; ClientBilling keeps the inclusion proof and serves `/verify/{record}`. No invoice contents, amounts, names, or card data ever go on-chain. Postgres stays authoritative; if the chain or RPC is unavailable, invoicing continues and proofs queue. No token, no wallet for users, no NFT, no smart-contract logic beyond an anchor. The claim is precise: the proof shows the record existed unchanged at that time; the processor or bank remains the authority on whether money moved. An on-chain USDC payment is the one case where the payment itself can be referenced. The word "blockchain" stays off the homepage; the line is "A billing record you can prove."

## Reasons

- The name already promises a product. Meeting that promise on the first screen removes a trust problem that no disclosure can fix.
- Publishing what getting paid costs is the one position Wave, Zoho, and Square cannot take, because they bundle processing. It is already the site's strongest content; the product should carry it.
- Keeping payments as rails preserves leverage to support CDG, ACH, another processor, or stablecoins side by side.
- A tamper-evident event log with actors is what makes an invoicing API for agents trustworthy: who did what, when, and what the record said at that moment. The hash-chained log has that value on its own; anchoring adds an independent clock. Anchoring costs are small and dynamic, so nothing is modelled on a fixed per-transaction price.
- Gas for anchoring is operational spend from a dedicated key with a small balance, not customer funds. It does not cross the compliance boundary, and the boundary file should say so before the phase starts.

## Consequences

- Measure CDG click-through and quote clicks for four weeks after the new homepage ships, against the four weeks before. If referrals fall by more than a third with no rise in sign-ups, the hero gets a stronger Collect moment, not a return to the old hero.
- The `/invoices` product page becomes part of the homepage story rather than a side door.
- `docs/mission/north-star.md` is not changed by this decision; the founder owns it and may fold the positioning line in.

## Revisit when

Four weeks of funnel data exist, or a CDG answer changes the money model.
