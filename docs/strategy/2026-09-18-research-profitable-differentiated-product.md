# ClientBilling.com: a profitable, differentiated invoicing product

Status: research input, filed 2026-09-18, the founder's second report. Editor's notes by the agent. Decisions in `docs/decisions/` override this document; 0021 and 0022 adopt most of it.

## Editor's notes

**What this report changes against the first one** (`2026-09-18-research-niche-and-monetization.md`):

1. The positioning claim is narrowed to something defensible. Wave, Square, FreshBooks, and Stripe publish their rates; the uncontested position is applying the rate to the invoice in front of you, showing known fee and expected net before sending, naming the source and date, and refusing to estimate the variable part. The homepage sentence "most invoicing tools bundle processing and show you the fee after the money lands" was wrong and has been replaced on the canvas with the report's wording.
2. "Invoicing API for agents" is contested: Zoho, Square, and Stripe ship MCP servers, and developer-first entrants use the same words. The wedge becomes actor, authorization, cost model, and verifiable record on every agent action. Adopted in 0022.
3. The "third copy" collision is resolved: one record, three views (client, file, agent), one proof. The proof is the registration mark through the stack, not a fourth copy. Applied to the canvas, the brand brief, and 0021.
4. The CDG public 2021 reseller template is real evidence of recurring residual economics (30% split above pass-through, monthly, $25 threshold) and of their fragility (structure changeable, 30-day termination, no clean tail, attribution not public). It is a template, not our executed agreement. It justifies exactly one narrow email, drafted at `docs/partners/cdg-residual-and-attribution-email.md`; sending it is the founder's call under 0014.
5. Two revenue engines: a Machine tier ClientBilling controls (proposed $29 a month) and residuals it does not. Adopted in 0022, which revises 0010. The proof seal is never paywalled.
6. Avalanche is a proof substrate, not a database: anchor material events only (invoice versions, payments, voids), not opens and reminders; canonical serialization with nonces; a fixed Merkle construction; a minimal anchoring contract with no token; fully asynchronous; gas metered with a pause threshold. Folded into 0021's next phase.
7. Client PDFs carry a quiet proof strip; infrastructure detail lives on the file copy and the verification page. Applied to the canvas.
8. The mono rule is narrowed: Plex Mono for money, percentages, dates, invoice numbers, record IDs, rate formulas, and API output; not every non-prose token. Applied to the brief.

**Things the agent has not verified** and that must not reach site copy without a sourced entry in the manner of `src/lib/cdg.ts`: every competitor price and rate in the landscape table; the CDG 2021 template's clauses (quote the executed agreement, never the template, on any page); Avalanche fee, finality, and x402 figures; PaymentCloud, Host Merchant Services, and Invoice Ninja partner terms. The revenue scenarios are the report's illustrations under its own assumptions A1 to A8; they are not forecasts and are not repeated anywhere else in the repo.

