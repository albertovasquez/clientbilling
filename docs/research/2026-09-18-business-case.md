# ClientBilling.com business case: CDG residual lead-gen

Date: 2026-09-18  
Author: Bob (Grok Bot) for Alberto Vasquez  
Objective: Determine whether investing in ClientBilling as a search → tool/content → CDG referral → residual portfolio is economically rational, and define the shortest path to prove it.

Labels used throughout:

- **VERIFIED FACT** — stated on a named public page or measured on the live site
- **ESTIMATE** — derived from public numbers with arithmetic or industry ranges from named sources
- **ASSUMPTION** — not verified; must be stress-tested

---

## Executive recommendation

**Worth a small, time-boxed investment — not a large content farm — if and only if your CDG agent agreement pays lasting residuals on a disclosed Schedule A and your first experiment can produce applications from calculator/comparison traffic.**

| Question | Answer |
| --- | --- |
| Is the funnel shape right? | **Yes.** Soft quote → hard apply, www live, IC+ positioning matches CDG’s sweet spot. |
| Is the site already “done” for SEO/trust? | **Mostly for a young site.** Hub, methodology, author, scores, compares exist. Missing: fee calculator (the moat) and GSC. |
| Are CDG reseller economics public? | **No.** Partner signup exists; residual % and buy rates are behind the Agent Agreement. |
| Can this compound? | **Conditionally yes** at mid-volume IC+ merchants if residuals are lifetime and split is not thin. |
| Biggest risk? | Residuals that claw back, thin splits, or traffic that never converts past “curious about fees.” |
| What to become? | **A fee-transparency / processor-decision utility** that recommends CDG when it fits — not a generic affiliate blog. |

**Go / no-go gate (before months of content):** open your Agent Control Panel / agreement and write down residual split, buy rate, vesting, and clawbacks. Without that, every revenue table below is fiction with nice formatting.

---

## 1. ClientBilling today (audit)

Sources: live `https://www.clientbilling.com` (Sep 18, 2026), repo `docs/research/2026-09-17-traffic-gap-report.md`, `docs/seo/keyword-page-map.md`.

### What’s working

| Area | Observation | Label |
| --- | --- | --- |
| Positioning | “Get paid better… rates CDG publishes… decide with real numbers” + disclosed commission | VERIFIED FACT (homepage) |
| Domain / hosting | `www.clientbilling.com` serves 200; apex → www; HTTPS; Vercel auto-deploy from `main` | VERIFIED FACT |
| Performance | Homepage TTFB ~0.37s, total ~0.45s in one curl check | VERIFIED FACT (single sample) |
| Funnel | Quote CTA → `applynow/?R=470`; Apply → secure onlineapp with agentid=470 | VERIFIED FACT (`src/lib/site.ts`) |
| Trust | Methodology, author page, ratings/verdicts, Organization + Breadcrumb JSON-LD | VERIFIED FACT |
| Content | Review, pricing, vs Square/Stripe/Helcim, ecommerce vertical, channel hubs | VERIFIED FACT |
| Architecture | Clear money hub `/cdgcommerce`, get-started, volume bands matching CDG ($1K–10K / $10K–200K / $200K+) | VERIFIED FACT |

### What still reduces applications / SEO

| Issue | Why it matters | Label |
| --- | --- | --- |
| No fee calculator | Competitors and SERPs reward tools; CDG itself has no calculator — this is the differentiated lead magnet | ASSUMPTION on ranking impact; VERIFIED FACT that CDG has no calculator |
| GSC not confirmed in-repo | Without Search Console, you cannot see query demand or indexing | ASSUMPTION that owner has not verified; checklist remains |
| Early-stage domain authority | Brand-new domain vs Merchant Maverick / NerdWallet | ESTIMATE |
| Education posts still in catalog | Dunning/MRR content attracts wrong stage buyers if featured heavily | VERIFIED FACT posts exist; ESTIMATE on opportunity cost |
| Measurement gap | CTA events to console/dataLayer without GA4/GTM/Umami (Plausible declined) | VERIFIED FACT from gap report |
| Quote vs apply still confusing if mislabeled | Fixed in code; still must stay disciplined | VERIFIED FACT |

