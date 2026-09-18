# 0016: Invoice PDFs are rendered server-side from the same data as the page, with built-in fonts

Status: Accepted 2026-09-18

## Context

Merchants attach invoices to email threads and client portals, and payers file them. "Print this page" was the only PDF path. The brief evaluated @react-pdf/renderer against print CSS with headless rendering.

## Decision

- PDFs are rendered on the server with @react-pdf/renderer from the same invoice data and wording as `/i/[publicId]`: merchant first, plain status, line items, totals, notes, how to pay (pay link and instructions), and ClientBilling only in the footer.
- Built-in Helvetica is used. No font files are fetched at render time, so output is deterministic and the route has no network dependency.
- The merchant's logo is not in the PDF yet. Remote image fetching inside the renderer is a failure surface (dead URLs, slow hosts) that would break downloads; it returns as a P2 item with a cached, validated logo.
- Two routes: `/api/invoices/[id]/pdf` for the merchant (authenticated, attachment) and `/i/[publicId]/pdf` for the payer (same access rule as the page, inline, noindex). The invoice email attaches the PDF.

## Reasons

- One source of truth for what the invoice says; the PDF cannot drift from the page.
- Server rendering in a route handler needs no browser and runs on Vercel's Node runtime.
- Built-in fonts avoid the two common PDF failure modes: missing font files and slow font downloads.

## Consequences

- The PDF uses Helvetica rather than the site's Source Sans and Source Serif. Acceptable for a document; revisit with embedded fonts if merchants ask.
- `@react-pdf/renderer` is marked as a server external package so Next does not bundle it.

## Revisit when

Merchants ask for logos or custom fonts on PDFs, or PDF generation time exceeds a second at p95.
