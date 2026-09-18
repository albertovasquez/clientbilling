# Operating manual for agents

How an autonomous agent works in this repository. Read `docs/mission/README.md` first.

## Before any change

1. Read the mission files in order. Read `docs/decisions/` for the area you are touching.
2. Work in a git worktree on a branch. Never commit on the primary checkout.
3. Run `npm run check` before every commit. It runs typecheck, lint, and the style check.
4. Keep `docs/product/invoice-mvp.md` true. If your change alters scope, update it in the same PR.

## What an agent may do without asking

- Fix bugs, improve performance, add tests, refactor within a module.
- Build roadmap items marked P0 or P1 with no CDG dependency, following the style guide and the templates.
- Write or edit blog posts and guides that follow `docs/STYLE_GUIDE.md`, with every number sourced.
- Add or change non-secret environment variables in `.env.example` and document them.
- Add a decision record for a non-obvious choice you made within your remit.
- Open and, when the checks pass and the change is within remit, merge a PR.

## Stop and ask the founder

Do not proceed on your own when a change would:

1. Touch anything in `docs/mission/compliance-boundary.md`: card data, funds, merchant-of-record status, gateway credentials.
2. Add, remove, or rewrite a CDG URL, a CTA rung, or a claim about CDG's fees, terms, residuals, or the integration. This includes the fee calculator's presets and the `cdg.ts` facts.
3. Change pricing or "free" promises, the terms of service, the privacy policy, or the affiliate disclosure.
4. Turn on `COLLECT_ONLINE` or build against the Quantum pay path.
5. Delete or rewrite user data, run a destructive migration, or change the database region or connection.
6. Change authentication, session handling, rate limits, or security headers in a way that loosens them.
7. Send email to anyone other than the account owner or their client on file, or add a new email type.
8. Add a third-party script, analytics vendor, or data processor.
9. Spend money or create accounts with outside services.

Asking means: state the change in one paragraph, cite the mission file and section it touches, propose the safe alternative, and wait.

## Citing mission files in a PR

A PR that touches Collect, CDG copy, fees, legal pages, auth, or email must include a block like:

```
Mission: north-star (R=470 rule), compliance-boundary (hard line 5), affiliate-cdg (diligence table row 2)
Decisions: 0002, 0004
```

The reviewer checks the citation against the diff. A PR without it in those areas is not mergeable.

## Copy rules that apply everywhere

- No em dashes or en dashes. No arrows in link text. Sentence case.
- Internal words never reach a visitor: no "funnel", "R=470", "agent 470", "fake door", "stub".
- "Planned" for anything not shipped. "Sent" only when delivered. "Opened" only when a person opened it.
- Payers never see CDG links or sign-up pitches.

## Runbooks

Operational procedures live in `docs/agents/runbooks/`. When you add an operation an agent might repeat (chase unpaid invoices, rotate a key, move the database), write the runbook in the same PR.
