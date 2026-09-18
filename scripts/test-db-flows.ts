/**
 * Integration check against a throwaway Postgres (see docs/product/invoice-mvp.md).
 * Run: DATABASE_URL=... DIRECT_URL=... npx tsx scripts/test-db-flows.ts
 * Exercises: password reset tokens, rate limit windows, invoice number uniqueness.
 */
import { compare } from "bcryptjs";
import { prisma } from "../src/lib/db";
import { createResetToken, resetPasswordWithToken } from "../src/lib/password-reset";
import { allow } from "../src/lib/rate-limit";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok:", msg);
}

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: { email, name: "T", passwordHash: "x", business: { create: { name: "T Co", email } } },
  });

  // Password reset
  assert((await createResetToken("nobody@example.com")) === null, "no token for unknown email");
  const raw = await createResetToken(email);
  assert(raw && raw.length > 20, "token created");
  assert(!(await resetPasswordWithToken(email, "wrong-token-value-1234567890", "newpass123")), "wrong token rejected");
  assert(await resetPasswordWithToken(email, raw!, "newpass123"), "valid token resets password");
  const after = await prisma.user.findUnique({ where: { email } });
  assert(after && (await compare("newpass123", after.passwordHash)), "new password hash verifies");
  assert(!(await resetPasswordWithToken(email, raw!, "again12345")), "token cannot be reused");
  const raw2 = await createResetToken(email);
  await prisma.verificationToken.updateMany({ where: { identifier: email }, data: { expires: new Date(Date.now() - 1000) } });
  assert(!(await resetPasswordWithToken(email, raw2!, "later12345")), "expired token rejected");

  // Rate limit: 3 per window
  const key = `test:${Date.now()}`;
  assert(await allow(key, 3, 60), "allow 1");
  assert(await allow(key, 3, 60), "allow 2");
  assert(await allow(key, 3, 60), "allow 3");
  assert(!(await allow(key, 3, 60)), "4th blocked");
  await prisma.rateLimit.update({ where: { key }, data: { resetAt: new Date(Date.now() - 1000) } });
  assert(await allow(key, 3, 60), "allowed again after window");

  // Invoice number uniqueness under concurrency
  const client = await prisma.client.create({ data: { userId: user.id, name: "C" } });
  const biz = await prisma.businessProfile.findUniqueOrThrow({ where: { userId: user.id } });
  const create = () =>
    prisma.$transaction(async (tx) => {
      const c = await tx.businessProfile.update({
        where: { id: biz.id },
        data: { nextInvoiceNumber: { increment: 1 } },
        select: { nextInvoiceNumber: true },
      });
      return tx.invoice.create({
        data: { publicId: Math.random().toString(36).slice(2, 14), userId: user.id, clientId: client.id, number: String(c.nextInvoiceNumber - 1) },
      });
    });
  const made = await Promise.all([create(), create(), create(), create(), create()]);
  const numbers = new Set(made.map((m) => m.number));
  assert(numbers.size === 5, `5 concurrent creates got 5 distinct numbers: ${[...numbers].join(",")}`);
  let dupBlocked = false;
  try {
    await prisma.invoice.create({ data: { publicId: "dupdupdupdup", userId: user.id, clientId: client.id, number: made[0].number } });
  } catch {
    dupBlocked = true;
  }
  assert(dupBlocked, "duplicate number rejected by unique index");

  await prisma.user.delete({ where: { id: user.id } });
  console.log("all checks passed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
