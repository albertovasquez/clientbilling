# Carbon Copy proofs

Source files of the five artboards the founder approved on 2026-09-18 (the Design canvas at https://claude.ai/artifact/EgcKGSLwWmEoiZuui9aSFJ). They are the visual reference for implementation; the brief in `../brief.md` is the written one. When the canvas changes, copy the files here again in the same PR that changes the site.

| File | What it is |
| --- | --- |
| `Main.dc.html` | Homepage, desktop 1280. The hero cost table recalculates from the amount and ACH fee tweaks. |
| `HomePhone.dc.html` | Homepage, phone 390. |
| `Invoice.dc.html` | Invoice #1042, client copy, Letter. |
| `InvoiceFileCopy.dc.html` | Invoice #1042, file copy with the economics block, event record, and proof detail, Letter. |
| `Specimen.dc.html` | Component specimen: mark, amounts, badges, buttons, inputs, payment selector, table, fee block, agent copy, proof seal. |
| `canvas.json` | Artboard positions and notes. |

The files are self-contained HTML in the canvas format (inline styles, a `support.js` runtime the canvas provides). Open them on the canvas, not in a browser. Every CDG number in them comes from `src/lib/cdg.ts`; ACH is an example labelled as the merchant's own setting; merchant and client names are fictional.
