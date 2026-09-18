# ClientBilling × CDG / Quantum — partner one-pager

**From:** Alberto Vasquez, ClientBilling.com (agent / referral ID **R=470**, appcode **CLIENTBILLING**)  
**To:** CDG Commerce partner / Quantum Gateway team  
**Date:** 2026-09-18  
**Ask:** Confirm residuals and bless a simple product integration

---

## Who we are

ClientBilling.com is an independent site that already sends merchants to CDG via tracked links (`applynow/?R=470` and the secure online application with `agentid=470`). We publish fee guides, a processing fee calculator, and CDG-focused reviews. Traffic is SEO + direct on **www.clientbilling.com**.

## What we want to build

**ClientBilling = invoice UX. Quantum = Pay button. CDG application = underwriting.**

1. Freelancers and small US businesses create and send invoices in ClientBilling (PDF + hosted link + email).
2. Invoices work unpaid with no card data on our servers.
3. When they tap **Collect online**:
   - **No MID yet** → CDG / Quantum merchant application (`applynow/?R=470`), same path your merchants already use.
   - **Already approved** → they connect Quantum (`gwlogin` / hosted checkout). Pay uses Quantum hosted checkout or iframe (SAQ A path). We never store card numbers.
4. Settlement, funding, chargebacks, and PCI for card data stay with CDG / Quantum and the merchant — not ClientBilling.

We are **not** becoming a payfac, MoR, or money transmitter.

## Why this helps CDG

- Merchants hit underwriting at the moment they need **Pay now**, not after reading a blog post.
- Domain mindshare (“client billing”) matches invoice-first behavior.
- Processing still runs on **Quantum / CDG MIDs**, so residuals should look like normal referred volume (we need you to confirm).
- We steer people who want a **true merchant account / interchange-plus** rather than only flat-rate payfacs (Wave, Square, PayPal).

## What we need from you (yes / no)

| # | Question | Why it matters |
| --- | --- | --- |
| 1 | Do residuals for agent **470** apply when a referred merchant processes through Quantum hosted pay triggered from **our** invoice UI (merchant’s own `gwlogin`)? | Core unit economics |
| 2 | Is that integration allowed under the Agent / VAR agreement? | Compliance |
| 3 | Preferred pay method for a third-party invoice app: Interactive `qgwdbe.php`, Web Order Form, or ILF? | Engineering |
| 4 | Any requirements for return URLs, branding (“Powered by Quantum / CDG”), or prohibited claims? | Risk / marketing |
| 5 | Who is the right technical contact for a sandbox `gwlogin` + RestrictKey test? | Build |

## What is live today (no Quantum keys)

The invoice app is live at https://www.clientbilling.com/invoices: merchants create, send, and track invoices for free, and payers see the merchant's payment instructions. When a payer says they would prefer to pay by card, the merchant is notified and shown your quote form (`applynow/?R=470`). We count those requests. That number is what we will bring to you before asking for engineering time.

## What we would share and what we would not

- We would see invoice amounts, invoice numbers, and the merchant's Quantum account identifier needed to build a hosted pay link. We would not see, request, or store card data, bank details, or gateway passwords.
- We would not share merchant or payer data with anyone else, and we would not share your commercial terms publicly.

## PCI and technical scope

- Pay runs on a Quantum hosted page or iframe served from your origin. Card fields never render on clientbilling.com, so our origin stays out of card-data scope (SAQ A for the merchant when hosted).
- Payment status reaches us through a post-back or signed callback carrying a reference and amount only.

## Relationship and support

- The merchant contracts with CDG. Underwriting, funding, chargebacks, refunds, and rate questions are yours; invoice software questions are ours. We will say so on every page.
- Either party can end the integration with 30 days notice; merchants keep their CDG accounts and their invoices.

## What we will not do

- Collect or store cardholder data on clientbilling.com
- Hold or settle merchant funds
- Commission our own processing account
- Present ClientBilling as the payment processor

## Links

- Site: https://www.clientbilling.com  
- Fee calculator: https://www.clientbilling.com/tools/fee-calculator  
- Quote CTA today: https://www.cdgcommerce.com/applynow/?R=470  
- Quantum (public): https://www.quantumgateway.com/  

## Contact

Alberto Vasquez — alberto@clientbilling.com  
Please reply with answers to the five questions above, or a 20-minute call.

Thank you.
