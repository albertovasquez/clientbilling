#!/usr/bin/env node
/**
 * Run `prisma migrate deploy` when a database is configured, so schema changes
 * ship with the code that needs them (decision 0005). Skips cleanly on builds
 * without DATABASE_URL (local marketing-only builds, CI without secrets).
 *
 * Two production realities are handled:
 * 1. Neon pooled URLs cannot run migrations. If DIRECT_URL is unset, the pooled
 *    host ("-pooler") is rewritten to the direct host.
 * 2. A database first created with `prisma db push` has tables but no
 *    _prisma_migrations table. The initial migration is then marked as applied
 *    (baselined) before deploying newer ones.
 */
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const BASELINE_MIGRATION = "20260918120000_invoice_mvp";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set, skipping migrations.");
  process.exit(0);
}

const env = { ...process.env };
if (!env.DIRECT_URL) {
  env.DIRECT_URL = url.includes("-pooler.") ? url.replace("-pooler.", ".") : url;
  console.log("[migrate] DIRECT_URL not set; derived a direct URL from DATABASE_URL.");
}

function run(args) {
  const result = spawnSync("npx", ["prisma", ...args], {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

async function needsBaseline() {
  const prisma = new PrismaClient({ datasources: { db: { url: env.DIRECT_URL } } });
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT to_regclass('public."Invoice"')::text AS invoice, to_regclass('public._prisma_migrations')::text AS migrations`,
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    return Boolean(row && row.invoice && !row.migrations);
  } catch (error) {
    console.warn("[migrate] could not inspect schema state:", error instanceof Error ? error.message : error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (await needsBaseline()) {
  console.log(`[migrate] tables exist without a migrations table; baselining ${BASELINE_MIGRATION}.`);
  const status = run(["migrate", "resolve", "--applied", BASELINE_MIGRATION]);
  if (status !== 0) process.exit(status);
}

process.exit(run(["migrate", "deploy"]));
