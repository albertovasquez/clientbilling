# ClientBilling.com: research, niche strategy, and monetization blueprint

Status: research input, filed 2026-09-18. Author: the founder, with outside research. Editor's notes by the agent.

This document is strategy input, not a decision. `docs/decisions/` and `docs/mission/` override it wherever they disagree. An agent reads it to understand where the business wants to go; it does not implement anything here that a decision has not adopted. Where this document and a decision conflict, the editor's notes below say what would have to change.

## Editor's notes (read these before the research)

### 1. Three standing decisions disagree with this research

| Research position | Standing decision | What adopting the research would require |
| --- | --- | --- |
| Product first: the homepage hero and navigation belong to invoicing; CDG appears when a merchant wants to collect | 0001: the content site stays the front door "until a payer can actually pay an invoice through CDG" | A new decision superseding 0001. Note that 0001's own trigger has arguably fired: since 0014 and the pay link, a merchant with a CDG Quantum hosted page can be paid from the invoice. Keep the CDG pages and their internal links; they are the only proven traffic. Change the hero, the nav order, and the invoice product's place on the page, then measure referral clicks for four weeks before touching anything else. |
| Paid tiers: Pro at roughly $15 to $25 a month, Agent/API at $49 to $99 plus usage | 0010: free forever, no paid tier, funded by CDG referrals and residuals | Revise 0010 to "free for people, paid for machines". Human invoicing stays free because it feeds payment volume; the API, MCP, webhooks, and metering are a separate product with separate costs. The terms of service already promise 30 days' notice for pricing changes. A Pro tier for humans should stay off the table until the free product is clearly good enough on its own (the research's own test). |
| Negotiate the reseller contract with CDG, embedded onboarding with status webhooks, and ask CDG whether an Authorize.net reseller account can stack on a CDG merchant | 0014: the founder will not ask CDG anything; no integration, no residual claims, one-pager unsent | The founder reopens 0014. Nothing in the "second release" (embedded onboarding, application state, residual forecasts) can start without it. Until then, the payment layer is what 0014 allows: the merchant's own pay link, payment records, and the R=470 quote and apply links. |

### 2. Where the app already is against the four releases

The research assumes a nearly empty product. As of 2026-09-18 the app has shipped: accounts, clients, invoices with line items and tax, send by email with PDF, public invoice page with view tracking, reminders, overdue sweep, recurring schedules, partial payments and payment records, merchant pay link with the balance prefilled for PayPal.me, concierge Collect, API keys with a v1 REST API, shadcn UI, and the security hardening in decision 0020.

| Research release | Already done | Still missing |
| --- | --- | --- |
| First: the receivables lifecycle | clients, invoices, send, viewed, reminders, recurring, partial payments, payment records, aging tiles, PDF | estimates and one-click conversion, deposits and milestones as a workflow, automatic reminder schedules, client portal, credit notes, CSV export, team roles |
| Second: payments as the revenue engine | pay link on the public invoice, payment method recorded per payment, CDG quote and apply links at the Collect moment, fee calculator | provider abstraction, CDG onboarding state, Payment Optimizer, any Authorize.net relationship (all blocked by 0014 except the optimizer, see note 4) |
| Third: API as a product | API keys, `/api/v1` for clients, invoices, status, send, remind, payments, reference at `/docs/api`, runbooks | webhooks, idempotency keys, SDK, MCP server, OAuth, agent credentials and spend policies |
| Fourth: machine billing and x402 | nothing | usage meters, x402 payment requests, stablecoin settlement events, signed receipts, month-end aggregation |

So the practical order is: homepage inversion (needs a decision), then the missing first-release items, then webhooks, idempotency, and MCP on the existing API, then a decision on charging for the API, then x402 as a research spike.

### 3. Numbers and claims