### Value proposition (as shipped)

Independent, numbers-first merchant-account guidance with a disclosed CDG partnership — strongest when the visitor is comparing **fees and contract**, not learning subscription metrics.

---

## 2. Merchant opportunity (who is worth targeting)

### CDG’s own volume segmentation

**VERIFIED FACT** (https://www.cdgcommerce.com/pricing/):

| Plan | Ideal monthly volume |
| --- | --- |
| Flat / Simple | $1K–$10K |
| Interchange Plus | $10K–$200K |
| Wholesale Membership | $200K+ |

**VERIFIED FACT** IC+ markups (https://www.cdgcommerce.com/pricing/interchange-plus-processing/):

- Online: interchange + **0.35% + $0.15**
- Retail: interchange + **0.30% + $0.10**
- Nonprofit: interchange + **0.25% + $0.10**
- No mandatory contract length / termination fee (CDG statement on that page)
- Typical approval 1–3 business days (CDG statement)

### Who creates better residual economics

Residuals scale with **card volume × processor markup × agent split**. Holding split fixed:

| Segment | Volume | Residual quality | Fit with ClientBilling |
| --- | --- | --- | --- |
| Sub-$10K / Square refugees | Low | Thin $ residual | Easy CTA, weak LTV |
| **$10K–$100K ecommerce / services / B2B** | Mid | **Best target** | Matches IC+ + fee-calculator intent |
| $100K–$200K | High | Strong | Needs more sales-assist; still IC+ |
| $200K+ wholesale | Highest volume | Membership economics differ; thinner per-$ markup, volume caps | Harder SEO close; phone-heavy |
| Pure SaaS on Stripe Billing | Mixed | May stay on Stripe for product reasons | Compare carefully; don’t oversell |
| Restaurants / retail CP | Good | Retail IC+ markup lower (0.30%) but volume can be high | Vertical pages + POS story |
| Nonprofits | Niche | Published lower IC+ markup | Differentiator if you can reach them |

**ESTIMATE:** A merchant at $50K/mo CNP generates ~5× the processor markup dollars of a $10K/mo merchant at the same basis-point markup — so mid/high volume dominates portfolio value.

**ASSUMPTION:** Your agent deal pays on net processing revenue (not flat CPA only). Confirm in agreement.

---

## 3. CDGcommerce economics

### Public / third-party (merchant-facing)

| Item | Number | Label | Source |
| --- | --- | --- | --- |
| Flat rate volume band | $1K–$10K/mo | VERIFIED FACT | CDG pricing |
| Flat rate example fees | Swipe/mobile 2.90%+$0.30; online 3.50%+$0.30; $9.95/mo | VERIFIED FACT / also in ClientBilling `cdg.ts` | CDG flat-rate page |
| IC+ volume band | $10K–$200K/mo | VERIFIED FACT | CDG pricing |
| IC+ markups | See above | VERIFIED FACT | CDG IC+ page |
| Wholesale | $200K+; membership $49–$199/mo tiers with per-txn cost+ | VERIFIED FACT | CDG wholesale page |
| Chargeback / retrieval / batch / ACH extras | $25 / $15 / $0.10 / 0.75%+$0.15 | ESTIMATE for “CDG official” — reported by Merchant Maverick | https://www.merchantmaverick.com/reviews/cdgcommerce-review/ |
| Month-to-month, no ETF | Stated | VERIFIED FACT (CDG) + MM | CDG IC+ FAQ; MM |
| US-only | Stated | VERIFIED FACT | MM |
| Reseller channel exists | Partner signup; commissions for soliciting new clients; agent panel | VERIFIED FACT | https://corp.cdgcommerce.com/reseller/partner-signup.php |
| Own account not commissioned | Stated | VERIFIED FACT | Same reseller page |
| **Agent residual % / buy rate / vesting** | **Not published** | **ASSUMPTION required** | Agent Agreement (not fetched) |
| MM claim: “doesn’t rely on independent sales agents” | Conflicts with public reseller program | VERIFIED FACT that MM says this; treat as outdated/partial | MM review |

### Industry residual ranges (not CDG-specific)

| Item | Range | Label | Source |
| --- | --- | --- | --- |
| Agent residual split of net | Often 50–80%; lower if upfront bonuses | ESTIMATE | RedFynn, QuadraPay, Batch Report articles |
| Illustrative residual @ $30K/mo, IC+ ~0.30% markup, 50% split | ~$45/mo | ESTIMATE | Unison Payment Solutions blog example |
| Restaurant $80K/mo residual to agent | $200–$400/mo | ESTIMATE | RedFynn (highly markup-dependent) |

**Do not treat industry blogs as your CDG deal.**

### Scenario residuals for modeling (ClientBilling)

Define **monthly agent residual per active merchant** as `R`:

| Scenario | R ($/mo) | Meaning |
| --- | --- | --- |
| Low | $15 | Small volume or thin split |
| Base | $40 | ~$25–40K/mo blend, middling split |
| High | $100 | ~$50–80K/mo or richer split |

**ASSUMPTION:** Residuals continue while merchant processes (lifetime of account), paid monthly, no aggressive clawback after month 3. **Invalidate if agreement differs.**

---

## 4. Unit economics model

### Funnel definitions

| Stage | Definition |
| --- | --- |
| V | Unique monthly visitors to ClientBilling |
| C | Outbound CDG quote CTA clicks |
| A | Completed CDG quote/applications attributed to you |
| P | Approved merchants |
| M | Activated (processing) merchants in month 0 |
| M12 / M24 / M36 | Still active at month 12/24/36 |

### Conversion ASSUMPTIONS (skeptical base)

| Step | Low | Base | High | Notes |
| --- | --- | --- | --- | --- |
| V → C (CTA CTR) | 0.8% | 1.5% | 3.0% | Tools/comparisons higher than blog |
| C → A (apply after click) | 8% | 15% | 25% | Quote form helps vs full app |
| A → P (approval) | 40% | 55% | 70% | Underwriting / unfit verticals |
| P → M (activation) | 70% | 85% | 90% | Equipment, go-live friction |
| Annual attrition of actives | 25% | 18% | 12% | ESTIMATE; industry varies |

Implied **V → M** (base):  
`0.015 × 0.15 × 0.55 × 0.85 ≈ 0.105%` → **~1.05 activated merchants per 1,000 visitors**.

### Visitors → activated merchants (base funnel)

| Monthly visitors | CTA clicks | Applications | Approvals | Activations (M0) |
| --- | --- | --- | --- | --- |
| 1,000 | 15 | 2.3 | 1.2 | **1.05** |
| 5,000 | 75 | 11 | 6.2 | **5.3** |
| 10,000 | 150 | 23 | 12.4 | **10.5** |
| 25,000 | 375 | 56 | 31 | **26** |
| 50,000 | 750 | 113 | 62 | **53** |
| 100,000 | 1,500 | 225 | 124 | **105** |

(Arithmetic from base rates; round for readability.)

### Revenue metrics (base residual R = $40/mo)

| Metric | Formula | Base value |
| --- | --- | --- |
| Revenue per visitor (month-1, new book only) | (M0 × R) / V | ~$0.042 |
| Revenue per CTA click | (M0 × R) / C | ~$2.80 |
| Revenue per application | (M0 × R) / A | ~$19 |
| Revenue per activated merchant | R | **$40/mo** recurring |
| Rough LTV (36 mo, 18% annual attrition ≈ 1.5%/mo) | R × expected months | ESTIMATE ~$40 × ~28–30 ≈ **$1,100–$1,200** if no growth |

**Sensitivity (what matters most):**

1. **R (your split × markup × volume)** — order-of-magnitude  
2. **V → C** (tool quality / CTA)  
3. **C → A** (quote UX / prequal)  
4. Attrition  
5. Absolute visitor count (SEO) — necessary but useless without 1–3

### Portfolio residual at steady growth (base)

ASSUMPTION: acquire M0 new actives each month for 12/24/36 months; 1.5% monthly churn; R=$40.

Approximate active book after T months if adding N per month with monthly retention ρ=0.985:

`Actives ≈ N × (1 − ρ^T) / (1 − ρ)`

| Monthly V | N = M0/mo | Actives ~12 mo | $/mo @ R=$40 | Actives ~24 mo | $/mo | Actives ~36 mo | $/mo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1,000 | 1.05 | ~12 | ~$480 | ~22 | ~$880 | ~30 | ~$1,200 |
| 10,000 | 10.5 | ~118 | ~$4,700 | ~220 | ~$8,800 | ~300 | ~$12,000 |
| 50,000 | 53 | ~590 | ~$23,600 | ~1,100 | ~$44,000 | ~1,500 | ~$60,000 |
| 100,000 | 105 | ~1,180 | ~$47,000 | ~2,200 | ~$88,000 | ~3,000 | ~$120,000 |

**These scale linearly with R.** If R=$15, divide by ~2.7; if R=$100, multiply by 2.5.

### Low / base / high at 10,000 visitors/mo after 24 months

| | Low (CTR 0.8%, close weaker, R=$15) | Base | High (CTR 3%, strong close, R=$100) |
| --- | --- | --- | --- |
| New actives / mo | ~0.3 | 10.5 | ~40 |
| Actives @ 24 mo | ~6 | ~220 | ~850 |
| Monthly residual | ~$90 | ~$8,800 | ~$85,000 |

**Interpretation:** At low residual + weak conversion, 10k visitors is a hobby. At base, it’s a real side portfolio. At high, it’s a business — but high requires both SEO scale **and** a rich agent schedule.

---

## 5. What ClientBilling should become

**Not:** generic “billing best practices” blog with affiliate inserts.  
**Yes:** **processor decision utility** — estimate what you pay now, show transparent CDG published rates, prequalify, then quote.

### Tool priority

| Tool | Why | Priority |
| --- | --- | --- |
| **Effective rate / processing cost calculator** | Captures “Stripe fees”, “credit card processing calculator”, “interchange plus calculator” | **Build first** |
| Stripe / Square / PayPal fee calculators (or modes) | Same engine, branded entry URLs | With v1 |
| Stripe vs merchant account (IC+) comparison output | Natural CTA to quote | With v1 |
| Break-even: when flat-rate costs more than IC+ | Educates $10K+ band | v1.1 |
| Statement analyzer (upload PDF later) | High trust, high build cost | After validation |
| Multi-processor comparison matrix | SEO + utility | After calculator traction |

**Genuine utility rule:** show the math, assumptions, and “get a quote to confirm” — never fake guaranteed savings.

---

## 6. SEO strategy (commercial intent)

### Prioritize (conversion × realistic competition for a new domain)

| Cluster | Intent | ClientBilling asset | Funnel | Realism vs giants |
| --- | --- | --- | --- | --- |
| Stripe fee calculator / Stripe fees $X/mo | Tool | `/tools/fee-calculator?processor=stripe` | Result → IC+ compare → quote | **Best bet** — tools can rank with fewer links |
| Credit card processing calculator / interchange plus calculator | Tool | Same tool default | Same | Strong |
| Square vs merchant account | Compare | Post + tool mode | Quote | Medium |
| CDG Commerce review / pricing | Review | Already live | Quote | Medium (brand query) |
| Best merchant account for ecommerce / restaurants | Vertical | Live ecommerce; restaurants planned | Quote | Medium-hard |
| Best merchant account (head) | Commercial | Avoid as primary | — | **Poor** — MM/NerdWallet/FSB dominate |
| Cheapest credit card processing | Commercial | Avoid thin claims | — | Poor / spammy SERP |

See also `docs/seo/keyword-page-map.md`.

---

## 7. Competitors

| Player | Strength | Weakness ClientBilling can exploit |
| --- | --- | --- |
| Merchant Maverick | Depth, authority, CDG review | Slow tools; not CDG-primary funnel |
| NerdWallet / Forbes Advisor / FSB | Domain authority | Generic roundups; weak calculator depth |
| Helcim / Stax content | Product-led SEO | Biased to self |
| CardFellow / calculator niches | Tools | Often dated UX; thin CDG path |
| Lucrative Merchants–style single-processor sites | Focused funnel | Trust/E-E-A-T thinner |

**Gap:** transparent IC+ math + calculator + single honest recommended partner (CDG) with methodology — rare combination.

---

## 8. Ideal funnel

```
Google: "Stripe fees on $50,000/month"
        ↓
ClientBilling: Fee calculator (volume, ticket, CP/CNP, current rate)
        ↓
Result: "Est. ~$X/mo at your stated rate (assumptions shown)"
        ↓
Compare: "CDG publishes Interchange Plus online at IC + 0.35% + $0.15
          for $10K–$200K/mo — illustrative effective rate ~$Y
          (interchange assumed; not a quote)"
        ↓
Prequal: US-based? Vertical allowed? Volume band?
        ↓
Primary CTA: Get a free quote from CDG  →  applynow/?R=470
Secondary: Read CDG review / See full fee table
Tertiary: Start application (onlineapp) only after intent
```

CTA placement: after results, sticky on tool, mid/end of compare posts — never before the user sees numbers.

---

## 9. Page roadmap

### Build immediately

| URL | Keyword | Intent | Concept | Primary CTA | Why applications |
| --- | --- | --- | --- | --- | --- |
| `/tools/fee-calculator` | stripe fee calculator, processing calculator | Tool | Volume/txn/rate → $ estimate + IC+ illustration | Free quote | High-intent math |
| `/tools/fee-calculator` modes | square fees, paypal fees | Tool | Presets | Free quote | Capture brand-fee searches |
| `/blog/cdg-commerce-vs-stax` | CDG vs Stax | Compare | Honest membership vs IC+ | Free quote | Competitor conquest |

### After initial validation

| URL | Notes |
| --- | --- |
| `/blog/best-merchant-account-for-restaurants` | Vertical + POS |
| `/blog/square-alternatives` | List with CDG as one option |
| `/blog/cdg-wholesale-membership-explained` | High volume |
| `/blog/best-merchant-account-for-nonprofits` | Published nonprofit markup |
| GSC-driven expansions | Only grow what gets impressions |

### Long-term

| URL | Notes |
| --- | --- |
| Statement analyzer | High build / support cost |
| YouTube Shorts embedded in posts | Distribution |
| `/blog/stripe-alternatives` | Crowded but valuable |

Internal links: every tool result → `/cdgcommerce` + quote; every compare → calculator and hub.

---

## 10. Validation experiment (smallest credible test)

**Question:** Can ClientBilling acquire profitable CDG merchants?

### Build (2–4 weeks max)

1. Fee calculator v1 (Stripe + generic flat-rate + CDG IC+ illustration)  
2. Tracking: CTA click, calculator complete, outbound quote click (page, volume band, processor)  
3. Confirm agent dashboard attribution for `R=470` / appcode CLIENTBILLING  
4. **Read residual schedule from your agreement** (non-negotiable)

### Traffic

- Primary: manual/SEO pages already ranking + share calculator in relevant communities **with disclosure**  
- Optional paid: $200–500 test on exact-match “stripe fee calculator” / “credit card processing calculator” to learn CTR→quote (kill if CPA insane)

### Targets (base case skepticism)

| Metric | 60-day success | Failure |
| --- | --- | --- |
| Calculator completions | ≥300 | <50 |
| Quote CTA clicks | ≥40 | <10 |
| Attributed applications | ≥5 | 0 |
| Approvals | ≥2 | 0 |
| Activations | ≥1 | 0 after 90 days |
| Residual visibility | First residual line item in agent panel | Cannot see attribution |

**If you cannot get 1 activation in 90 days with focused traffic, do not scale content production.**

---

## Business case snapshots

### At 1,000 visitors/mo (base)

~1 new active merchant/mo → ~$480/mo residual after a year of compounding → **not worth heavy investment alone**; fine as byproduct of learning.

### At 10,000 visitors/mo (base, R=$40)

~10 actives/mo → ~$5–9k/mo residual by year 2 → **credible side business** if CAC (time/money) stays low.

### At 50,000–100,000 visitors/mo (base)

Portfolio residuals in the tens of thousands per month → **requires SEO wins usually reserved for tools + links + time**; treat as upside, not plan A year-1.

### Critical caveat

If your CDG deal is **CPA-only** or residuals stop at month 12, rebuild the model — the compounding thesis dies.

---

## Final verdict

| | |
| --- | --- |
| **Invest?** | Yes, **narrowly**: calculator + measurement + confirm residual contract. |
| **Become?** | Fee-transparency decision site that earns CDG residuals when IC+ fits. |
| **Don’t become?** | Another thin affiliate review farm competing with Merchant Maverick on head terms. |
| **Prove it by?** | One activation attributed to ClientBilling within ~90 days of calculator launch. |

---

## Sources (selected)

- https://www.clientbilling.com (live audit Sep 18, 2026)
- https://www.cdgcommerce.com/pricing/
- https://www.cdgcommerce.com/pricing/interchange-plus-processing/
- https://corp.cdgcommerce.com/reseller/partner-signup.php
- https://www.merchantmaverick.com/reviews/cdgcommerce-review/
- https://redfynn.com/what-is-a-merchant-services-agent/
- https://www.unisonpayment.com/blog/merchant-services-agent-program-residual-income
- https://quadrapay.com/current-schedule-a-split-percentages-agents/
- Repo: `docs/research/2026-09-17-traffic-gap-report.md`, `docs/seo/keyword-page-map.md`

---

## Appendix A — Follow-up research (same day)

Additional executor research; does not change the executive recommendation.

### CDG residual marketing claim (historical)

- **ESTIMATE / CLAIM (undated forum):** WebHostingTalk thread attributed to CDG voice: partner profit sharing starts around **30%**, can scale to **50%+**, day-one vesting, no production minimums / residual cutoffs. Source: https://www.webhostingtalk.com/showthread.php?t=1110139
- **ASSUMPTION:** Do **not** underwrite ClientBilling on this claim. Prefer Agent Agreement. If used only for scenario planning, treat **30% of net** as a conservative CDG-flavored case and **50%** as upside — still below richer ISO splits advertised elsewhere.

### Attrition benchmarks (industry)

| Source | Finding | Label |
| --- | --- | --- |
| Adil / Green Sheet (2014 era) | ~21% merchants switched ISO; small ISOs ~13% | VERIFIED FACT (historical) |
| Strawhecker (COVID window) | Q2'20 26.7% → Q2'21 20.4% (≤$5M annual card volume) | VERIFIED FACT |
| TSG | <$250k annual volume ~21%/yr; $1M–$10M ~10%/yr | VERIFIED FACT |
| CDG About | >97% retention of actively processing clients | VERIFIED FACT (self-reported); **do not use in NPV** without definition audit |

Base model attrition **18%/yr** remains reasonable; stress **12%** (optimistic mid-volume) and **25%** (micro/startup mix).

### Pricing inconsistencies to clarify with CDG sales

- Flat-rate page: **$9.95 monthly fee** vs FAQ language of **no monthly fees** on the same plan family — VERIFIED FACT conflict on https://cdgcommerce.com/pricing/flat-rate-processing
- Merchant Maverick IC+ monthly **$19–$49** is third-party; confirm current support fee on quote.

### MM vs reseller conflict

Merchant Maverick states CDG does not rely on independent agents; CDG corp reseller pages state the business model is independent partners. **VERIFIED FACT** both statements exist. Your live `agentid=470` / `R=470` links confirm you are in *some* partner channel — get the exact product name (referral vs residual ISO) in writing.

### Modeling tweak

If Agent Agreement is unavailable, sensitivity cases:

| Case | Residual basis | Use |
| --- | --- | --- |
| Conservative | 30% of net processing profit (WHT start claim) | Floor |
| Base | R = $40/mo blended (industry illustrative) | Planning |
| Upside | 50% of net or R = $100/mo | Only after contract proof |
