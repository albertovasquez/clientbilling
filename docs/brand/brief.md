# ClientBilling brand brief: Carbon Copy

Status: Draft for the founder's judgment, 2026-09-18. Governs the homepage concept, the invoice, and the component specimen in the Carbon Copy canvas. Nothing propagates to the app until the founder accepts it (decision 0021).

## What the brand is for

ClientBilling is the system of record for what a client owes. The invoice is the human-readable copy of that record. The API is the machine-readable copy. The bookkeeper's file copy is the third view. One record, three views, every one of them honest about what getting paid costs. The proof seal, a fingerprint independently timestamped (decision 0021, next phase), runs through all three; it is the registration mark, not a fourth copy.

One record. Three views. One proof. The carbon copy was always a record that outlived the original. That is the brand's claim: a billing record you can prove.

The line: **Bill clients. Know what getting paid costs.**

The product rule the brand must make visible: whenever money moves, show the economics. Fee per rail, expected net, settlement timing where known, the cheaper alternative. Every number sourced.

## The metaphor and its limits

Carbon copy is the visual metaphor, not an aesthetic. The old triplicate invoice book gave us the idea of one pressure producing three identical records, each going to a different reader. We take from it:

- offset layers (a record and its copies, stacked with a small displacement);
- carbon ink as the accent color;
- copy labels as a device: Client copy, File copy, Agent copy;
- registration marks, used sparingly, as the corner mark of a document or a section;
- tabular and monospaced numerals, because a ledger is columns of numbers that must line up.

We do not take: paper texture, typewriter faces, perforations, torn edges, rubber stamps, faux shadows, or any skeuomorphic invoice pad. The product should feel like a modern financial system whose visual grammar happens to descend from the paper trail.

## Color

| Token | Value | Use |
| --- | --- | --- |
| paper | #FBFAF6 | page background, warm white |
| sheet | #FFFFFF | documents, inputs, the invoice itself |
| ink | #15142B | primary text, headings |
| ink-soft | #3E3D52 | body text |
| muted | #6E6C80 | captions, labels, secondary text (4.6:1 on paper) |
| rule | #E6E3DA | hairlines |
| rule-strong | #C8C4B6 | table heads, totals rule |
| carbon | #3F3BA6 | the accent: actions, links, the mark, copy labels |
| carbon-deep | #2C2986 | hover and pressed |
| carbon-tint | #ECEBF8 | selected states, the offset sheet behind a record |
| cleared | #1E7A4D | paid, settled, received |
| cleared-tint | #E4F3EA | paid badge ground |
| due | #B4451D | overdue, errors, void |
| due-tint | #FBEBE4 | overdue badge ground |
| rule-print | #DDD9CF | ledger and invoice lines on the PDF, where a lighter hairline vanishes on paper |

One accent. Green and rust are states, never decoration. No gradients. No shadows heavier than the offset sheet.

## Type

One family, three roles. IBM Plex.

- **Plex Sans** for headings and body. Headings semibold, tracking -0.02em at display sizes. Body 17px/1.55 on marketing, 15px/1.5 in the app.
- **Plex Mono** for money, percentages, dates, invoice numbers, record IDs, rate formulas, and API output. Tabular by nature. A value set in Plex Mono means "this is a value from the record". Not every non-prose token: labels, names, and status words stay in Sans, so the app never turns into a developer console.
- No third face. No italic display. No all-caps labels with tracking.

Scale (marketing): 56/44/32/24 display, 17 body, 15 small, 13 caption. App: 28/22/18 headings, 15 body, 13 caption.

## The mark

A stacked record: three sheets offset by 3 px down and right, the front sheet in sheet white with a carbon rule at its head, the two behind in carbon tint. Beside it the wordmark "ClientBilling" in Plex Sans semibold, one weight, no color split between the two words. The mark alone is the favicon and the PDF corner. Minimum size 20 px.

A registration mark (a thin circle with a cross) may sit at the corner of a document or a section rule. At most one per view.

## Layout

Left aligned. A 12-column grid at 1280, 16 px gutter at 390. Whitespace does the separating; hairlines appear only where they encode structure (a table head, a totals rule, the head of a document). Records sit on a sheet on the paper background. Not everything is a card: lists are tables, panels are sheets, and a sheet appears only when its content is a document or a form.

Numbers right-aligned in columns, always. Status words as small badges with a tinted ground and no border.

## Copy labels

A document says which copy it is, top right, in caption Plex Mono: `Client copy`, `File copy`, `Agent copy`. The client copy shows how to pay. The file copy adds the economics block: what each rail costs and what the merchant nets, and the event record with its actor and anchor. The agent copy is the JSON. Every view carries the proof seal. On the client copy it is quiet: "Verified record CB-7F2A-91C8 v1. This invoice version is independently anchored. No names, amounts, email addresses, or invoice text are written to the public chain. Verify record." Fingerprints, anchors, Merkle detail, and actor history belong on the file copy and the verification page, never beside "Amount due". The registration mark is the seal's mark. Same record, three views, one proof.

## Voice

Four rules. State the number: "Card fee: $87.80." State its source: "CDG Commerce published rate, checked Sep 17, 2026." Admit uncertainty: "$8.90 plus interchange. Final cost varies by card." Never imply savings you cannot calculate: "Compare card costs", not "Save hundreds". Never claim a competitor hides what it publishes.

Plain, numerate, candid. Sentence case. No exclamation marks. Verbs that say what happens: "Record payment", "Send invoice", "Compare your card costs". Every number on a page has a source or is the merchant's own. Nothing is "planned" unless it has a decision. The disclosure about CDG stays explicit wherever a CDG link appears.

## Where CDG sits

CDG is a rail, offered where the merchant decides how to collect, with its published numbers and the disclosure. It is never in the hero, never a logo in the nav, never the reason the page exists. The guides about CDG keep their pages and their traffic.

## What the three proofs must show

1. **Homepage**: free invoicing obvious within seconds; payment-cost transparency demonstrated on a real-looking invoice, not claimed; the carbon-copy identity present without nostalgia; enough technical credibility that Developers and an API feel native.
2. **Invoice**: a client copy that any payer would trust, and a file copy whose economics block shows a $2,500 invoice with card, interchange-plus, ACH, and net-received amounts, every rate sourced or marked as the merchant's own setting.
3. **Component specimen**: amount, currency, status badges, fee calculation, payment method selector, API response, table, button, input, and the stacked-record motif, so we know the identity can become a product system rather than one good page.

## Sources for numbers used in the proofs

Card flat rate 3.50% + $0.30 and interchange-plus markup 0.35% + $0.15 are CDG's published online rates in `src/lib/cdg.ts`, checked 2026-09-17. Interchange itself varies by card and is shown as "plus interchange". ACH fees are not published by CDG in our records; the proofs show ACH as the merchant's own setting with an example value labelled as such. Nothing else is quoted.