- Every CDG number in this document (bands, 3.50% + $0.30 online flat rate, 0.35% + $0.15 online interchange-plus markup) matches `src/lib/cdg.ts`, which carries the source URL and the date checked. If they ever differ, the code file wins and this document is stale.
- The microtransaction table and the $275-per-merchant-month markup example are arithmetic on published CDG rates. They are not commission forecasts. CDG's reseller split is not public and is not in our records; the affiliate diligence table in `docs/mission/affiliate-cdg.md` lists it as unconfirmed.
- The third-party claims below came with the research and have not been re-verified by the agent: Zoho Invoice's free feature list, Zoho's 12-month 15% affiliate terms, HighLevel's 40% recurring affiliate, Authorize.net's reseller buy-rate and sell-rate program and its ISO requirement, Google's AP2 and its transfer to the FIDO Alliance, AP2 v0.2 "Human Not Present" transactions, Visa's work with OpenAI, and x402's fee model, batch settlement, and transaction counts. None of these may appear in site copy until they carry a source in the same form as `src/lib/cdg.ts` (URL plus date checked). The operating manual's rule against invented fee claims applies to competitors and partners as much as to CDG.

### 4. Improvements made while editing

- The Payment Optimizer is closer than the research thinks. Payment records (decision 0019) already store the method of every payment received, so card share, ACH share, average invoice, and monthly volume can be computed from the ledger instead of asked in a form. The first version of the optimizer is a read-only insight on the dashboard: volume by method over 90 days, and the CDG band that volume falls in, with the existing quote link. That needs no CDG conversation and no new data.
- The residual arithmetic is kept but labelled as an illustration in every place it appears.
- The non-custody rule is restated as a hard line, matching `docs/mission/compliance-boundary.md`: ClientBilling creates payment requests and listens for settlement events; it never holds funds, card data, or private keys, on any rail, including stablecoins.
- "Remove CDG from primary navigation" is softened to "CDG is not the brand in the hero". The CDG review, comparison posts, and calculator stay indexed and linked; they are the traffic.
- Typography brought to house style: no em dashes, no arrows in prose. Flow diagrams use plain text in code blocks.

### 5. Recommended next decisions, in order

1. 0021: product-first homepage and navigation, superseding the hero and nav parts of 0001. Measure CDG click-through before and after.
2. 0022: free for people, paid for machines, revising 0010. Sets the principle without a price.
3. Founder's call: reopen 0014 or not. Everything in the second release waits on it.
4. Estimates, deposits, automatic reminders, client portal, CSV, credit notes as the next product PRs, in that order.
5. Webhooks and idempotency on the v1 API, then an MCP server.
6. An x402 spike: one endpoint, one payment, one receipt, in a branch, with a written report before any product work.

The research follows, edited for house style and cross-referenced to the repo. Its judgments are the founder's.

---

## Executive judgment

ClientBilling.com is a much better asset than the product positioning currently gives it credit for.

As of September 18, 2026, the homepage leads with "Get paid better, and know what a merchant account costs before you sign," then immediately explains CDG Commerce pricing and affiliate economics. The free invoice product is present, but it is secondary: the homepage says users can create, send, and track invoices for free and that card payment through CDG is planned.

I would invert that model.

ClientBilling should become a real invoicing and receivables product first, and a merchant-services acquisition engine second. The CDG relationship should be embedded at the moment when a user actually needs to accept money, not be the main reason the visitor thinks the site exists.

The more ambitious version is even better:

ClientBilling is the billing layer between a service provider and its client, whether the provider is a person, a company, or an AI agent.

That gives three complementary businesses under one unusually appropriate domain:

| Layer | Customer promise | Monetization |
| --- | --- | --- |
| Human invoicing | Create, send, track, remind, and reconcile invoices for free | Merchant-processing residuals |
| Payment optimization | Let each business use the payment rail that makes economic sense | CDG and Authorize.net residuals; selected referrals |
| Agent billing | Give software and AI agents an API and MCP interface for invoicing, metering, payment requests, receipts, and reconciliation | Paid API plans plus usage |
| Machine micropayments | Pay for API calls, data, compute, or agent services in tiny amounts | Subscription and API fees around x402 and stablecoin rails |

This is substantially more defensible than another free invoice generator. Zoho Invoice already offers free invoicing with customizable invoices, card, ACH, and wallet payments, quotes, recurring invoices, reminders, expenses, time tracking, a client portal, and reports. Square, Wave, and PayPal similarly combine invoicing with integrated payments and automation.

So the opportunity is not "build free invoices better than everyone." The opportunity is:

Free invoicing as distribution; payment economics as monetization; agent-native billing as differentiation.

That is the strategy I would build around.

## What you have today, and what I would change

### The current site has the beginnings of the right funnel

There are several things I would keep.

