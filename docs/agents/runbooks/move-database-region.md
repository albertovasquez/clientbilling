# Runbook: move the database to another region

Purpose: implement decision 0005. Done once, on 2026-09-21: the project moved from `sa-east-1` to `us-east-1` and the São Paulo store was deleted. Kept for the next region move.

Preconditions: Vercel project access and a quiet hour (the app is briefly read-only during the switch).

The Neon account is managed through the Vercel integration, so the Neon console will not create a project ("To create a new project, use the Neon Postgres integration in Vercel") and there is no standalone Neon API key. Provision from the Vercel side:

    npx vercel integration add neon --name <name> -m region=iad1 -m auth=false \
      --plan launch_v3 --no-connect --no-env-pull

`--no-connect` matters: connecting immediately overwrites `DATABASE_URL` before the new database has a schema. `auth=false` because the app has NextAuth and its own `User` table; Neon Auth would add a second identity system. Check the active team first with `vercel teams list`, because the integration installs into the active team, not the one `--scope` names.

## Before you start: does this database hold real data?

The answer changes step 2. Check with the verification script, which reports row counts along with the region and the schema state:

    DATABASE_URL="<current url>" npx tsx scripts/verify-database-region.ts

As of 2026-09-21 production held test data only: 2 users, 1 invoice, 0 payments, and 26 events spanning two days of the owner's own testing. If that is still the case, take the recreate path in step 2. If real merchants exist, take the restore path.

## Steps

1. In Neon, create a new project in `us-east-1` with the same Postgres version. The region is fixed at creation, which is why this is a new project rather than a setting.

2. Populate it, by one of two paths:

   - **Recreate** (no real data): skip the restore. The build runs `prisma migrate deploy`, so the schema is created from the migrations on first deploy. To do it ahead of the deploy: `DATABASE_URL="<new pooled>" DIRECT_URL="<new direct>" npx prisma migrate deploy`. Verified 2026-09-21: the migrations apply cleanly to an empty Postgres and `scripts/test-db-flows.ts` passes against the result.
   - **Restore** (real data): Neon's restore, or `pg_dump` from the old direct URL into the new direct URL with `pg_restore`.

3. Copy the new project's pooled connection string (host contains `-pooler`) and direct connection string.

4. In Vercel, set `DATABASE_URL` to the pooled string and `DIRECT_URL` to the direct string **in every environment that has them**, not just Production. Redeploy; an environment variable change alone does not rebuild.

   **`vercel env rm <name> production` splits a shared variable rather than replacing it.** A `DATABASE_URL` scoped to Production, Preview and Development becomes two entries: the new value on Production, the old one still on Preview and Development. That is silent, and deleting the old database at that point breaks every preview build and every `vercel env pull`. This happened on 2026-09-21 and was caught only by listing all environments before the delete. Always finish with:

       npx vercel env ls | grep -E "DATABASE_URL|DIRECT_URL"

   and confirm no entry still points at the old region.

   `DIRECT_URL` may not exist yet: `scripts/migrate-if-db.mjs` derives it from the pooled host when unset, which works, but decision 0005 asks for it explicitly. It is now set in all three environments.

5. Verify:

       DATABASE_URL="<new pooled url>" npx tsx scripts/verify-database-region.ts

   It reports the region, the round-trip latency and whether every migration on disk is applied, and exits non-zero if the schema is incomplete. Then by hand: `/app/sign-in` loads, a sign-in works, `/i/<known publicId>` renders, `/app/admin/funnel` renders.

   On the recreate path the funnel shows zero counts and the old accounts do not exist. Both are correct, not failures. Recreate the accounts, and create the `ADMIN_EMAILS` account before that variable takes effect (decision 0020: addresses in `ADMIN_EMAILS` cannot self-register).

6. Keep the old project for seven days, then delete it with `npx vercel integration-resource remove <name> --yes`. Deleting is a stop-and-ask step; confirm with the founder.

   Before deleting, re-run the environment check from step 4 and take a `pg_dump` of the old database if it holds anything worth keeping. On 2026-09-21 the founder chose to delete the same day, which was safe only because the old database held test data alone (2 users, 1 invoice, 0 payments). No dump was taken, so that data is gone.

## What to expect

What the 2026-09-21 move produced, measured from a developer machine in South America (so the gain is understated: from `iad1` the queries are now same-region):

| Measure | sa-east-1 | us-east-1 |
| --- | --- | --- |
| Query round trip, warm | 164 ms | 87 ms |
| First query, including connection setup | 1673 ms | 856 ms |
| Credentials POST on production | 490 ms | 358 ms |

The cold connection is the larger cost and lands on every cold serverless invocation. Sign-in makes three database round trips in series, so a region move shows up immediately in how sign-in feels.

If sign-in is still slow after the move, the next lever is reducing the number of round trips rather than their distance: the two rate-limit upserts and the user lookup in `src/app/app/actions.ts` and `src/auth.ts` could collapse into fewer queries. That is a code change and belongs in its own issue. The bcrypt cost factor stays at 12 unless a measurement after the move says otherwise (issue #72).

Verification of the migration path: `scripts/migrate-if-db.mjs` runs at build and is idempotent; a failed build means a migration problem, not a region problem.
