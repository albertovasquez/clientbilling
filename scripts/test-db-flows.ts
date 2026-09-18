/**
 * Integration check against a throwaway Postgres (see docs/product/invoice-mvp.md).
 * Run: DATABASE_URL=... DIRECT_URL=... npx tsx scripts/test-db-flows.ts
 * Exercises: password reset tokens, rate limit windows, invoice number uniqueness.
 */
import { compare } from "bcryptjs";
import { prisma } from "../src/lib/db";
import { createResetToken, resetPasswordWithToken } from "../src/lib/password-reset";
import { deletePayment, recordPayment } from "../src/lib/invoices/payments";
import { setInvoiceStatus } from "../src/lib/invoices/service";
import { payLinkForInvoice, payLinkKind } from "../src/lib/pay-link";
import { allow } from "../src/lib/rate-limit";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok:", msg);
}

async function main() {
  // Pay links (decision 0014 amendment)
  assert(payLinkForInvoice("https://paypal.me/acmeplumbing", 1234) === "https://paypal.me/acmeplumbing/12.34USD", "paypal.me gets the balance");
  assert(payLinkForInvoice("https://www.paypal.me/acmeplumbing/5USD", 1234) === "https://paypal.me/acmeplumbing/12.34USD", "typed amount replaced");
  assert(payLinkForInvoice("https://www.paypal.com/paypalme/acmeplumbing", 50) === "https://paypal.me/acmeplumbing/0.50USD", "paypal.com/paypalme form");
  assert(payLinkForInvoice("https://paypal.me/acmeplumbing", 0) === "https://paypal.me/acmeplumbing", "zero balance keeps the bare link");
  assert(payLinkForInvoice("https://pay.example.com/acme?x=1", 1234) === "https://pay.example.com/acme?x=1", "other links pass through");
  assert(payLinkForInvoice("https://paypal.me/bad name/", 1234) === "https://paypal.me/bad name/", "unparseable username passes through");
  assert(payLinkKind("https://paypal.me/acme") === "paypal" && payLinkKind("https://pay.example.com") === "generic", "kind detection");

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

  // Payments (decision 0019)
  const inv = await prisma.invoice.update({
    where: { id: made[0].id },
    data: { status: "sent", sentAt: new Date(), totalCents: 30000, subtotalCents: 30000, dueDate: new Date(Date.now() - 86_400_000) },
  });
  const over = await recordPayment(user.id, inv.id, { amountCents: 30001 }, "app");
  assert(!over.ok && over.status === 400, "overpayment rejected");
  const zero = await recordPayment(user.id, inv.id, { amountCents: 0 }, "app");
  assert(!zero.ok, "zero amount rejected");
  const future = await recordPayment(user.id, inv.id, { amountCents: 100, paidOn: new Date(Date.now() + 7 * 86_400_000) }, "app");
  assert(!future.ok, "future date rejected");
  const p1 = await recordPayment(user.id, inv.id, { amountCents: 10000, method: "check", note: "deposit" }, "app");
  assert(p1.ok && p1.invoice.paidCents === 10000 && p1.invoice.status === "sent", "partial payment keeps status, sums paidCents");
  const p2 = await recordPayment(user.id, inv.id, { amountCents: 20000, method: "bank_transfer", paidOn: "2026-09-10" }, "api");
  assert(p2.ok && p2.invoice.status === "paid" && p2.invoice.paidAt?.toISOString().slice(0, 10) === "2026-09-10", "full balance flips to paid on the received date");
  const again = await recordPayment(user.id, inv.id, { amountCents: 1 }, "app");
  assert(!again.ok && again.status === 409, "paid invoice takes no more payments");
  const removed = await deletePayment(user.id, p2.ok ? p2.payment.id : "");
  assert(removed.ok && removed.invoice.status === "overdue" && removed.invoice.paidCents === 10000 && removed.invoice.paidAt === null, "removing the settling payment reopens as overdue");
  const marked = await setInvoiceStatus(user.id, inv.id, "paid", "app");
  assert(marked.ok && marked.invoice.paidCents === 30000 && marked.invoice.status === "paid", "mark as paid records the balance");
  const rows = await prisma.payment.findMany({ where: { invoiceId: inv.id } });
  assert(rows.length === 2 && rows.some((r) => r.note === "Marked paid"), "two payment rows, one from mark as paid");
  const voidRes = await setInvoiceStatus(user.id, made[1].id, "void", "app");
  const onVoid = await recordPayment(user.id, made[1].id, { amountCents: 5 }, "app");
  assert(voidRes.ok && !onVoid.ok && onVoid.status === 409, "void invoice rejects payments");

  await prisma.user.delete({ where: { id: user.id } });
  console.log("all checks passed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