ClientBilling already communicates processing economics more honestly than a typical merchant-services lead-generation site. It publishes CDG's volume bands, explains interchange-plus markup, dates its rate checks, discloses that ClientBilling may receive a commission, and says explicitly that ClientBilling itself is not the processor.

The site also has useful primitives: free invoice creation, sending, and tracking; a payment-cost calculator; detailed CDG analysis and comparisons; merchant account educational material; a clear affiliate disclosure; and the sensible security posture that ClientBilling itself should not hold raw card numbers.

Those are good building blocks. The issue is hierarchy.

### The domain says "product"; the homepage currently says "affiliate publisher"

Someone typing ClientBilling.com is naturally primed to think: "This is where I bill my clients."

Instead, the current hero immediately introduces merchant-account costs and CDG Commerce. The invoice tool appears farther down the page, beneath the payment-processing proposition.

That creates an unnecessary trust problem. Even with a completely legitimate affiliate disclosure, a first-time visitor can reasonably interpret the service as a merchant-account comparison and lead-generation site with an invoicing tool attached.

I would reverse it.

Current conceptual hierarchy:

```
CDG, then merchant-account education, then fee calculator, then invoicing
```

Recommended hierarchy:

```
Invoice, then client, then payment, then payment optimization, then CDG when appropriate
```

That one change makes the domain itself do far more work for you.

### Do not compete feature-for-feature with accounting software

A generic invoice application is now an extremely mature category. Zoho offers its invoice product free, while Square, PayPal, and Wave can already send invoices, collect online payments, and automate significant parts of the process. Stripe sells its own invoicing layer on top of payment processing.

Accordingly, I would not try to turn ClientBilling into QuickBooks, FreshBooks, or Zoho. Do not build full double-entry accounting, payroll, bank reconciliation, inventory, expense management, and every other back-office feature.

Build the narrower object that the name describes exceptionally well: everything from "I need to charge this client" through "the money has arrived and the invoice is reconciled."

That means ClientBilling owns the receivable, while accounting systems remain downstream destinations.

### There is also an important CDG overlap

CDG itself already supplies invoicing. Its current site says its service-business offering includes invoicing, SMS and email payment reminders, recurring billing, virtual terminals, and fast deposits. Its B2B offering includes invoicing, recurring billing, and Level 2 and 3 processing. CDG also says its invoicing solution lets merchants brand invoices, track them in an online dashboard, and let customers pay from the email.

That means simply implementing "ClientBilling invoice plus CDG Pay button" is not enough differentiation. You would effectively be rebuilding a prettier front end for a feature your payment partner already has.

The independent value needs to be: ClientBilling owns the invoice record, customer experience, automation, and intelligence; payment providers merely settle the money.

That distinction becomes especially valuable when you later add ACH, another processor, stablecoins, or agent-to-agent payments.

## The niche I would pursue

### Start with client-service businesses, not "everyone who invoices"

The fastest revenue niche is not microbusinesses sending a few $200 invoices. It is U.S. businesses that already invoice clients and process enough money for merchant-processing economics to matter.

CDG says interchange-plus is designed for businesses processing roughly $10,000 to $200,000 per month, while its simple-pricing tier targets approximately $1,000 to $10,000 and wholesale pricing targets larger merchants (`src/lib/cdg.ts`). Its industry offerings explicitly target service businesses and B2B companies with invoicing, recurring billing, and payment features; B2B merchants can also use Level 2 and 3 processing.

That points toward an excellent initial customer profile: agencies, consultants, IT and MSPs, contractors, professional services firms, wholesalers, and other businesses billing clients approximately $10,000 to $200,000 per month.

These companies are much more attractive than a giant population of hobbyists because one converted merchant can create recurring processing economics month after month.

They also have invoice problems that are more interesting than "make a PDF": estimates becoming invoices; deposits and milestone billing; retainers and recurring invoices; several people at the client approving an invoice; PO and reference numbers; late-payment reminders; ACH versus card decisions; paying one invoice using multiple methods; reconciliation; recurring cards or accounts on file; a need to know exactly who viewed and approved what.

CDG is already oriented toward service and B2B businesses, making this a much cleaner fit with the existing relationship. This matches decision 0003.

### The differentiator should be "smart client billing"

I would make the killer feature payment-aware invoicing.

When a business creates an invoice, ClientBilling knows the invoice amount, the customer, whether it is recurring, the merchant's monthly payment volume, the average ticket, how quickly they need settlement, and the available payment methods.