**Where the eight-week plan meets the codebase**: weeks three and four are partly done (API keys, v1 REST for clients, invoices, status, send, remind, payments; rate limits; session hardening). Missing from those weeks: idempotency keys, invoice versions, an append-only event table with actors (today's `InvoiceEvent` is close but has no actor or hash), key scopes, signed webhooks, OpenAPI. Week two's rate-source registry can start from `src/lib/cdg.ts` and the payment-method data in payment records. The roadmap file carries the week-by-week plan with exit criteria.

The report follows, edited to house style. Diagram fragments that did not survive the paste are replaced by the logical model list.

---

## Executive summary

ClientBilling should not become another general-purpose accounting suite, another merchant-services comparison site, or a crypto invoicing product. The strongest business is narrower: ClientBilling is payment-aware invoicing with a verifiable paper trail.

The human promise: Bill clients. Know what getting paid costs.
The machine promise: the same billing record, readable and actionable by software.
The trust promise: every important version can be independently verified.

The revenue model has two independent engines: paid machine access that ClientBilling controls, and payment-processing residuals that it does not. CDG Commerce can make the second engine material, but it should never become the product identity.

Four findings:

1. The core differentiation survives competitive scrutiny, but the wording needs to be precise. Wave, Square, FreshBooks, Stripe, and others do not simply hide processing fees; they publish them. What was not found across the eleven products reviewed is the exact ClientBilling combination: apply the relevant rate to this specific invoice before it is sent, show the known fee and expected net, identify variable components instead of silently estimating them, and preserve the source and checked date with the billing record.
2. "Invoicing API for agents" is no longer uncontested. Zoho Invoice has an official MCP integration; Square operates an official MCP server in beta; Stripe has an official MCP server and agent tooling; JupiterInvoice markets REST, OpenAPI, and MCP invoicing to agents; third parties wrap Invoice Ninja as agent-ready. ClientBilling should compete on payment-cost intelligence, explicit agent identity and authorization, and verifiable agent actions, not on having an MCP endpoint.
3. CDG's public economics are better than the bounty-only assumption, but not safe enough to forecast on. The public 2021 reseller agreement's Schedule A specifies a 30% split above pass-through association fees and specified CDG costs, applied also to certain network, communication, and additional merchant-account fees. The same agreement lets CDG alter commission structures, permits termination with 30 days' notice, and grants no clean perpetual tail; voluntary termination cuts compensation at the date notice is given. One narrow email to CDG is the highest-return business-development action in this report.
4. Avalanche makes sense as a proof substrate, not as the database. C-Chain is public, transparent, and EVM-compatible; its base fee is dynamic and, per Avalanche, well below 1 nAVAX per gas under normal load after the 2025 fee changes, with roughly one-second finality. With Merkle batching, chain expense is insignificant. The hard questions are product semantics, privacy, and whether customers value verification.

The Carbon Copy concept is directionally strong. Its one conceptual problem was two meanings of "the third copy". Resolved as: One record. Three views. One proof. Client copy, file copy, agent copy; the verification seal runs through all three, the modern equivalent of the registration mark through carbon paper.

### Recommended business architecture

| Layer | What ClientBilling owns | How it earns |
| --- | --- | --- |
| Human invoicing | Free invoice creation, sending, PDFs, reminders, records, payment-cost comparison | Acquisition and retention |
| Payment intelligence | Sourced rate snapshots, fee and net calculations, processor-neutral comparison | CDG and later partner referrals |
| Machine layer | REST API, webhooks, API keys, MCP, agent identities, idempotency | Machine tier, proposed $29 a month |
| Trust layer | Append-only events, invoice-version fingerprints, optional Avalanche proof | Differentiation; included, not separately monetized |
| Payments | External hosted rails, CDG referral rather than custody | Residuals if contractually confirmed |
| Machine settlement, later | x402, USDC, or similar | Experimental usage revenue, only after demand |

### Assumptions used in the models

| Assumption | Treatment |
| --- | --- |
| A1. U.S. is the first market | CDG and the payment-cost positioning make U.S. service businesses the first target |
| A2. Invoice software, not merchant of record | No card PAN collected or stored |
| A3. The executed CDG agreement was not supplied | The public 2021 template is evidence, not proof of the current contract |
| A4. Human invoicing stays free | Machine automation, not invoice count, is the first paywall |
| A5. Machine tier at $29 a month | Proposed price, not market data |
| A6. CDG residual $10, $20, $35 per active referred merchant in three scenarios | Modelling inputs, not CDG promises |
| A7. Anchoring at 50,000 gas, 1 nAVAX per gas, $30 per AVAX | Explicit budget assumptions; actual values vary |
| A8. Revenue scenarios are run-rate illustrations | Not forecasts; exclude payroll, taxes, CAC, and one-time bounties |

Sequencing: rebrand and payment-cost product first; confirm CDG economics in parallel; API, webhooks, idempotency; MCP; verifiable record; measure external developer demand; only then consider x402.

## Competitive landscape

Generic free invoicing is crowded. Generic invoicing APIs are crowded. Agent access is becoming crowded in 2026. What remains unusual in the first-party material reviewed is processor-neutral payment economics plus an invoice-specific net calculation plus provenance for the rate plus tamper-evident record proof.

Definitions: "published" means the vendor discloses processing pricing; "pre-send net" means the product is documented as calculating the merchant's net on a particular invoice before sending; "source-dated" means rate provenance and date are retained with that calculation. "Not found" means not found in first-party material during this audit, not a claim that no such feature exists. (Editor: none of the figures below have been re-verified; see the note above.)

| Product | Core invoicing and pricing | Fee transparency | API and webhooks | Agent support | Proof capability |
| --- | --- | --- | --- | --- | --- |
| Wave | Starter $0 with unlimited invoices; Pro $19 a month or $190 a year | Published: 2.9% + $0.60 cards, 3.4% + $0.60 AmEx, ACH 1% with $1 minimum. No source-dated pre-send net | GraphQL invoice API; webhooks for sent, viewed, overdue, partial, paid; signed payloads; Pro required | No first-party MCP found | PDFs, payment state, signed events; no anchoring |
| Zoho Invoice | $0, two users, three projects, 500 invoices a year; recurring, reminders, expenses, portal | Processor-dependent; no neutral source-dated comparison | Full REST API | Strong: official MCP in 2026 for invoices, customers, payments, reminders | Activity history; no public-chain proof |
| Square | Free $0, Plus $49, Premium $149 per location per month | Published: 3.3% + $0.30 free, 2.9% + $0.30 paid plans, ACH 1% with caps. No neutral comparison | Invoices API with idempotency | Strong: official MCP server in beta with OAuth | Receipts and records; no cryptographic commitment |
| FreshBooks | $23, $43, $70 a month with introductory discounts | Published: 2.9% + $0.30 cards, 1% ACH. No multi-rail pre-send net | REST API and webhooks | No first-party MCP found | Standard history; no anchoring |
| Stripe Invoicing | 0.4% per paid invoice on top of processing | Published thoroughly, centred on Stripe rails | Among the strongest API and webhook ecosystems | Very strong: official remote MCP and agent tooling | Receipts, invoices, event records; no cross-provider proof |
| Invoice Ninja | Free for five clients; Pro $14; Enterprise from $18; open source | Gateway-oriented; no source-dated pre-send net | API in Pro; third-party agent tooling | No first-party MCP; third parties wrap it as agent-ready | DocuNinja audit trails and e-signature; no public-chain commitment |
| Hiveage | Free and paid tiers; multiple gateways | 2.9% quoted for its own payments; no neutral comparison | API on higher tier; no webhook or agent surface found | None found | Receipts; no tamper-proof commitment |
| Invoice2go | Paid tiers; dollar prices not reliably present | Plan-dependent card rates from about 3.5% toward 2.9% | No public API or MCP verified | None found | Receipts and tracking; no external proof |
| Billdu | $7.99, $14.99, $27.99 monthly; cheaper annually | Not the core proposition | API on Premium | None found | Signatures, status, receipts; no anchor |
| Invoice Simple | $6.99, $14.99, $21.99 with invoice caps | Not a first-class feature | No public API found | None found | Read receipts; no external proof |
| JupiterInvoice | Developer-first; pricing not stated | Not its differentiator | REST, OpenAPI 3.1, MCP, bearer tokens | Agent-native; MCP server | No record proof described |

The most important correction to the homepage: replace "Most invoicing tools bundle payment processing and show you the fee after the money lands" with "Processing rates are easy to publish. Applying them to the invoice in front of you is different. ClientBilling shows the known cost and expected net before you send, names the source, and tells you when a cost cannot be known in advance."

The agent-specific differentiation: an invoicing API where an agent can act, but every financial action retains an actor, authorization, cost model, and verifiable audit record.

The initial niche remains U.S. client-service businesses issuing medium-to-high-value B2B invoices, where a $2,500 to $25,000 invoice makes the dollar difference between card and bank immediately understandable.

## Brand and experience

Commit to Carbon Copy. The metaphor has strategic depth: carbon paper created synchronized records for different parties.

Terminology, permanently: One record. Three views. One proof.

| View | Audience | Representation |
| --- | --- | --- |
| Client copy | The payer | Public invoice page and PDF |
| File copy | Owner and bookkeeper | Payment economics, payment history, actor history, sources |
| Agent copy | Software | JSON, REST, webhooks, MCP |
| Proof seal | All three | Fingerprint, anchor, verification endpoint |

Palette: keep paper #FBFAF6, ink #15142B, carbon #3F3BA6, cleared #1E7A4D, due #B4451D. Functional additions: carbon wash #F0EFFA for the offset sheet, rule #DDD9CF for invoice and ledger lines, muted ink #6C6977. No gradients, no neon, no dark "Web3" screens, no aged paper.

Type: keep IBM Plex Sans and Mono. Mono for money, percentages, dates, invoice numbers, record IDs, rate formulas, API output. Words stay in Sans.

Mark: three offset sheets are Client, File, Agent; a registration point through them is verification. No globe, chain link, coin, checkmark, or cube.

Voice, four rules: state the number ("Card fee: $87.80"); state its source ("CDG Commerce published rate, checked Sep 17, 2026"); admit uncertainty ("$8.90 plus interchange. Final cost varies by card"); never imply savings you cannot calculate ("Compare card costs", not "Save hundreds").

Priority UI changes: the homepage replaces the broad claim with an interactive invoice-specific comparison with an editable amount and labelled exact versus variable components; the client PDF carries a quiet verified-record footer with infrastructure detail moved to the verification page and file copy; the component system names the block "Proof seal" and reserves the registration mark for verification.

OG images at 1200 by 630 with 80 px safe space, three templates: product, developer, proof. No Avalanche branding on the default image.

The existing merchant-account guides move under guides and payments; invoice-cost calculations link into them. They become acquisition and referral content and stop defining the company.

## Monetization and partnerships

CDG's public reseller page invites ISPs, hosts, designers, consultants, and bankcard professionals, and says resellers earn nothing on their own merchant account. The public 2021 agreement, read as a template:

| Issue | Public agreement | Consequence |
| --- | --- | --- |
| Who can be referred | An eligible merchant without an existing CDG relationship that is an existing customer of the VAR | Ask whether a registered ClientBilling user qualifies |
| Marketing approval | CDG-supplied or approved materials; proposals deemed accepted unless rejected within ten days | Submit payment-comparison language after economics are confirmed; do not let CDG write the brand |
| Residual structure | Schedule A: 30% above pass-through association fees plus BIN sponsorship, reporting, and maintenance costs; percentage carried to specified additional fees | Credible evidence of recurring residuals |
| Minimum payout | Monthly commissions under $25 accrue | Confirms monthly calculation |
| Change risk | CDG may change fees, prices, commission structures, and methods | Never capitalize a lifetime residual |
| Termination | Either party on 30 days' notice; voluntary VAR termination ends compensation at notice date | No clean tail |
| Post-termination | No further fees until equipment and materials are returned | Clauses interact; get written clarification |
| Attribution | No public cookie, click rule, link window, or lead lock | Get attribution in writing before engineering |

Intuition only: $25,000 a month in 50 online card transactions at 0.35% + $0.15 yields a published markup line of $95; 30% of that is $28.50. Not a promised residual. It makes $10 to $35 per active merchant per month credible for scenario planning.

The narrow email is drafted at `docs/partners/cdg-residual-and-attribution-email.md`. It is a release gate for modelling CDG revenue, not a blocker for the product.

Revenue scenarios (gross recurring illustrations under A1 to A8, no bounties, no costs):

| Scenario | Active free businesses | Machine conversion | Paid Machine | Machine MRR | Active CDG merchants | Residual per merchant | CDG MRR | Total MRR | Annualized |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Conservative | 2,500 | 1.0% | 25 | $725 | 10 | $10 | $100 | $825 | $9,900 |
| Likely | 10,000 | 2.0% | 200 | $5,800 | 100 | $20 | $2,000 | $7,800 | $93,600 |
| Upside | 35,000 | 3.5% | 1,225 | $35,525 | 700 | $35 | $24,500 | $60,025 | $720,300 |

The implication matters more than the upside: in the likely case CDG is $2,000 of $7,800. If CDG is bounty-only, the model falls to $5,800, not zero. CDG determines whether payments are a meaningful recurring engine; the Machine tier determines whether ClientBilling is a durable software business.

Other residual relationships worth obtaining as benchmarks: PaymentCloud (advertises lifetime residuals for agent and ISV relationships) and Host Merchant Services (monthly residuals, portfolio protection). SaaS affiliates recur finitely (Invoice Ninja: 50% for three years). Do not display three processors on the homepage; keep a neutral rate engine and select partners by fit. Honour CDG's non-solicitation provisions.

Decision tree: CDG confirms recurring residual and reliable attribution, then CDG stays primary and conversion tracking is built, and a hosted payment integration is evaluated later only if it materially improves conversion. Otherwise CDG stays an optional referral and content partner and the Machine tier is the primary recurring model.

## Technical architecture

Rule: the database stores meaning; the blockchain stores commitment. Nothing sensitive goes on Avalanche.

V1:

| Component | Recommendation |
| --- | --- |
| Source of truth | PostgreSQL |
| Invoice model | Immutable invoice versions plus a current projection |
| Money | Integer minor units only |
| Event model | Append-only billing events with actor, authorization context, previous event hash |
| Rate provenance | Versioned payment rate snapshots: formula, source, checked date, calculation version |
| Idempotency | Required on every state-changing API request |
| API | REST JSON plus OpenAPI |
| Webhooks | At-least-once, signed over raw body and timestamp, stable event IDs, replay window |
| Agent access | API keys and service accounts plus MCP tools with explicit scopes |
| Proof | Canonical hashes, Merkle batch, Avalanche root |
| Chain dependency | Fully asynchronous; invoicing continues without the chain |
| Chain data | Root and opaque batch metadata only |
| Anchored objects | Invoice versions, voids, payment records; not opens or reminders |
| Verification | Public verify page plus machine-readable proof endpoint |

V2 adds delegated OAuth and service-account authorization, agent approval policies, processor-confirmed payment adapters, richer proof bundles, on-chain payment evidence, and only then an x402 experiment.

Logical model: organization has users and service accounts; organization bills customers; customer receives invoices; invoice has versions and payments and emits billing events (organization id, aggregate type and id, sequence, event type, actor type and id, payload, previous hash, event hash, occurred at); payment rate sources version payment rate snapshots, which calculate payment cost quotes; billing events are included in proof batches (Merkle root, chain, transaction hash, submitted at, confirmed at, status) through proof memberships; organization issues API keys, configures webhook endpoints, and receives webhook deliveries.

Sequence: user or agent posts an invoice with an idempotency key; the API writes invoice and version and appends a billing event with actor and authorization in one transaction; returns 201 with proof status pending; the webhook worker delivers a signed event; the Merkle batcher reads unanchored material event hashes, builds a deterministic tree, anchors one root on C-Chain, waits for finality, stores the transaction hash and inclusion proofs; the verification service loads the canonical version and Merkle proof, reads the anchored root, recomputes leaf to root, and answers verified or mismatch with an explanation.

Canonical serialization: UTF-8; keys sorted; money as integer minor units; timestamps in UTC; dates as YYYY-MM-DD; no floating-point currency; explicit null versus omitted; schema version; actor and authorization context. Per event: a high-entropy nonce; payload hash = SHA256(nonce, canonical event); event hash = SHA256(previous event hash, payload hash, sequence). Merkle: leaf = SHA256(0x00, event hash); node = SHA256(0x01, left, right); leaves sorted by sequence; sibling paths stored, so a proof survives even if ClientBilling disappears. A minimal anchoring contract emits a batch-anchored event with root, manifest hash, and batch sequence. No NFT, token, wallet, amount, address, or PII.

Anchoring cost under A7: 50,000 gas at 1 nAVAX at $30 per AVAX is $0.0015 per anchor. Hourly anchoring at 10,000 events a month is about $1 a month; five-minute anchoring at a million events is about $13; per-minute at ten million is about $65. At 10 nAVAX multiply by ten. Meter actual gas and pause or queue when a threshold is exceeded. Event volume does not drive chain cost; cadence does.

Privacy and security, non-negotiable: only salted commitments on chain; tenant isolation; encryption at rest; KMS-managed signing; a minimally funded anchor wallet; rate-limited verification endpoints; audit logging; secret rotation; signed webhooks with replay protection. For agents the boundary is the credential and scope, not the prompt. V1 scopes: invoice read, write, send, void; reminder send; payment read, record; cost read; proof read. Recording a payment means recording that one occurred. Payment evidence carries provenance: manual, processor webhook, bank import, on-chain transaction; a manual record and a processor-confirmed settlement do not use the same language.

Effort: rate snapshot model and calculator 3 to 5 days; event store and actor model 3 to 4; idempotency 2 to 3; REST v1 and scoped keys 5 to 7; signed webhooks 3 to 4; OpenAPI 1 to 2; MCP 2 to 3; canonicalization 2 to 3; Merkle worker 3 to 4; anchoring worker and contract 2 to 4; verification endpoint and UI 3 to 4; PDF and file-copy integration 2 to 3; security and replay testing 4 to 6; x402 spike 2 to 3 after the demand gate. Roughly 30 to 45 dev-days with parallelism.

## Product and go-to-market

Boundary: invoicing and billing records. Not QuickBooks, not payroll, no card credentials, no general ledger.

Tiers: Free covers clients and invoices, public page and PDF, recurring, reminders, manual and partial payments, pay links, invoice-specific cost comparison, sourced rate snapshots, CSV, the verified record, a small sandbox, and limited read-oriented production API. Machine (proposed $29) adds production REST, idempotent writes, signed webhooks, remote MCP, service-account identities, the proof API, basic approval policies, moderate quotas. Scale, later, adds delegated OAuth, advanced policies, higher quotas, and experimental x402. Do not charge for the seal.

Invoice creation returns payment costs that distinguish known fees from unknown variable components: flat card known fee 8780 cents and net 241220; interchange-plus known fee 890 with a variable interchange component and net null; ACH from the organization setting 100 and net 249900; each with its source name and checked date; proof status pending. That JSON refuses to invent an interchange number, which is the brand.

Every machine mutation returns actor provenance (type, id, authorization id) and the request id and idempotency key. Webhooks carry event id, type, occurred at, organization, data, actor, and proof status; a later record.proof_anchored event carries the record id, version, anchored at, and proof URL. The verification API returns record id, version, verified, fingerprint, anchor (network, transaction, anchored at), the Merkle proof, and a meaning field stating that it proves the record matched an anchored commitment and does not independently prove a fiat payment settled.

MCP V1: list invoices, get invoice, create invoice, send invoice, send reminder, record payment, get payment costs, verify record. No card charge, refund, or transfer tools.

Positioning: "Bill clients. Know what getting paid costs." Subhead: "Free invoicing that applies payment costs to the invoice before you send it. Every number has a source. Every important version can be verified." Supporting: "For people, software and agents. Same invoice. Same rules." Developer page: "Invoicing API for AI agents. Create, send, remind and record payments through REST or MCP. Every write is idempotent. Every action has an actor. Every billing record can be verified."

Search clusters: agent (invoicing API for agents, MCP invoicing server); developer (invoice API with webhooks, idempotent invoice API, invoice audit trail API); payment economics (invoice payment processing fees, ACH vs card invoice, interchange plus calculator); trust (verifiable invoice, tamper evident invoice, invoice integrity verification); processor intent (CDG Commerce pricing, CDG vs Square, merchant account for invoicing business). Not "blockchain invoice" or "crypto invoicing".

Three launch experiments: the homepage proof test (activation from cost transparency, proof click rate); the developer landing (external keys, time to first invoice, weekly retained API organizations); the CDG economics test (referral click to application to approval to active merchant to first residual). Gate x402 on at least ten external API accounts and three independent repeat machine users, or three customers explicitly asking for machine settlement.

Metrics from day one: non-brand organic sessions; activation (create, send); percent of sent invoices whose owner viewed the cost comparison; fee dollars compared; retention; API keys, time to first API invoice, weekly active API organizations; MCP-connected organizations and agent write actions; webhook delivery rate and latency; proof anchor latency and verification visits; Machine MRR, conversion, churn; CDG referral funnel; safety (unauthorized agent actions, cross-tenant incidents, duplicate writes: target zero). The metric that matters most: percentage of invoices sent with a payment-cost choice the sender reviewed.

## Eight-week roadmap

| Week | Milestone | Work | Effort | Exit criterion |
| --- | --- | --- | --- | --- |
| 1 | Positioning and economics | Finalize 0021; send the CDG email; implement the Carbon Copy homepage and instrumentation; correct competitor language | 4 to 6 days | Invoicing is unmistakably the product; CDG secondary; analytics live |
| 2 | Payment-aware invoice | Rate-source registry, checked dates, flat and variable fee model, fee and net panel, rate snapshots, updated invoice and file copy | 4 to 6 | The $2,500 example and arbitrary merchant rates calculate without inventing interchange |
| 3 | Billing record | Append-only event model, actor and auth fields, invoice versions, idempotency | 4 to 6 | Duplicate requests cannot duplicate financial actions; every mutation has an actor |
| 4 | Machine API | REST v1, scoped keys, OpenAPI, signed webhooks, retry log | 6 to 8 | An external script creates, sends, and observes an invoice end to end |
| 5 | Agent surface | MCP over existing services; developer landing; examples; sandbox | 4 to 5 | An MCP client creates an invoice with an explicit service-account identity |
| 6 | Proof engine | Canonicalization, nonces, event hashes, Merkle batching, proof storage, Fuji anchoring | 5 to 7 | A test invoice version verifies against an anchored root |
| 7 | Productized verification | Public verification page, PDF seal, file-copy details, mainnet flag, KMS and security tests | 5 to 7 | A PDF record ID yields a plain-English verified or mismatch result |
| 8 | Launch and measure | Homepage release, developer and SEO pages, guide redirects, referral instrumentation | 3 to 5 | Usage shows which of economics, API, and proof pulls users |

Four gates: CDG (forecast zero until written terms); agent (ship primitives, not a platform); blockchain (feature flag, hashes not data, app works without the chain, no "blockchain" in the hero); x402 (outside these eight weeks, demand-gated).

The endpoint: ClientBilling owns the billing record. Humans see the invoice. Businesses see what collection costs. Agents act through the same record. Processors move the money. Avalanche can prove what record existed. ClientBilling does not pretend those are the same thing. That separation is the moat, and it is what makes the Carbon Copy identity more than a redesign.
