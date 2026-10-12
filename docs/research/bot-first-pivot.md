# Bot-first pivot research: ClientBilling.com

Date: 2026-10-12. Status: research only, nothing built. Every external claim below links to its source. Numbers are the sources' own figures and have not been independently verified.

## TL;DR

Recommendation: **become the neutral, guarded invoicing back office that any AI agent can operate for a freelancer or small agency.** Keep the human UI as it is: it becomes the place the owner approves, audits and revokes. Add a clearly separate bot path: `/agents`, `llms.txt`, OpenAPI, a remote MCP endpoint, scoped keys, approval thresholds, an audit log and idempotency. Payments stay on the merchant's own rails (PayPal.me, Stripe link, bank details, optionally x402 later). We never hold funds and are never merchant of record, consistent with decision 0014.

## 1. What the research says about how agents find and use tools

- **MCP is the default integration surface.** One paper cites more than 10,000 active servers and 97M monthly SDK downloads as of early 2026. It also argues the spec still lacks identity propagation, tool budgeting and structured error semantics, which leaves those for servers to provide. https://arxiv.org/pdf/2603.13417
- **Tool description quality changes outcomes.** A study of 856 tools across 103 MCP servers found 97.1% had at least one description "smell", and 56% did not state their purpose clearly. Better descriptions raised task success by a median of 5.85 pp, but they added steps and sometimes made results worse, so compact descriptions matter. https://www.arxiv.org/pdf/2602.14878
- **Fewer, outcome-oriented tools work better.** One write-up reports that GitHub Copilot cut its tools from 40 to 13 and saw benchmark gains, and that Block cut a Linear MCP from 30+ tools to 2. https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc
- **llms.txt helps coding agents and has no effect on search.** IDE agents such as Cursor, Claude Code and Copilot fetch `/llms.txt`. Of 500M AI-bot visits, only 408 requested it, and a 300k-domain study found about 10% adoption. https://limy.ai/blog/llms-txt-in-2026-the-full-guide . Chrome Lighthouse added an llms.txt audit under "agentic browsing" in May 2026. The same source recommends mirroring the file at `/.well-known/llms.txt` and announcing it with a `Link` header. https://www.digitalapplied.com/blog/llms-txt-in-practice-adoption-evidence-2026 . Cost is about half a day, so do it, with no SEO expectations.
- **Agent auth means OAuth 2.1 for remote MCP.** The server acts as a resource server and must publish Protected Resource Metadata (RFC 9728). Clients use PKCE and resource indicators (RFC 8707), and tokens must be audience-bound. https://mcp.mintlify.app/specification/2025-06-18/basic/authorization
- **Agentic payment protocols are layers that complement each other:**
  - ACP (Stripe, OpenAI and Meta) covers checkout for purchases by agents. https://docs.stripe.com/agentic-commerce/acp , https://github.com/agentic-commerce-protocol/agentic-commerce-protocol
  - Google AP2 uses signed Checkout and Payment Mandates to prove what a user authorized, including autonomous "human not present" mode. It launched with 60+ partners, among them PayPal, Mastercard, Intuit and Coinbase. https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol , https://github.com/google-agentic-commerce/ap2/blob/main/docs/ap2/specification.md
  - x402 is HTTP 402 stablecoin settlement. It now sits with a foundation of 40 members, and Chainalysis counted more than 100M cumulative transactions on Base through Q1 2026. https://www.fireblocks.com/blog/agentic-payment-protocols-compared
  - Visa has an MCP server and an Acceptance Agent Toolkit. https://corporate.visa.com/en/sites/visa-perspectives/innovation/visa-mcp-server-agent-acceptance-toolkit.html
  - Mastercard Agent Pay uses registered agents, agentic tokens and Web Bot Auth (RFC 9421). https://www.mastercard.com/us/en/news-and-trends/press/2025/april/mastercard-unveils-agent-pay-pioneering-agentic-payments-technology-to-power-commerce-in-the-age-of-ai.html , https://www.mastercard.com/ge/en/news-and-trends/stories/2025/agentic-commerce-framework.html
- **The common guardrail pattern across agent-money products** is per-agent spending limits, mandates or budgets, expiry, one-click revoke, approvals and an audit trail. Nevermined, Skyfire and Payman all market this. https://paywithlocus.com/guides/agentic-payment-platforms
- **Practitioner guidance for accounting MCPs:** start read-only, scope OAuth, and require human approval for creating or sending invoices and for payment writes. https://top-mcps.com/guides/best-mcps-for-invoicing-and-accounting

