# 0005: Database in us-east-1 with a pooled connection; migrations run at deploy

Status: Accepted 2026-09-18

## Context

The Neon project was created in São Paulo. Vercel functions run in `iad1` (Virginia) by default, and the merchants are in the United States. Every app page does two or three sequential queries, each paying a cross-continent round trip. Prisma was connecting with the direct URL, which opens a connection per serverless invocation, and migrations were a manual step the deploy pipeline did not run.

## Decision

- The Neon project moves to `us-east-1`. This is an owner action: create a new project in that region, restore from the São Paulo project, update `DATABASE_URL` in Vercel, then delete the old project. Steps are in `docs/product/invoice-mvp.md`.
- `DATABASE_URL` uses Neon's pooled connection string (the `-pooler` host). `DIRECT_URL` holds the direct string for migrations, wired through `datasource.directUrl`.
- `vercel.json` pins functions to `iad1` so a future default change cannot silently reintroduce the split.
- The build runs `prisma migrate deploy` when `DATABASE_URL` is set, so schema changes ship with the code that needs them.

## Reasons

- Latency is the cheapest product improvement available: same code, same UI, a page that feels twice as fast.
- Connection pooling prevents connection exhaustion the first time traffic spikes.
- Migrations that ship with the deploy remove a whole class of "the code is live but the column is missing" incidents.

## Consequences

- Until the owner performs the move, latency stays as is. The code changes are safe to deploy before the move.
- `migrate deploy` at build means a bad migration fails the deploy. That is the intended safety, but it means migrations must be tested locally against a Neon branch first.

## Revisit when

The audience becomes materially non-U.S., or Neon offers a region closer to `iad1`.
