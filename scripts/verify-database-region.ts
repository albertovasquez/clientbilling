/**
 * Verify a database move (decision 0005, issue #72).
 *
 * Reports the region the connection string points at, the round-trip latency
 * to it, and whether the schema is fully migrated. Run it against the new
 * database before cutover, and against production after.
 *
 * Run: DATABASE_URL="<pooled>" npx tsx scripts/verify-database-region.ts
 */
import { PrismaClient } from "@prisma/client";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** Decision 0005: the database belongs next to the functions, pinned to iad1. */
const TARGET_REGION = "us-east-1";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

/** Neon hosts carry their region: ep-name-123.<region>.aws.neon.tech */
function regionOf(connectionString: string): string {
  const host = connectionString.match(/@([^/:?]+)/)?.[1] ?? "";
  const region = host.match(/\.([a-z]{2}-[a-z]+-\d)\./)?.[1];
  return region ?? "unknown";
}

/**
 * Migrations on disk, so we can compare against what the database reports.
 * Resolved from this file, not the working directory: reading zero migrations
 * would otherwise make any database look fully migrated. Throws rather than
 * returning an empty list for the same reason.
 */
function migrationsOnDisk(): string[] {
  const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "prisma", "migrations");
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  if (names.length === 0) throw new Error(`no migrations found in ${dir}`);
  return names;
}

function median(samples: number[]): number {
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

(async () => {
  const region = regionOf(url);
  const pooled = url.includes("-pooler.");
  const problems: string[] = [];

  console.log(`region        ${region}`);
  console.log(`pooled host   ${pooled ? "yes" : "no"}`);

  if (region === "unknown") {
    problems.push("could not read a region from the host; check it by hand");
  } else if (region !== TARGET_REGION) {
    problems.push(
      `database is in ${region}, not ${TARGET_REGION}. Functions are pinned to iad1 in vercel.json, so every query pays a cross-region round trip (decision 0005)`,
    );
  }
  if (!pooled) {
    problems.push("DATABASE_URL is not the pooled host, which decision 0005 requires");
  }

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const samples: number[] = [];
    for (let i = 0; i < 7; i++) {
      const started = performance.now();
      await prisma.$queryRawUnsafe("SELECT 1");
      samples.push(performance.now() - started);
    }
    // The first sample includes connection setup; the rest are round trips.
    const warm = samples.slice(1);
    console.log(`\nquery round trip   ${median(warm).toFixed(0)} ms (median of ${warm.length}, from this machine)`);
    console.log(`first query        ${samples[0].toFixed(0)} ms (includes connection setup)`);
    console.log("                   measured from here, not from iad1, so treat it as a smoke check");

    const onDisk = migrationsOnDisk();
    // The table is absent on a database that has never been migrated, which is
    // the expected state before cutover. Say so instead of surfacing a raw error.
    const [{ present }] = await prisma.$queryRawUnsafe<{ present: boolean }[]>(
      `SELECT to_regclass('public._prisma_migrations') IS NOT NULL AS present`,
    );
    const applied = present
      ? (
          await prisma.$queryRawUnsafe<{ migration_name: string }[]>(
            `SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL ORDER BY migration_name`,
          )
        ).map((r) => r.migration_name)
      : [];
    const missing = onDisk.filter((m) => !applied.includes(m));
    const ahead = applied.filter((m) => !onDisk.includes(m));

    if (!present) {
      console.log("\nmigrations         none: this database has never been migrated");
    } else {
      console.log(`\nmigrations applied ${applied.length} of ${onDisk.length} on disk`);
    }
    if (missing.length) {
      console.log("missing:");
      for (const m of missing) console.log(`  ${m}`);
      problems.push(`${missing.length} migration(s) not applied; run prisma migrate deploy`);
    }
    if (ahead.length) {
      console.log(`ahead of this checkout: ${ahead.join(", ")}`);
    }

    if (present && missing.length === 0) {
      const users = await prisma.user.count();
      const invoices = await prisma.invoice.count();
      console.log(`\nrows          ${users} users, ${invoices} invoices`);
      if (users === 0) {
        console.log("              empty, so accounts need recreating. Decision 0020: create the");
        console.log("              admin account first, then set ADMIN_EMAILS, because a listed");
        console.log("              address cannot self-register.");
      }
    }

    await prisma.$disconnect();

    if (problems.length === 0) {
      console.log(`\nready: ${TARGET_REGION}, pooled, fully migrated`);
      process.exit(0);
    }
    console.log("\nNOT READY:");
    for (const p of problems) console.log(`  - ${p}`);
    process.exit(1);
  } catch (error) {
    console.error("\nfailed:", error instanceof Error ? error.message : error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
})();