**Takeaway:** agents succeed when they get a few well-described tools, structured retryable errors, idempotent writes and scoped identity. Owners let agents touch money only behind limits, approvals and an audit log. Those are product features, not plumbing.

## 2. Competitors and gaps

| Player | Agent surface | Gap we could fill |
|---|---|---|
| Stripe MCP / agent toolkit | Official MCP for customers, invoices and subscriptions (https://growthengineer.ai/mcp-servers?category=Payments) | Requires Stripe as processor. It is a payments tool, not a ledger, and has no owner-approval layer aimed at freelancers. |
| QuickBooks Online (Intuit) | Official MCP with 145 tools across 29 entities (https://github.com/intuit/quickbooks-online-mcp-server) | 145 tools is the over-tooling anti-pattern. Setup needs an Intuit developer app and OAuth, and the product is paid ($38+/mo per https://www.usecarly.com/blog/best-ai-automation-tools-freshbooks/). |
| Xero | Official MCP and the JAX assistant (same sources) | Paid ledger, and the agent is Xero's own. |
| FreshBooks | 24-tool MCP. Its official Claude connector is read-only (https://crox.io/servers/finance-accounting/ , https://www.usecarly.com/blog/best-ai-automation-tools-freshbooks/) | No write access for agents. |
| Zoho Books | Official MCP (growthengineer directory) | Heavy suite. |
| Paid.ai, Orb, Metronome, Lago | Usage, outcome and metered billing for companies selling AI (https://nevermined.ai/blog/paid-ai-vs-orb-vs-metronome) | Built for AI vendors billing their customers, not for freelancers billing clients. |
| Nevermined, Skyfire, Payman, Locus | Agent payment authority, x402/MPP and mandates (https://nevermined.ai/docs/getting-started/core-concepts , https://paywithlocus.com/guides/agentic-payment-platforms) | Payment rails, not invoicing or accounts receivable. |

**Open gap:** a **free, processor-agnostic, write-capable invoicing/AR MCP with built-in owner guardrails** (approval thresholds, a per-agent audit log, idempotency and revoke), small enough for a solo operator to connect in one click. Nobody in this list positions on "safe to let your agent bill your clients."

## 3. Business ideas (ranked)

What already exists in the repo: Prisma models User, BusinessProfile, Client, Invoice, InvoiceLineItem, RecurringSchedule, Payment, InvoiceEvent, Event, ApiKey and RateLimit. The v1 REST API covers clients, invoices, send, remind, status and payments (`src/app/api/v1/**`). There are public `/i` pay pages and PayPal.me prefill in `src/lib/pay-link.ts`, plus a `/docs` marketing route. Missing pieces: `ApiKey` has **no scopes or limits**, and there is **no idempotency, MCP endpoint, OpenAPI spec or llms.txt**.

1. **Agent-safe invoicing back office (recommended).** Freelancers and agencies already using Claude, ChatGPT, Cursor or n8n agents connect ClientBilling over MCP, and their agent drafts, sends, reminds and reconciles invoices within limits the owner sets. *Money:* the core stays free. Pro at about $9–19/mo adds more agents, higher approval limits, white-label pay pages and statement exports. A per-invoice fee for automated sends is an option. *Competition:* Stripe, QBO and Xero MCPs, all tied to their own ecosystem or paid. *Effort:* about 2–4 weeks. *Risk:* low on regulation since we're not MoR, but distribution is unproven.
2. **"Bill-on-behalf" for agent builders (B2B2C).** Developers building vertical agents (for contractors, tutors, VAs) embed our MCP so their agent can invoice their users' clients. This needs sub-accounts and OAuth. *Money:* per active billing account per month. *Competition:* Stripe Connect plus invoicing. *Effort:* about 4–6 weeks after #1. *Risk:* medium (KYC questions, abuse, spam invoices).
3. **Agents billing agents/humans for work done: outcome invoices.** An agent that did work (a report, a lead list) issues an invoice with evidence attached and a pay link, optionally including an x402 or USDC option. *Money:* small fee per paid invoice. *Competition:* Paid.ai and Nevermined, which target the AI vendor rather than the individual operator. *Effort:* medium. *Risk:* crypto and compliance perception, and the market is early.
4. **AR collections agent (owned product).** We run the agent ourselves: it watches overdue invoices, writes polite reminders and offers partial-payment plans, with approval before each send. *Money:* $/mo or a percentage of recovered amounts. *Competition:* Chaser, Upflow and QBO reminders. *Effort:* medium. *Risk:* deliverability and spam.
5. **Agent-readable billing benchmark / directory (content play).** Publish an "agent-ready billing tools" scorecard (MCP, llms.txt, auth, guardrails) using the existing SEO and methodology pages. *Money:* traffic to #1 and affiliate links (CDG and others). *Effort:* low. *Risk:* low, and the payoff is indirect.

Ranking: **1 > 4 > 2 > 5 > 3.** #1 is the foundation the others reuse. #4 is #1 with our own agent on top. #5 is cheap marketing for #1.

## 4. Recommended plan

### Agent-facing surface
- `/agents`: a human-readable page in the current design with a clear "If you're a bot, start here" box. It shows the MCP URL, auth, limits, a sample tool call and a link to OpenAPI.
- `/llms.txt` and `/.well-known/llms.txt`, with 20–50 curated links, plus a `Link: </llms.txt>; rel="llms-txt"` header. Optionally `/llms-full.txt`.
- `/api/v1/openapi.json`, generated from Zod schemas.
- `/mcp`: remote Streamable HTTP MCP endpoint. Phase 1 auth uses bearer API keys. Phase 2 adds OAuth 2.1 with RFC 9728 metadata at `/.well-known/oauth-protected-resource` and PKCE.
- **Scoped keys:** `scopes[]` (`clients:read`, `clients:write`, `invoices:read`, `invoices:draft`, `invoices:send`, `payments:write`), `agentName`, `maxInvoiceAmount`, `dailySendLimit`, `expiresAt`.
- **Approval queue:** a send above the threshold (or any send to a new client) returns `status: pending_approval` with an `approval_url`. The owner approves in the human UI or by an email link.
- **Audit log:** each call records key, agent name, tool, args hash, result and approval. It is visible in the dashboard and filterable per agent.
- **Idempotency:** the `Idempotency-Key` header and MCP arg are required on all writes and stored for 24h, so the same key returns the same result.
- **Structured errors:** `{code, message, retryable, hint, docs_url}`.
- **Dry run:** `dry_run: true` on send and remind returns the rendered email and the pay link.

### MCP tools (target about 10, outcome-oriented)
1. `find_or_create_client`: upserts by email.
2. `create_invoice`: creates a draft with line items, due date, currency and optional recurring settings. Returns a preview URL.
3. `send_invoice`: subject to approval limits, supports dry_run.
4. `list_invoices`: filters for status, overdue, client and date.
5. `get_invoice`: full detail plus pay link and payment history.
6. `record_payment`: covers partial payments.
7. `send_reminder`: supports dry_run.
8. `void_invoice`: reason required. This aligns with the roadmap item for voids.
9. `get_ar_summary`: outstanding, overdue buckets and top debtors.
10. `get_account_limits`: the current key's scopes, limits and pending approvals, so agents can plan before acting.

Each description follows the purpose / when to use / limits / params / one example rubric (arXiv 2602.14878), kept compact.

### First 2 weeks
- **Days 1–2:** ADR 0020 "bot-first surface". Prisma migration covering ApiKey scopes and limits plus new `IdempotencyRecord`, `AgentAction` (audit) and `ApprovalRequest` tables. Scope checks go into the v1 auth helper.
- **Days 3–4:** Idempotency middleware for v1 writes. Structured error format. OpenAPI generation.
- **Days 5–7:** `/mcp` endpoint using `@modelcontextprotocol/sdk` with Streamable HTTP, wrapping the existing v1 services with the 10 tools above. Test with Claude Desktop, Cursor and MCP Inspector.
- **Days 8–9:** Approval queue, with a dashboard page and an email approve link. Audit log UI per agent. Revoke button.
- **Day 10:** `/agents` page, llms.txt (plus the .well-known mirror and Link header), robots check for AI user agents, and a docs update.
- **Days 11–12:** Eval harness: about 20 scripted tasks run by an agent, such as "invoice Acme $1,200 for October and send it" or "who's overdue and remind them". Track success rate, steps and errors, then iterate on descriptions.
- **Days 13–14:** Submit to MCP directories (official registry, Smithery, the growthengineer and crox lists). Write a launch post: "the invoicing tool that's safe to hand your agent."

### Out of scope or later
OAuth 2.1 and dynamic client registration (week 3–4), sub-accounts (idea #2), x402/AP2 acceptance (idea #3; watch adoption), and Web Bot Auth verification.
