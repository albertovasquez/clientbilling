# Runbook: move the database to us-east-1

Purpose: implement decision 0005. Owner action; an agent may prepare and verify but must not delete the old project.

Preconditions: Neon account access, Vercel project access, a quiet hour (the app is briefly read-only during the switch).

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

4. In Vercel, set `DATABASE_URL` to the pooled string and `DIRECT_URL` to the direct string for Production. Redeploy; an environment variable change alone does not rebuild.

   Two things to know. `DIRECT_URL` may not exist yet: `scripts/migrate-if-db.mjs` derives it from the pooled host when unset, which works, but decision 0005 asks for it explicitly. And `DATABASE_URL` is scoped to Production, Preview and Development together, so one edit moves all three.

5. Verify:

       DATABASE_URL="<new pooled url>" npx tsx scripts/verify-database-region.ts

   It reports the region, the round-trip latency and whether every migration on disk is applied, and exits non-zero if the schema is incomplete. Then by hand: `/app/sign-in` loads, a sign-in works, `/i/<known publicId>` renders, `/app/admin/funnel` renders.

   On the recreate path the funnel shows zero counts and the old accounts do not exist. Both are correct, not failures. Recreate the accounts, and create the `ADMIN_EMAILS` account before that variable takes effect (decision 0020: addresses in `ADMIN_EMAILS` cannot self-register).

6. Keep the São Paulo project for seven days, then delete it. Deleting is a stop-and-ask step; confirm with the founder.

## What to expect

Measured against sa-east-1 on 2026-09-21, from a developer machine:

| Measure | Value |
| --- | --- |
| Query round trip, warm | 169 ms |
| First query, including connection setup | 2170 ms |

The cold connection is the larger cost and lands on every cold serverless invocation. Sign-in makes three database round trips in series, so the move should be visible immediately in how sign-in feels.

If sign-in is still slow after the move, the next lever is reducing the number of round trips rather than their distance: the two rate-limit upserts and the user lookup in `src/app/app/actions.ts` and `src/auth.ts` could collapse into fewer queries. That is a code change and belongs in its own issue. The bcrypt cost factor stays at 12 unless a measurement after the move says otherwise (issue #72).

Verification of the migration path: `scripts/migrate-if-db.mjs` runs at build and is idempotent; a failed build means a migration problem, not a region problem.
