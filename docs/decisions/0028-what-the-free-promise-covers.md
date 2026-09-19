# 0028: What the free promise covers

Status: Accepted 2026-09-19. Clarifies 0022. Raised by issue #69 and the review of #63 and #64.

## Context

0022 says, under Terms:

> The 30-day notice promise in the terms of service covers the introduction of the Machine tier. Nothing that is free today becomes paid for existing accounts.

Read inside 0022 that sentence is narrow. The same decision lists what is free under "Human invoicing stays free", and puts the machine surface in the paid set by name: "A Machine tier covers the production REST API with idempotent writes, signed webhooks, remote MCP, service-account actor identities, the proof API with inclusion bundles, and higher quotas." Line 28 scopes the older 0010 promise the same way: "every invoicing feature is free for every account" stands **for people**.

Read on its own the sentence is broad. It says "nothing", not "no invoicing feature". Personal API keys and a REST surface already existed and were free when 0022 was accepted on 2026-09-18, so the API was literally free on that date for accounts that existed then. A reader quoting the sentence alone reaches the broad result without straining, and 0027 widened what "free today" covers by making live keys unrestricted for now.

This matters because `/developers/invoicing-api-for-agents` published "Live keys are unrestricted until the Machine tier is enforced". That sentence was also factually wrong: live keys carry 120 requests a minute. PR #73 corrects the factual error and softens the promise to notice only, which is safe under either reading. What is not safe is leaving the 0022 sentence open to the broad reading while machine pricing is still unset.

The internal evidence favours the narrow reading: both 0026 and 0027 treat enforcing production write quotas as planned follow-up work, which is incoherent if every existing account is grandfathered out of it.

## Decision

"Nothing that is free today becomes paid for existing accounts" (0022) applies to the human invoicing product listed under "Human invoicing stays free" and to the proof seal. It does not apply to machine access: the REST API, MCP, webhooks, service accounts, or write quotas on live keys.

When the Machine tier launches, every account, including those created before launch, receives the 30-day notice in the terms and is then subject to Machine-tier quotas and pricing. The free test-key allowance remains.

Public copy may describe current live-key limits as they stand today. Such copy promises notice, not continuation.

Test keys do not send email. A `cb_test_` key is refused on any tool or endpoint that would email a client, because the one irreversible thing a developer can do while testing is contact someone else's customer. Everything else a test key does is reversible by the account owner.

## Reasons

The narrow reading keeps the business model 0022 describes. The broad reading would mean the Machine tier can never charge any account that exists today for API or MCP usage, because 0027 already made live keys unrestricted, so "higher quotas" would have nothing to be higher than. That removes the early cohort from the revenue engine 0022 projects most recurring revenue from, and rewards signing up before launch purely to be grandfathered.

The decisive evidence is internal: 0026 and 0027 both plan to enforce production write quotas. That work could never apply to any existing account under the broad reading, so two accepted decisions would be planning something the promise forbade.

This costs honesty work. Every public sentence about machine limits now promises notice rather than continuation, which reads less generously on a developer landing than "unrestricted" did. That is the right trade: a stated 30 days is a real commitment, where "unrestricted" was both false (live keys carry 120 requests a minute) and a promise nobody approved.

The email rule is narrower than isolation and answers the only irreversible risk. A test key writing a draft or recording a payment is reversible by the owner. A test key emailing someone's client is not, and a developer who assumes "test" means a separate dataset will do exactly that. Blocking the send is small, and it does not foreclose real isolation later.

## Consequences

The copy in PR #73 stands as written. This record is what a reader is pointed at if they quote 0022's sentence back.

Sends are refused for `cb_test_` keys on the REST send and remind endpoints and on the `send_invoice` and `send_reminder` MCP tools, with an error naming the reason. Creating, voiding, and recording payments are unchanged.

The public terms still say "The app is free today. If that changes, we will announce it at least 30 days in advance and existing invoices will stay accessible." This decision leaves that true, so no legal-page edit is needed.

Real test and live data isolation is not decided here. If it is ever wanted, the cheapest moment is before the proof engine anchors the event log, because retrofitting a live/test split into an append-only hash chain afterwards is materially harder.

## Revisit

When Machine-tier pricing is set: confirm the 30-day notice goes to every account, including those created before launch. Also revisit if a developer asks for a way to test the send path, which the email rule deliberately forecloses.
