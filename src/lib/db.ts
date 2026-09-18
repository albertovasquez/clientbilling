import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Allow imports during build; runtime calls will throw a clear error.
    console.warn(
      "[db] DATABASE_URL is not set. Invoice app routes need a Postgres URL (Neon recommended).",
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function assertDatabase(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env.local (Neon Postgres) to use the invoice app.",
    );
  }
}