The system can therefore say something like:

```
$7,850 invoice
ACH recommended for lowest acceptance cost.
Card also available for convenience.
Customer can choose at checkout.
```

Or:

```
You are now processing approximately $24,000 a month by card.
Your present payment setup may no longer be the cheapest fit.
Compare merchant-account pricing.
```

That is precisely where the CDG conversion belongs. It is vastly more natural than asking someone arriving at ClientBilling.com whether they want a merchant-account quote before they have used the billing product.

### Then add "ClientBilling for Agents"

This is where there is a potentially much bigger long-term opportunity.

Agentic payments have moved beyond a hypothetical concept. Google's Agent Payments Protocol, AP2, was introduced as an open framework for agents to transact across payment methods, including cards, real-time bank transfers, and stablecoins. Its design explicitly deals with authorization, authenticity, and accountability when an AI agent initiates a transaction. In April 2026, Google transferred AP2 to the FIDO Alliance to keep it platform-neutral and community-led; AP2 v0.2 added support for autonomous "Human Not Present" transactions based on previously authorized instructions. Visa is likewise now explicitly framing commerce around the possibility that a business's next customer may be an AI agent and is working with OpenAI on agentic commerce. (Unverified by the agent; see editor's note 3.)

That suggests a much stronger interpretation of "billing software for agents" than making a special invoice template: give every AI agent an accounts-receivable API.

An agent should be able to ask ClientBilling to:

```
create_invoice
get_invoice
send_invoice
create_payment_request
get_payment_status
list_overdue_invoices
send_payment_reminder
create_recurring_invoice
record_external_payment
create_credit_note
get_customer_balance
issue_receipt
```

Then expose the same actions as REST API plus SDK plus MCP server plus webhooks.

A normal customer sees a beautiful invoice webpage or PDF. Another software agent sees structured invoice JSON. An accounting system sees an event. A payment provider sees a charge or payment request.

The v1 API already covers create, get, list, send, remind, status, and payments. The rest is roadmap.

### Do not make the entire brand "AI invoicing"

I would still lead with ordinary businesses. "AI agent billing" is exciting, but forcing every accountant, consultant, and contractor to understand agentic payments before using ClientBilling would hurt the simple utility of the domain.

Instead:

```
ClientBilling
Invoicing and payments for client businesses.

Building with agents? Use the ClientBilling API.
```

Navigation could include a conspicuous For Developers or For Agents section without making the general product look experimental. That provides a stable mainstream business and a high-upside technology wedge simultaneously.

## Payments, microtransactions, crypto, and recurring revenue

### CDG should become an integrated monetization layer

The current CDG relationship remains valuable. CDG supports multiple gateways, including its Quantum Gateway and third-party gateways such as Authorize.net and NMI, as well as recurring billing and custom integration options. Its current site says it supports hundreds of technology integrations.

I would try to move the relationship from affiliate link to embedded reseller or agent economics wherever contractually possible. (This requires reopening decision 0014.)

CDG has a public reseller presence, but there is no public current documentation stating exactly what percentage of processing revenue CDG pays, how long residuals survive, whether residuals vest, or what happens after termination. Therefore, do not build financial forecasts assuming lifetime or perpetual CDG revenue until those terms are in a signed reseller agreement.

That contract is probably the most important business-development item in this entire project. Written answers are needed to:

| Contract issue | What you need to know |
| --- | --- |
| Residual formula | Percentage or share of what exact revenue or markup? |
| Duration | Paid while the merchant processes, a fixed term, or something else? |
| Post-termination | Do residuals survive if ClientBilling ends the agreement? |
| Vesting | Do rights become irrevocable after a period or merchant count? |
| Portfolio ownership | Can CDG solicit or reassign ClientBilling merchants? |
| Clawbacks | What can reduce previously earned amounts? |
| Additional products | Do ACH, gateway, equipment, and recurring billing create commission? |
| Attribution | How is a ClientBilling merchant permanently identified? |
| Reporting | API or export for merchants, volume, and monthly residuals? |
| Integration | Can ClientBilling pre-fill or embed onboarding and receive status webhooks? |

The difference between a simple affiliate program and a protected residual portfolio could ultimately be worth far more than adding another dozen invoicing features.

### Authorize.net is particularly interesting

There is a second partnership worth investigating.

Authorize.net has a public reseller program, and unlike most SaaS affiliate pages, its economics are unusually explicit: a reseller gets a buy rate, sets the merchant's sell rate, and receives the difference as a monthly residual. Authorize.net says it pays those residuals monthly after merchant fees are collected and that joining the partner program carries no cost. It also handles merchant support and billing for the reseller. It additionally has a technology-partner path for developers integrating its payment technology. (Unverified by the agent.)

That is almost tailor-made for a product like ClientBilling.

There is one catch: Authorize.net's public reseller program is for its gateway, not the underlying merchant account; the reseller must separately work with an ISO or merchant-services provider.

That creates a question worth taking directly to CDG: can ClientBilling hold an Authorize.net reseller account and receive gateway residuals on a ClientBilling merchant while CDG supplies that merchant's underlying processing account?

Do not assume the answer is yes. CDG already supplies Authorize.net as one of its gateway options, so the agreements could conflict or the economics could already be bundled into CDG's arrangement. But if CDG approves this structure, there could be a two-layer relationship: processing economics through CDG and gateway economics through an Authorize.net reseller portfolio.

Even if stacking is prohibited, the Authorize.net program is a good second route for ClientBilling merchants whose payment processing comes from another provider.

### "Perpetual affiliate" SaaS programs are less attractive than they sound

I would not turn ClientBilling into a directory stuffed with affiliate offers.

For comparison, Zoho's current affiliate proposition pays 15% of revenue from a qualified sale during the first 12 months, not perpetually. HighLevel's affiliate documentation currently promotes a 40% commission and describes it as passive, recurring income; HighLevel itself now includes CRM, estimates, proposals, invoicing, and payment integrations. (Both unverified by the agent.)

That makes HighLevel an interesting contextual affiliate for ClientBilling users who eventually need a full agency CRM and marketing system, but a bad primary integration, because it would send the best agency customers to a platform that also offers invoicing.

Order of preference: payment residuals, then ClientBilling subscriptions and API revenue, then carefully selected recurring referrals, then one-time affiliate bounties. The first two create an actual asset. The last one mostly creates traffic arbitrage.

### Card networks are the wrong rail for true microtransactions

The instinct about microtransactions is correct.

CDG's small-business online flat-rate pricing is 3.50% + $0.30 per transaction (`src/lib/cdg.ts`). At that schedule:

| Payment | Approx. fee | Percentage of payment |
| --- | --- | --- |
| $0.25 | $0.309 | 123.5% |
| $0.50 | $0.318 | 63.5% |
| $1.00 | $0.335 | 33.5% |
| $2.00 | $0.370 | 18.5% |
| $5.00 | $0.475 | 9.5% |
| $10.00 | $0.650 | 6.5% |

Those figures are the published percentage plus fixed fee applied mathematically; they exclude any negotiated arrangement. The point stands: a fixed 30-cent card fee makes $0.10, $0.50, and $1 machine-to-machine payments nonsensical.

That is where crypto and stablecoin technology becomes genuinely useful rather than decorative.

### x402 is the microtransaction opportunity to investigate

x402 is an open HTTP-native payment protocol suited to machine payments. Coinbase's developer documentation describes x402 as allowing a server to charge for a resource in the same request used to fetch it rather than requiring the customer to establish a conventional account and checkout flow. The x402 Foundation says the protocol has zero protocol fees, leaving only underlying network costs; it is designed for low-cost digital-service payments, APIs, agentic commerce, and other situations where conventional payment methods are too slow or expensive. Its May 2026 batch-settlement work targets very high-velocity transactions down to fractions of a cent, and it reports tens of millions of transactions in a recent 30-day window. AP2 supports stablecoins and has a production-oriented x402 extension for agent-based crypto payments. (All unverified by the agent.)

This gives ClientBilling an elegant split.

Traditional client invoice:

```
Invoice -> card or ACH -> CDG or Authorize.net -> bank account
```

Agent or API invoice:

```
HTTP request -> x402 price and payment -> USDC or stablecoin settlement -> ClientBilling receipt and reconciliation
```

Same billing ledger. Different rail. That is a real product idea.

### Crypto should be a payment rail, not the brand

Do not rebrand ClientBilling as a crypto invoicing company. No tokens. No speculative cryptocurrency homepage. No requirement for ordinary contractors to understand wallets.

Instead, an invoice might simply show:

```
Pay by
  Bank / ACH
  Card
  Stablecoin
```

And the machine API can negotiate x402 automatically. This protects the mainstream value of ClientBilling.com while giving the developer side a superior mechanism for tiny transactions.

Hard line, from `docs/mission/compliance-boundary.md`: ClientBilling does not take custody of customer funds on any rail. It creates payment instructions, calls licensed payment infrastructure, and listens to settlement webhooks. Before introducing custody, conversion, pooled funds, or a percentage-of-funds payment-facilitation model, obtain specialized payments counsel. This is the same posture that keeps card data outside ClientBilling today.

## Product and experience blueprint

### The free product needs to be good enough to stand alone

"Free" should not mean "toy invoice generator." At minimum, the human product should cover the receivables lifecycle:

| Area | Recommended capability | Status 2026-09-18 |
| --- | --- | --- |
| Clients | Contacts, billing details, tax and business IDs, notes | Shipped (no tax IDs yet) |
| Estimates | Create estimate, approve, one-click convert to invoice | Not started |
| Invoices | Items, quantity, tax, discount, due date, PO or reference, notes | Shipped (no discount or PO field yet) |
| Billing structures | Deposit, milestone, recurring, partial payment | Recurring and partial shipped; deposit and milestone workflows not started |
| Delivery | Email, shareable secure URL, PDF | Shipped |
| Tracking | Draft, sent, viewed, approved, partially paid, paid, overdue, void | Shipped except "approved" |
| Collections | Automatic reminders and configurable dunning | Manual reminders and overdue sweep shipped; schedules not started |
| Payments | ACH, card, external or manual payment, stablecoin where enabled | Manual payment records and merchant pay link shipped |
| Customer experience | Client portal containing open and historical invoices | Not started (roadmap P2) |
| Records | Receipts, credit notes, refunds and status | Not started |
| Reporting | Outstanding A/R, aging, paid volume, average days to pay | Aging tiles shipped; the rest not started |
| Portability | CSV export and eventual accounting integrations | Not started (roadmap P1) |

Zoho's free offering already contains many of these, so ClientBilling cannot stop at line items and PDFs and expect "free" alone to attract lasting usage. The differentiation comes from what happens after those fundamentals.

### Build a payment-rail abstraction

Internally, do not write `invoice.pay_with_cdg()`. Conceptually, build:

```
invoice
  payment_request
    card
    ACH
    x402 / stablecoin
    external payment link
    manual payment
```

Each payment connector implements common functions:

```
create_payment_session()
get_status()
refund()
cancel()
handle_webhook()
get_fee_estimate()
```

This prevents ClientBilling from being architecturally trapped inside the first affiliate relationship while still allowing CDG to be the preferred commercial provider. CDG itself supports multiple gateways and custom integrations, so provider abstraction is compatible with the ecosystem rather than fighting it. The existing pay link and manual payment record are the first two connectors in this shape.

### Add a "Payment Optimizer"

This could become ClientBilling's signature feature.

The user enters, or ClientBilling learns from payment records:

```
Monthly volume:      $42,000
Average invoice:      $2,100
Invoices a month:         20
Card share:              35%
ACH share:               65%
Recurring:               Yes
Business:             Agency
```

ClientBilling then says: your clients mostly pay high-value invoices; ACH should be the default low-cost rail; keep cards available for speed and convenience. And, where supported by real numbers: your card volume has crossed the point where interchange-plus merchant pricing may warrant comparison.

CDG's own segmentation distinguishes its $1K to $10K, $10K to $200K, and higher-volume customers, so a volume-aware recommendation fits how the existing partner prices accounts. Then "Get an exact processing quote" becomes a contextual commercial conversion. That feels like the software helping the business, rather than a website trying to sell the business something.

### The agent product should use the same ledger

Do not build "AgentBilling" as a separate application. An invoice is the same underlying object whether created by a person in a browser or by an AI agent over MCP:

```json
{
  "invoice_id": "inv_01J...",
  "seller": "Acme AI Research LLC",
  "customer": "Example Corp",
  "currency": "USD",
  "line_items": [
    { "description": "Document-analysis API usage", "quantity": 18432, "unit": "request", "amount": 0.002 }
  ],
  "amount_due": 36.864,
  "payment_methods": ["x402", "ach", "card"],
  "due_at": "2026-09-30T23:59:59Z"
}
```

Human presentation can round or aggregate according to currency and accounting requirements while the underlying usage ledger retains more precise metering.

For autonomous agents, add: identity (who or what created the obligation); authority (which company or user authorized the agent); budget (maximum amount per transaction, day, or vendor); idempotency (an agent retry must not produce ten invoices); approval rules (autonomous below a threshold, human approval above it); an audit trail from request to authorization to invoice to payment to receipt; signed payment requests so the recipient knows the amount and payee were not altered; and webhooks for viewed, authorized, settled, failed, and overdue.

Those controls match the authorization and accountability issues AP2 is designed to solve.

### Usage billing is a particularly good agent niche

The unusual opportunity is not an AI agent emailing a conventional $1,000 PDF invoice. It is:

```
Agent A asks Agent B for a service.
Agent B says it costs $0.004.
Agent A is authorized to spend up to $2 a day with B.
Payment occurs.
Both organizations get machine-readable receipts.
ClientBilling rolls everything into a human-readable month-end statement.
```

That bridges micropayments and accounting, which is a much more valuable product than merely moving stablecoins. x402 handles the payment event. ClientBilling owns metering, the commercial record, policy, receipts, aggregation, reporting, and reconciliation.

### The visual identity should become quieter, more premium, and product-led

The design should feel more like a financial utility and less like an affiliate comparison property.

A proposed homepage:

```
Bill clients. Get paid.
Free invoicing for businesses. Payment infrastructure for agents.

Create professional invoices, track every payment, and use the payment
method that makes sense for each transaction.

[Create an invoice, free]   [Connect payments]
```

Then a large product screenshot: invoice on the right, receivables dashboard behind it. Below it, a live-looking summary such as "$84,320 invoiced, $71,200 paid, $13,120 outstanding" (illustrative, never a fabricated customer figure on the real page). Then three propositions: Send (invoices, estimates, recurring bills); Collect (ACH, cards, modern payment rails); Automate (reminders, APIs, agents). Only later: "Processing a lot by card? Compare your payment costs." That is where CDG appears.

Navigation: Invoices, Payments, For Agents, Developers, Guides, Sign in.

CDG stops being a first-class brand in the hero. It remains a prominent payment option and content topic, and the affiliate disclosure remains explicit; the current site is right to disclose the financial relationship.

## Monetization and business economics

### The important unit is not "free accounts"; it is payment volume

Free users are acquisition. The valuable cohort is active businesses times monthly payment volume times the economics retained by ClientBilling.

Illustration only. Suppose a merchant has $50,000 a month of online card volume with roughly 667 transactions. Using CDG's displayed interchange-plus markup of 0.35% + $0.15 (`src/lib/cdg.ts`), the processor markup above interchange is about $50,000 x 0.0035 + 667 x $0.15, roughly $275 per merchant-month, before costs, deductions, and any contractual split.

That is not a prediction of commission. The CDG agreement determines what portion, if any, of that pool belongs to ClientBilling. If a contract entitled ClientBilling to, purely hypothetically, 25% of an eligible $275 pool, that merchant would represent about $69 a month; at a hypothetical 50%, about $138. At 100 such merchants, roughly $6,900 to $13,800 a month. Those percentages are examples, not CDG's compensation, because the reseller split is not public. That is why the reseller agreement should be settled before spending heavily on an integration.

### The business model I would use

Do not force a paid software subscription on everyone.

Free: unlimited basic invoicing, clients, PDFs and share links, payment tracking, basic reminders, ClientBilling-hosted invoice pages. The objective is distribution and payment volume.

ClientBilling Pro, roughly $15 to $25 a month: recurring invoices, advanced reminders, custom branding, custom sender domain, estimates, deposits, milestones, richer reports, multiple users, accounting exports. (Editor: conflicts with 0010; see note 1. Several of these are already free and should stay free.)

ClientBilling Agent/API, perhaps $49 to $99 a month plus usage: REST API, MCP, webhooks, usage metering, agent credentials, spending and collection policies, x402 support, signed machine receipts, aggregated settlement and reconciliation.

Those prices are product recommendations, not researched competitor quotes. The principle is that human invoices can remain free because payment residuals subsidize them, while machine automation is valuable enough to charge for independently. That protects the business if payment-affiliate economics ever change.

### A very powerful flywheel appears

```
Free invoices
  -> businesses put real customers into ClientBilling
  -> invoices become payment volume
  -> ClientBilling sees actual billing behavior
  -> recommend economically appropriate payment rails
  -> some merchants convert to CDG or gateway relationships
  -> recurring residual income
  -> the free product becomes sustainable
  -> more users and payment volume
```

The developer product adds a second loop:

```
Agent and API developers
  -> create machine payment requests
  -> x402 plus conventional invoice aggregation
  -> more billable events
  -> paid ClientBilling API usage
  -> more integrations
```

The domain is broad enough to plausibly own both.

## What I would build and hand off

A development brief that begins with this sentence:

Build ClientBilling as a processor-neutral receivables platform: free invoicing for client businesses, smart payment selection, and an API and MCP billing layer for software agents. CDG Commerce is the preferred merchant-account monetization partner, not the product itself.

Then four releases. (Editor: see note 2 for what is already done.)

### First release: make ClientBilling legitimately useful

Finish the normal billing lifecycle: client, estimate, invoice, send, viewed, reminder, payment, receipt. Add estimates, deposits and milestones, automatic reminders, client portal, a sensible A/R dashboard, and CSV exports. Do not wait for payment processing before making this useful.

The success test: would an agency or consultant genuinely use ClientBilling every month even if the site never showed them a CDG link? If the answer is no, the free product is not yet good enough.

### Second release: turn payments into the revenue engine

Build the provider abstraction and the CDG payment integration, and negotiate the formal commercial and technical relationship with CDG at the same time. The preferred customer experience is "Enable online payments" rather than "Go apply for a merchant account." The user provides information once and ClientBilling knows the application state: not started, submitted, underwriting, approved, connected. Whether CDG's systems permit that embedded experience needs to be agreed with CDG. Add the Payment Optimizer at this stage. Approach Authorize.net about reseller or technology-partner status. (Editor: blocked by 0014 except the optimizer.)

### Third release: make the API a first-class product

Everything the UI can do gets an API representation. Then release SDKs, webhooks, API keys or OAuth, idempotency, and an MCP server. The site gains a For Agents page with a five-minute demo: agent creates invoice, invoice appears in the normal dashboard, client pays, agent receives a settlement webhook. That demonstration explains why ClientBilling differs from an invoice-generator site.

### Fourth release: machine billing and x402

Add usage meters, invoice aggregation, x402 payment requests, receipts, and reconciliation. Do not run blockchain infrastructure unless there is a compelling economic reason; x402 provides a standardized internet-native payment interface, and AP2 is developing the authorization layer around autonomous transactions.

A developer says "charge $0.003 for this endpoint" while an accounting manager sees:

```
OpenAI Research Agent
September usage
31,842 requests
$95.53 paid
412 x402 settlements
Reconciled
```

That juxtaposition, machine economics converted into normal client billing records, is the most compelling piece.

## What I would deliberately not build

- A full accounting suite.
- Crypto at the center of the brand.
- One-time affiliate bounties as a business.
- ClientBilling hard-coded around CDG.
- Card processing for penny-scale machine payments.
- A homepage that is primarily a comparison and review site.
- Giving away an unusually strong domain's customer relationship by sending users elsewhere before ClientBilling itself has become useful.

## Recommended final positioning

The broad brand:

```
ClientBilling
Bill clients. Get paid.

Free invoicing and payment tracking for businesses.
Smart payment options when you're ready to get paid.
```

The developer product:

```
ClientBilling for Agents
Give every agent an accounts-receivable API.

Create invoices, meter services, request payment, receive settlement
events, and reconcile transactions through one billing ledger.
```

These are not two unrelated businesses. A human consultant bills a client $5,000. A SaaS company bills a client $2,000 based on usage. An AI agent bills another company $0.08 for a task. An API bills another agent $0.002 per request. They are all versions of the same event: a party provided value to a client and needs to document, collect, and reconcile what it is owed.

That is the territory ClientBilling.com ought to own. The strongest recommendation, therefore, is not to turn the domain into a better CDG affiliate site. Turn it into the billing system that creates the payment relationship in the first place. Then use CDG residuals, Authorize.net-style reseller economics, paid agent and API services, and eventually internet-native micropayments to monetize the financial activity flowing through that relationship.
