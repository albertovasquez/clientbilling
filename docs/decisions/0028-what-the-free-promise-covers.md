# 0028: What the free promise covers

Status: **Proposed. The founder decides.** Clarifies 0022. Raised by issue #69 and the review of #63 and #64.

## Context

0022 says, under Terms:

> The 30-day notice promise in the terms of service covers the introduction of the Machine tier. Nothing that is free today becomes paid for existing accounts.

Read inside 0022 that sentence is narrow. The same decision lists what is free under "Human invoicing stays free", and puts the machine surface in the paid set by name: "A Machine tier covers the production REST API with idempotent writes, signed webhooks, remote MCP, service-account actor identities, the proof API with inclusion bundles, and higher quotas." Line 28 scopes the older 0010 promise the same way: "every invoicing feature is free for every account" stands **for people**.

Read on its own the sentence is broad. It says "nothing", not "no invoicing feature". Personal API keys and a REST surface already existed and were free when 0022 was accepted on 2026-09-18, so the API was literally free on that date for accounts that existed then. A reader quoting the sentence alone reaches the broad result without straining, and 0027 widened what "free today" covers by making live keys unrestricted for now.

This matters because `/developers/invoicing-api-for-agents` published "Live keys are unrestricted until the Machine tier is enforced". That sentence was also factually wrong: live keys carry 120 requests a minute. PR #73 corrects the factual error and softens the promise to notice only, which is safe under either reading. What is not safe is leaving the 0022 sentence open to the broad reading while machine pricing is still unset.

The internal evidence favours the narrow reading: both 0026 and 0027 treat enforcing production write quotas as planned follow-up work, which is incoherent if every existing account is grandfathered out of it.

## Decision

**The founder picks one. Delete the other before this record is accepted.**

### Option A, narrow (recommended)

Clarifies 0022. "Nothing that is free today becomes paid for existing accounts" applies to the human invoicing product listed under "Human invoicing stays free" and to the proof seal. It does not apply to machine access: the REST API, MCP, webhooks, service accounts, or write quotas on live keys. When the Machine tier launches, every account, including those created before launch, receives the 30-day notice in the terms and is then subject to Machine-tier quotas and pricing. The free test-key allowance remains. Public copy may describe current live-key limits as they stand today; such copy promises notice, not continuation.

### Option B, broad

Clarifies 0022. "Nothing that is free today becomes paid for existing accounts" applies to every capability an account could use at no charge on 2026-09-19, including the REST API, MCP, webhooks, and live keys without a daily write quota. Accounts created before the Machine tier launch date keep that access at no charge for as long as the account exists. The Machine tier may charge those accounts only for capabilities introduced after that date. The terms page and the agent landing must state this grandfather explicitly before launch.

## Reasons

Narrow keeps the business model 0022 describes. Broad means the Machine tier can never charge any account that exists today for API or MCP usage, because 0027 already made live keys unrestricted, so "higher quotas" has nothing to be higher than. That removes the early cohort from the revenue engine 0022 projects most recurring revenue from, and creates an incentive to sign up before launch purely to be grandfathered.

Narrow costs honesty work: every public sentence about machine limits has to promise notice rather than continuation, which reads less generously on a developer landing. PR #73 already does that.

## Consequences

Under A: no code change. The copy in PR #73 stands as written. This record is the thing a reader is pointed at if they quote 0022's sentence back.

Under B: the terms page must state the grandfather before the Machine tier launches, and that is a stop-and-ask edit under the mission's legal-page rule. The agent landing must state it too. The Machine tier's revenue model needs revisiting, since its first cohort is exempt by construction.

Note that the public terms today promise less than either reading: "The app is free today. If that changes, we will announce it at least 30 days in advance and existing invoices will stay accessible." That is notice plus invoice access, with no grandfather of any feature. Option A leaves that line true. Option B makes it incomplete.

## Revisit

When Machine-tier pricing is set. If A was taken, confirm the 30-day notice goes to every account. If B was taken, confirm the terms and the landing state the grandfather before any charge exists.
