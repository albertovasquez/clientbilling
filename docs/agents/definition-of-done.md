# Definition of done

A change is done when all of the following are true. "Mostly" is not done.

## Code

- `npm run check` passes: typecheck, lint, style check.
- `npm run build` passes locally. Routes you added appear in the build output.
- Anything that touches the database was exercised against a real Postgres (Docker is fine; `scripts/test-db-flows.ts` shows the pattern), including a fresh migration run.
- New behavior has a test or a scripted check where one is practical. Auth, money math, status transitions, and rate limits always do.
- No secrets, no card data, no gateway credentials in code, logs, fixtures, or screenshots.

## Product

- Copy follows the style guide and the operating manual's copy rules. No banned words reached a visitor.
- Every number about a processor has a source and a date.
- Empty states, error states, and the mobile width were looked at, not assumed. Phone width means 390px and 320px without horizontal scroll.
- Payer-facing pages contain nothing that sells to the payer.

## Documentation

- `docs/product/invoice-mvp.md` reflects the new scope.
- A decision record exists for any non-obvious choice, with reasons and a revisit trigger.
- Environment variables are in `.env.example` with a one-line explanation and in the env table in `invoice-mvp.md`.
- If the change adds an operation an agent might repeat, a runbook exists.

## Process

- Worked in a worktree on a branch; PR opened; checks green; merged; local `main` rebased; worktree and branch removed.
- The PR body cites mission files and decisions when the change touches Collect, CDG, fees, legal pages, auth, or email.
- After a merge that touches the app, the live site was checked for the specific change (the route answers, the copy is present, the redirect works).
- What was verified is stated plainly in the PR and the summary. What was not verified is stated too.
