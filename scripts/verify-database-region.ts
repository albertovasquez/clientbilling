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
import { join } from "node:path";

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

/** Migrations on disk, so we can compare against what the database reports. */
function migrationsOnDisk(): string[] {
  try {
    return readdirSync(join(process.cwd(), "prisma", "migrations"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

async function median(samples: number[]): Promise<number> {
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

(async () => {
  const region = regionOf(url);
  const pooled = url.includes("-pooler.");
  console.log(`region        ${region}`);
  console.log(`pooled host   ${pooled ? "yes" : "no (decision 0005 wants the pooled host)"}`);

  if (region !== "unknown" && !region.startsWith("us-east")) {
    console.log(`\n!! Functions are pinned to iad1 in vercel.json. A database in ${region}`);
    console.log("!! pays a cross-region round trip on every query (decision 0005).");
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
    console.log(`\nquery round trip   ${(await median(warm)).toFixed(0)} ms (median of ${warm.length}, after connect)`);
    console.log(`first query        ${samples[0].toFixed(0)} ms (includes connection setup)`);

    const rows = await prisma.$queryRawUnsafe<{ migration_name: string }[]>(
      `SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL ORDER BY migration_name`,
    );
    const applied = rows.map((r) => r.migration_name);
    const onDisk = migrationsOnDisk();
    const missing = onDisk.filter((m) => !applied.includes(m));

    console.log(`\nmigrations applied ${applied.length} of ${onDisk.length} on disk`);
    if (missing.length) {
      console.log("missing:");
      for (const m of missing) console.log(`  ${m}`);
    }

    const users = await prisma.user.count();
    const invoices = await prisma.invoice.count();
    console.log(`\nrows          ${users} users, ${invoices} invoices`);
    if (users === 0) {
      console.log("              an empty database; accounts need recreating, ADMIN_EMAILS first (decision 0020)");
    }

    const ok = missing.length === 0;
    console.log(`\n${ok ? "schema is complete" : "SCHEMA INCOMPLETE: run prisma migrate deploy"}`);
    process.exit(ok ? 0 : 1);
  } catch (error) {
    console.error("\nfailed:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
