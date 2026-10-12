# Success-fee (15%) legal research: does it make us a collector?

*Research notes, not legal advice. Prepared 2026-10-12. Verify every point with a collections attorney before any message reaches a real debtor.*

## Verdict (short)

- **A 15% fee on collected money is the single biggest licensing trigger we control.** Most state collection-agency statutes define a collector as anyone who collects or tries to collect a debt **owed to another**, "for compensation, contingent or otherwise" (Ohio's wording). A contingency fee is the classic sign of a third-party collector. It doesn't create the license duty by itself, but it removes our best argument ("we sell software, we aren't paid for collecting").
- **The AI drafting and negotiating is the second trigger.** Under *Echlin v. PeaceHealth* (9th Cir. 2018), a vendor that independently drafts the letters, answers debtor questions and runs a debtor portal "meaningfully participates" in collection, even when it never negotiates or handles money. Our agent would do all of that, *and* negotiate.
- **Sending from the user's own mailbox and pay link helps, but it doesn't settle it.** It strongly supports "the creditor is collecting its own debt" (FDCPA creditor exemption, no trust account needed). But regulators and courts look at **who actually does the work and how they get paid**, not whose letterhead is used.
- **Recommendation:** launch with a **flat SaaS fee** (per seat or per active account), with the user approving or setting every message and offer. Offer outcome pricing **only through a licensed partner agency** that is the collector of record and pays us a platform or tech fee. Treat a direct 15% contingency as a "later, with licenses" option.

## 1. Federal: FDCPA and Regulation F (consumer debt only)

- **Scope.** The FDCPA covers only consumer debts, meaning debts for "personal, family, or household purposes" (15 U.S.C. §1692a(5)). Pure B2B invoices are outside it. Watch for sole proprietors and personal guarantees, where the debt can still be consumer debt. https://www.law.cornell.edu/uscode/text/15/1692a
- **Debt collector, §1692a(6).** This is anyone whose principal purpose is collecting debts, or who regularly collects debts "owed or due ... another." Creditors collecting their own debts are excluded, **unless the creditor uses a name other than its own** that suggests a third party. Our design (the user's name and the user's email) stays inside the creditor exclusion only if the messages truly come from the creditor.
- **Flat-rating, §1692j.** It is unlawful to furnish forms that create the false belief that a third party is "participating in the collection" when it isn't. The Senate report called the flat-rater a vendor that "merely sells dunning letters" (S. Rep. 95-382). This cuts both ways for us. If our name appears, we have to be *really* participating, and that makes us a collector. If we stay invisible, we look more like a tool. https://www.law.cornell.edu/uscode/text/15/1692j
- ***Echlin v. PeaceHealth*, 887 F.3d 967 (9th Cir. 2018).** Computer Credit, Inc. (CCI) "could not negotiate, process, or seek to compel repayments" and still participated meaningfully, because it screened accounts, "alone drafted and mailed the collection letters, without input from PeaceHealth", fielded debtor calls, and ran an individualized debtor website.
  - https://hallapproved.com/us/cases/ca9/2018/4487421/
  - https://www.ballardspahr.com/insights/alerts-and-articles/2018/05/involvement-in-hallmark-debt-collection-activities-not-required-meaningful-participation
  - https://www.consumerfinancialserviceslawmonitor.com/wp-content/uploads/sites/880/2018/05/Echlin-v.-PeaceHealth.pdf
  - **For us:** an autonomous AI that drafts, answers and negotiates looks *more* involved than CCI. The safe design keeps the creditor in control of content and decisions: user-approved templates, user-set limits, and a human-in-the-loop log.
- **Reg F (12 CFR 1006, effective 2021).** It is consumer-only. It covers email and text rules (opt-out, the 7-in-7 call limit, and time and place rules). The CFPB has said vendors can face liability for unfair, deceptive or abusive acts or practices (UDAAP) as "service providers" under the Consumer Financial Protection Act (12 U.S.C. §5481(26)), whether or not they meet the FDCPA definition. https://www.consumerfinance.gov/rules-policy/regulations/1006/
- **FTC Act §5** applies to B2B deception too, for example misrepresenting legal consequences or impersonating lawyers.

## 2. State licensing that reaches commercial (B2B) debt

Licensing generally follows **where the debtor is located** (sometimes also where the creditor-client is), so a national product is exposed in every licensing state. One licensing vendor counts **38 of 52 jurisdictions** that license third-party collectors (https://cornerstonelicensing.com/third-party-collection-agency-license). In many of them the definition is **not limited to consumer debt**.

| State | Covers commercial debt? | How "collector" is defined / trigger | Notes |
|---|---|---|---|
| **Washington** (RCW 19.16) | **Yes**: "claim" means any contractual obligation; "commercial claim" is defined separately | "Any person directly or indirectly engaged in soliciting claims for collection, or collecting or attempting to collect claims owed ... another" | Closed-border state: you need the license **before** contacting WA debtors. Out-of-state license requires a trust account. Unlicensed collection risks a Consumer Protection Act claim and forfeiture of fees. https://app.leg.wa.gov/RCW/default.aspx?cite=19.16.100 · https://dol.wa.gov/professional-licenses/collection-agencies/get-your-license-collection-agencies |
| **Florida** (§559.544–.546) | **Yes**: a separate **commercial collection agency registration** | Commercial collection agencies must register: $500 fee and a **$50,000 surety bond**. Consumer collectors register separately under §559.553 | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599%2F0559%2FSections%2F0559.545.html |
| **North Carolina** (G.S. 58-70) | Broad "collection agency" definition (attorney to confirm the commercial reach) | Permit required for each location; operating without one is a **Class I felony** | Regulated by the NC Department of Insurance. Bond $10k in-state, $20k out-of-state. Trust account required unless no funds are collected (an exemption that helps us). https://www.ncleg.gov/EnactedLegislation/Statutes/PDF/ByArticle/Chapter_58/Article_70.pdf · https://www.ncdoi.gov/licensees/collection-agency-licensing/become-licensed-collection-agency |
| **Ohio** (R.C. 1319.12) | Yes, any debt | Collector means anyone who "for compensation, **contingent or otherwise** ... offers services to collect an alleged debt asserted to be owed to another" | The statute names contingent fees explicitly. https://codes.findlaw.com/oh/title-xiii-commercial-transactions/oh-rev-code-sect-1319-12/ |
| **Illinois** (205 ILCS 740, Collection Agency Act) | Yes, the Act is not limited to consumer debt | It includes anyone who **furnishes "any system of collection, letters, demand forms"** making it look like someone other than the creditor is collecting | That clause targets software and letter vendors. It permits contingency fees that are "reasonable." Chicago adds its own city license. https://ilga.gov/Legislation/ILCS/Articles?ActID=4292&ChapterID=20 |
| **Massachusetts** (M.G.L. c.93 §24–28) | Mostly consumer-focused; the Division of Banks licenses collectors ($25k bond) | Get attorney confirmation on commercial reach | Strict consumer regulation (940 CMR 7.00). |
| **California** | Debt Collection Licensing Act (Fin. Code §100000 et seq., DFPI) and the Rosenthal Act cover **consumer** debt. From 2020, Rosenthal reaches first-party creditors as well. | B2B is largely outside both | Low licensing risk for pure B2B. Watch small businesses that are really individuals. https://dfpi.ca.gov/regulated-industries/debt-collectors/ |
| **New York** | No statewide collector license. NYC DCWP (and Buffalo and others) license collectors of **consumer** debt | NYC's definition reaches anyone who "regularly collects or attempts to collect" debts owed to another | Some secondary sources say NY requires a state license for commercial work, which is likely wrong; verify. Commercial B2B is mostly unregulated at the state level, but city rules can bite. |
| **Texas** (Fin. Code ch. 392) | Consumer debt; third-party collectors file a $10k bond with the SOS | Commercial debt is outside ch. 392 | https://www.cosmodca.com/help-article/debt-collection-act |
| **Colorado** (C.R.S. 5-16) | **No**: "Debt does not include a debt for business ... commercial ... purposes" | The AG says collectors of only commercial debt **do not need a license** | https://colorado.public.law/statutes/crs_5-16-103 · https://coag.gov/licensing/collection-agency-regulation/ |

**Other states that also reach commercial collections** (to confirm with the attorney): Arizona, Nevada, Utah (registration), Tennessee (Collection Service Board), Maryland, Minnesota, Oregon, Wisconsin, Georgia (commercial exempt), and Pennsylvania (Fair Credit Extension Uniformity Act, consumer only). Several states have a **"furnishing systems/forms"** clause like Illinois's, which targets software that fronts collection.

**Commercial Law League of America (CLLA).** This is voluntary certification for commercial agencies, not a license. It requires audited compliance and a surety bond sized to **gross contingency fees** ($150k bond up to $1M in fees). Bonding is sized that way because contingency-fee firms are presumed to be collectors handling client money. https://clla.org/standards-and-requirements/

### Is a contingency fee a trigger?

- **Explicitly:** Ohio ("contingent or otherwise"), and in practice most statutes say "for compensation." Some states (for example Kansas, per Cornerstone) regulate contingency collection lightly or not at all.
- **Practically:** regulators read a percentage-of-collections fee as evidence of being in the collection business. A flat fee doesn't exempt you if the conduct counts as collecting (Echlin), but it gives you the "software vendor" posture.
- **Forfeiture risk:** in several states, unlicensed collectors cannot recover their fees and may owe them back (WA, NC), and contracts with unlicensed collectors can be voidable.

## 3. Comparable companies

| Company | Model | Pricing | Licensed? |
|---|---|---|---|
| **Chaser**, **Upflow**, **Kolleno** | AR automation; reminders sent from the **creditor's own** email | **Flat SaaS** (per user or per tier) | Not collection agencies. Chaser offers a separate debt-recovery referral to partner agencies. Their posture is the software-vendor model. |
| **Collectly** | Patient billing for healthcare providers (first-party, in the provider's brand) | SaaS plus usage | Operates as a first-party vendor. |
| **TrueAccord** | AI-driven **consumer** collections | Contingency | **Licensed collection agency in all required states**: being a third-party collector is the business. |
| **InDebted**, **Tratta** | InDebted is a licensed consumer agency. Tratta is a payment portal or SaaS for agencies and creditors. | Contingency (InDebted) and SaaS (Tratta) | InDebted is licensed. Tratta stays a tech vendor. |
| **AgentCollect / Respaid** (YC S23) | AI agents call, email and negotiate "under your brand" for aged B2B debt | **Success fee from 10.9%** | Positions as a collection service. Respaid originally used lawyer-backed collection. https://www.ycombinator.com/companies/agentcollect |
| **recovry.sg** | B2B, no win no fee | Success fee | Licensed under Singapore's Debt Collection Act 2022. https://recovry.sg/ |

**Pattern:** companies that charge **a percentage hold collector licenses (or work through lawyers)**, and companies that stay **unlicensed charge flat SaaS fees** and send in the creditor's name.

## 4. Pricing structures, from lowest to highest risk

1. **Flat SaaS per seat or tier** (for example $29–$99 a month). The user approves templates and offers. Lowest risk.
2. **Usage pricing** (per message, per active account each month). It isn't tied to the amount collected, so it reads as software.
3. **Per-resolved-account flat fee** (for example $15 when a plan is signed, whatever the amount). This is outcome-linked but not a percentage. **Medium risk**: an attorney may still see it as compensation for collecting.
4. **Capped success fee or "performance tier"** (for example a higher plan unlocked by recovery volume). Medium to high.
5. **Revenue share through a licensed partner agency.** The partner is the collector of record (licensed and bonded, holds the trust account, messages under its name), charges the 15%, and pays us a tech fee. Low risk for us, **if** the fee isn't a referral or fee-split that the state's law forbids (some states bar collectors from splitting fees with unlicensed persons; verify).
6. **Direct 15% contingency, with our AI negotiating.** **High risk.** Plan on licenses in WA, FL (commercial registration), NC, IL, OH and similar states before going live there, plus bonds and possibly trust accounts.

## 5. Risk matrix

| Design choice → / Fee model ↓ | User writes and approves every message; we're invisible | AI drafts and user approves | AI negotiates autonomously within user limits | Our brand visible to debtors |
|---|---|---|---|---|
| Flat SaaS | **Low** | Low | Medium | Medium (§1692j / IL "forms" clause) |
| Per-message / per-account | Low | Low | Medium | Medium |
| Per-resolved flat fee | Medium | Medium | Medium-High | High |
| % of collected (15%) | Medium-High | **High** | **High** | **Very high** (looks like an unlicensed third-party collector) |
| % via licensed partner | Low (for us) | Low | Low-Medium | n/a (partner's brand) |

Consumer debt raises every cell by one level (FDCPA, Reg F, CA, NYC, MA). Colombia carries separate risk (below).

**Riskiest states for B2B plus a % fee:** **Washington** (closed border, broad "claim", trust account), **Florida** (commercial registration plus $50k bond), **North Carolina** (felony for an unpermitted agency), **Illinois** ("system of collection, letters" clause, plus Chicago), and **Ohio** ("contingent" in the text). Lower risk for B2B-only: **Colorado** (expressly excludes commercial), **California**, **Texas**, and **New York State** (consumer-focused). Confirm each.

## 6. Colombia (brief)

- **Ley 1266 de 2008** (habeas data) and **Ley 2300 de 2023** ("Dejen de fregar"). Collection contact is allowed only through channels the debtor authorized, Monday to Friday 7am–7pm and Saturday 8am–3pm, at most once a day per channel, and never with third parties such as family or employers. The SIC enforces this. These rules mainly protect consumers (personas naturales). B2B debts with legal entities are less regulated, but sole traders count as natural persons.
- There is no national collection-agency license comparable to the US ones, but collection fees (*honorarios de cobranza*) charged **to the debtor** are capped and regulated by the SFC and SIC for financial-sector debts. Our fee is charged to the creditor, so this doesn't apply directly.
- Ley 1581 de 2012 (data protection) governs any debtor list a user uploads. We would be a data processor (*encargado del tratamiento*).
- https://www.sic.gov.co (search "Ley 2300 de 2023")

## 7. Questions for the attorney

1. If the user picks templates, sets settlement limits and approves offers, and our AI only drafts and sends from the user's own Gmail or Outlook, are we a "collection agency" under WA RCW 19.16, FL §559.544, NC G.S. 58-70, IL 205 ILCS 740 and OH 1319.12 for **commercial** debts?
2. Does charging 15% of recovered amounts (versus a flat fee) change that answer in each state? Would a per-resolved-account flat fee?
3. How much autonomy can the AI have (answering disputes, proposing plans inside user limits) before *Echlin*-style "meaningful participation" makes us the collector, under state law even for B2B?
4. Does Illinois's "furnishes any system of collection, letters, demand forms" clause reach a SaaS that sends in the creditor's own name?
5. Under a licensed-partner model, can the partner pay us a tech fee or revenue share in each target state without breaching fee-splitting or "aiding an unlicensed collector" rules?
6. How do we reliably screen out consumer debts (sole proprietors, personal guarantees) to stay outside the FDCPA, Reg F and the consumer state laws? What attestation should users sign?
7. Do the CFPA "service provider" UDAAP liability and the FTC Act §5 reach us for B2B?
8. What disclosures are required for AI communications (for example the CA bot disclosure law, Bus. & Prof. Code §17940 et seq.)? Can the debtor chat page and e-signature live on our domain without making us look like a third party?
9. Do we need a trust account anywhere if funds go only to the user's own processor (NC's exemption suggests no)?
10. For Colombia, are we a data processor under Ley 1581, and does Ley 2300 apply when the debtor is a natural-person merchant?
11. What terms of service, indemnity and insurance (E&O or cyber) should we carry?

## 8. Bottom line for the product

- **Now:** flat SaaS ($/seat or $/active account), B2B-only attestation, user-approved templates and offers, the user's own mailbox and pay link, AI disclosure, and our brand invisible to debtors.
- **Marketing:** we can still say "aligned with you" (for example a free tier until the first recovery, or a money-back guarantee if nothing is collected in 60 days, which is refund-based, not a %). Get counsel's sign-off on that wording too.
- **Later:** a 15% "done for you" tier through a licensed CLLA-certified partner agency, or our own licenses in priority states.
