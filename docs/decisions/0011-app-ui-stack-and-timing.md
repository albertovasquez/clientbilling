# 0011: shadcn/ui for the app, adopted after the P0 features, not before

Status: Accepted 2026-09-18

## Context

The app screens use hand-rolled form styles and buttons from the marketing primitives. The brief evaluated shadcn/ui, Catalyst, Tremor, Mantine, Chakra, and Park UI.

## Decision

- The app adopts shadcn/ui on Radix and Tailwind, with cmdk through shadcn Command, shadcn charts on Recharts, React Email with Resend for all outbound email, and @react-pdf/renderer for PDFs. Catalyst, Tremor, Mantine, Chakra, and Park UI are not adopted.
- shadcn's CSS variables map onto the existing tokens (`--background` to paper, `--foreground` to ink, `--primary` to action, `--muted` to field, `--border` to rule, `--destructive` to verdict). There is one palette.
- The migration starts after the P0 features (card intent, reminders, aging, PDF, concierge, API) ship in the current primitives. React Email and the PDF renderer are adopted as those features need them.
- Marketing pages keep `src/components/ui` and the style guide.

## Reasons

- shadcn is copy-in code we own, Tailwind v4 ready, and server-component friendly; the alternatives bring their own styling runtime or a license.
- Chrome should never block features. The P0 items are what move the loop; new components are not.

## Consequences

- The app will look plain for a few more weeks. That is acceptable.
- When the migration starts, it goes screen by screen, sign-in first, invoice editor last.

## Revisit when

P0 ships, or a P0 feature turns out to need a component (a data table with sorting, a command menu) that is cheaper to take from shadcn than to write.
