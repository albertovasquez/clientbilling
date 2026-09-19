# Runbook: move the Vercel project to another account

Purpose: move the project between Vercel accounts (personal to team, or team to team) without losing environment variables, the domain, or deployment history. Owner action: the account and billing steps are stop-and-ask (operating manual item 9, and item 5 if the database moves with it). An agent may prepare and verify but must not create, transfer, or delete an account or project.

Preconditions: owner access to both accounts, the destination team already created, and a note of the current Production deployment so there is something to roll back to.

## Move

1. Transfer the project rather than deleting and re-importing it. A transfer keeps environment variables, domains, and deployment history; a re-import loses all three and takes the domain offline while it reverifies.
2. Transfer the database separately if it belongs to the old account. A project on the new account pointing at a database owned by the old one is the failure this runbook exists to prevent.
3. Reconnect the Git integration if the destination account does not already have access to the repository.

## Check the environment before testing

A transfer can drop or stale these. Confirm every variable in `.env.example` exists in the new project, and check these four by hand, because each fails in its own way:

| Variable | What breaks if it is wrong |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | The build fails at `scripts/migrate-if-db.mjs`, before `next build`. |
| `AUTH_SECRET` | The build passes and every existing session is invalidated, signing everyone out. |
| `AUTH_URL`, `NEXTAUTH_URL` | The build passes and sign-in redirects to the old deployment URL. |
| `CRON_SECRET` | The build passes and all four crons fail authentication, including the webhook drain every five minutes. |

## Test

4. Trigger a preview deploy first, from a pull request branch, not from `main`. A preview runs the same build and the same migrations without touching production. Pushing an empty commit to an open PR branch is enough.
5. Read the preview build log. A failure at the migrate step is a database or connection-string problem; a failure inside `next build` is a code or toolchain problem. They are not the same thing and the log distinguishes them.
6. Only after a green preview, deploy `main`.

## Verify

7. `/` renders and `/app/sign-in` loads.
8. A sign-in works and lands on the dashboard. This is what proves `AUTH_SECRET` and the two auth URLs, which a build cannot.
9. `/i/<known publicId>` renders a public invoice.
10. `/app/admin/funnel` shows counts consistent with before the move, which proves the app reads the same database.
11. Confirm the crons ran on their next scheduled tick, or call one with the `CRON_SECRET` header. A green build says nothing about them.

## Notes

A transfer does not rebuild anything. Commits pushed while the project was mid-move have no deployment on either account, and their GitHub commit status may read "Deployment failed" with no corresponding build in the Vercel dashboard. Those commits need a fresh deploy; they are not evidence of broken code. Check the dashboard for a missing row before reading the code for a bug.

Stop and ask: creating or paying for an account, deleting the old project, changing the database connection or region, and any change to `AUTH_SECRET` on an account with live users.
