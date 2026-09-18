# Runbook: move the database to us-east-1

Purpose: implement decision 0005. Owner action; an agent may prepare and verify but must not delete the old project.

Preconditions: Neon account access, Vercel project access, a quiet hour (the app is briefly read-only during the switch).

1. In Neon, create a new project in `us-east-1` with the same Postgres version.
2. Restore the current São Paulo project into it (Neon's restore or `pg_dump` from the direct URL and `pg_restore` into the new direct URL).
3. Copy the new project's pooled connection string (host contains `-pooler`) and direct connection string.
4. In Vercel, set `DATABASE_URL` to the pooled string and `DIRECT_URL` to the direct string for Production. Redeploy.
5. Verify: `/app/sign-in` loads, a sign-in works, `/i/<known publicId>` renders, `/app/admin/funnel` shows the same counts as before.
6. Keep the São Paulo project for seven days, then delete it. Deleting is a stop-and-ask step; confirm with the founder.

Verification of the migration path: `scripts/migrate-if-db.mjs` runs at build and is idempotent; a failed build means a migration problem, not a region problem.
