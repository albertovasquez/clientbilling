/**
 * Integration check against a throwaway Postgres (see docs/product/invoice-mvp.md).
 * Run: DATABASE_URL=... DIRECT_URL=... npx tsx scripts/test-db-flows.ts
 * Exercises: password reset tokens, rate limit windows, invoice number uniqueness.
 */
import { compare } from "bcryptjs";
import { hashApiKey } from "../src/lib/api-keys";
import { ALL_SCOPES_STRING, hasScope, parseScopes } from "../src/lib/api-scopes";
import { userActor } from "../src/lib/billing/actor";
import { withIdempotency } from "../src/lib/billing/api-mutate";
import { beginIdempotency } from "../src/lib/billing/idempotency";
import { prisma } from "../src/lib/db";
import { serializePayment } from "../src/lib/invoices/payments";
import { deliverDueWebhooks } from "../src/lib/webhooks/deliver";
import { enqueueWebhook } from "../src/lib/webhooks/enqueue";
import { generateWebhookSecret } from "../src/lib/webhooks/sign";
import { agingBuckets, daysPastDue } from "../src/lib/invoices/aging";
import { nextAutoReminderKind } from "../src/lib/invoices/auto-reminder-kinds";
import { csvCell, csvFilename, invoicesToCsv, paymentsToCsv } from "../src/lib/invoices/export-csv";
import { fetchLogoForPdf, isAllowedLogoUrl } from "../src/lib/invoices/logo";
import { partitionStatementInvoices, statementBalanceCents } from "../src/lib/invoices/statements";
import { createResetToken, resetPasswordWithToken } from "../src/lib/password-reset";
import { deletePayment, recordPayment } from "../src/lib/invoices/payments";
import { createInvoice, setInvoiceStatus } from "../src/lib/invoices/service";
import { bpsToPercentInput, dueDateIsoFromDays } from "../src/lib/money";
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
  // Aging buckets (pure; no DB)
  const now = new Date("2026-09-18T15:00:00.000Z");
  const day = (offset: number) => new Date(Date.UTC(2026, 8, 18 + offset, 12));
  assert(daysPastDue(day(0), now) === 0, "due today is 0 days past");
  assert(daysPastDue(day(-1), now) === 1, "due yesterday is 1 day past");
  assert(daysPastDue(day(-45), now) === 45, "45 days past due");
  const aged = agingBuckets(
    [
      { dueDate: day(5), totalCents: 10000, paidCents: 0 },
      { dueDate: day(-10), totalCents: 20000, paidCents: 5000 },
      { dueDate: day(-40), totalCents: 30000, paidCents: 0 },
      { dueDate: day(-90), totalCents: 40000, paidCents: 10000 },
      { dueDate: null, totalCents: 7000, paidCents: 0 },
      { dueDate: day(-5), totalCents: 1000, paidCents: 1000 },
    ],
    now,
  );
  assert(aged.current.balanceCents === 17000 && aged.current.count === 2, "current includes future due and null dueDate");
  assert(aged.d1to30.balanceCents === 15000 && aged.d1to30.count === 1, "1-30 net of partial payment");
  assert(aged.d31to60.balanceCents === 30000 && aged.d31to60.count === 1, "31-60 bucket");
  assert(aged.d60plus.balanceCents === 30000 && aged.d60plus.count === 1, "60+ net of partial payment");

  // CSV export helpers (decision 0012)
  assert(csvCell("plain") === "plain", "plain csv cell");
  assert(csvCell('say "hi"') === '"say ""hi"""', "quotes escaped in csv");
  assert(csvCell("a,b") === '"a,b"', "comma forces quotes");
  assert(csvFilename("invoices", new Date("2026-09-18T12:00:00Z")) === "invoices-2026-09-18.csv", "invoice filename date");
  const invoiceCsv = invoicesToCsv([
    {
      number: "1001",
      status: "sent",
      clientName: "Acme, Inc",
      clientEmail: "a@example.com",
      issueDate: new Date("2026-09-01T00:00:00Z"),
      dueDate: new Date("2026-09-15T00:00:00Z"),
      currency: "USD",
      subtotalCents: 10000,
      taxCents: 800,
      totalCents: 10800,
      paidCents: 2000,
      sentAt: new Date("2026-09-01T00:00:00Z"),
      paidAt: null,
      publicId: "abc123def456",
    },
  ]);
  assert(invoiceCsv.includes("Acme, Inc") && invoiceCsv.includes("88.00"), "invoice csv quotes client and shows balance");
  const paymentCsv = paymentsToCsv([
    {
      paidOn: new Date("2026-09-10T00:00:00Z"),
      amountCents: 2000,
      method: "bank_transfer",
      note: "Deposit",
      source: "app",
      invoiceNumber: "1001",
      invoiceStatus: "sent",
      clientName: "Acme, Inc",
    },
  ]);
  assert(paymentCsv.includes("Bank transfer") && paymentCsv.includes("20.00"), "payment csv labels method and dollars");

  // Default terms helpers
  assert(bpsToPercentInput(825) === "8.25", "bps to percent input");
  assert(bpsToPercentInput(700) === "7", "whole percent has no decimals");
  assert(dueDateIsoFromDays(14, new Date("2026-09-18T15:00:00Z")) === "2026-10-02", "due date from days");

  // PDF logo URL gate
  assert(isAllowedLogoUrl("https://cdn.example.com/logo.png"), "https logo allowed");
  assert(!isAllowedLogoUrl("http://cdn.example.com/logo.png"), "http logo rejected");
  assert(!isAllowedLogoUrl(""), "empty logo rejected");
  assert((await fetchLogoForPdf("http://example.com/x.png")) === null, "fetch rejects http without requesting");

  // Auto-reminder kind selection (decision 0015)
  assert(nextAutoReminderKind(2, new Set()) === null, "before day 3 no auto reminder");
  assert(nextAutoReminderKind(3, new Set()) === 3, "day 3 picks +3");
  assert(nextAutoReminderKind(9, new Set([3])) === null, "between 3 and 10 with +3 done waits");
  assert(nextAutoReminderKind(10, new Set([3])) === 10, "day 10 picks +10");
  assert(nextAutoReminderKind(15, new Set()) === 3, "catch-up prefers +3 before +10");
  assert(nextAutoReminderKind(15, new Set([3, 10])) === null, "both sent means done");

  // Client statement helpers
  const statementRows = [
    { id: "1", number: "1", status: "overdue" as const, issueDate: new Date(), dueDate: new Date(), currency: "USD", totalCents: 10000, paidCents: 2500, paidAt: null },
    { id: "2", number: "2", status: "paid" as const, issueDate: new Date(), dueDate: null, currency: "USD", totalCents: 5000, paidCents: 5000, paidAt: new Date() },
    { id: "3", number: "3", status: "draft" as const, issueDate: new Date(), dueDate: null, currency: "USD", totalCents: 9000, paidCents: 0, paidAt: null },
  ];
  assert(statementBalanceCents(statementRows) === 7500, "statement balance nets open invoices only");
  const parts = partitionStatementInvoices(statementRows);
  assert(parts.open.length === 1 && parts.paid.length === 1 && parts.other.length === 1, "statement partitions open/paid/other");

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
  const before = await prisma.user.findUniqueOrThrow({ where: { email }, select: { sessionVersion: true } });
  assert(await resetPasswordWithToken(email, raw!, "newpass123"), "valid token resets password");
  const afterReset = await prisma.user.findUniqueOrThrow({ where: { email }, select: { sessionVersion: true } });
  assert(afterReset.sessionVersion === before.sessionVersion + 1, "reset bumps the session version");
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
  const burstKey = `burst:${Date.now()}`;
  const burst = await Promise.all(Array.from({ length: 12 }, () => allow(burstKey, 3, 60)));
  assert(burst.filter(Boolean).length === 3, `12 concurrent calls with limit 3 admit exactly 3 (got ${burst.filter(Boolean).length})`);

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
  const voidMissing = await setInvoiceStatus(user.id, made[1].id, "void", "app", "  ");
  assert(!voidMissing.ok && voidMissing.status === 400, "void without reason rejected");
  const voidRes = await setInvoiceStatus(user.id, made[1].id, "void", "app", "Duplicate invoice");
  assert(voidRes.ok && voidRes.invoice.voidReason === "Duplicate invoice", "void stores the reason");
  const onVoid = await recordPayment(user.id, made[1].id, { amountCents: 5 }, "app");
  assert(!onVoid.ok && onVoid.status === 409, "void invoice rejects payments");

  // Billing events, versions, idempotency (decision 0025 / epic #33)
  const billed = await createInvoice({
    userId: user.id,
    clientId: client.id,
    lines: [{ description: "Consulting", quantity: 1, unitPriceCents: 50000 }],
    taxRateBps: 0,
    dueDate: null,
    notes: null,
    source: "api",
    actor: userActor(user.id),
  });
  assert(billed.ok, "createInvoice for billing record");
  if (!billed.ok) throw new Error("unreachable");
  const be1 = await prisma.billingEvent.findMany({
    where: { aggregateType: "invoice", aggregateId: billed.invoice.id },
    orderBy: { sequence: "asc" },
  });
  assert(be1.length === 1 && be1[0]!.sequence === 1, "first billing event is sequence 1");
  assert(be1[0]!.actorType === "user" && be1[0]!.actorId === user.id, "mutation has a user actor");
  assert(be1[0]!.previousHash === "" && /^[a-f0-9]{64}$/.test(be1[0]!.eventHash), "genesis hash chain");
  const ver1 = await prisma.invoiceVersion.findMany({ where: { invoiceId: billed.invoice.id }, orderBy: { version: "asc" } });
  assert(ver1.length === 1 && ver1[0]!.version === 1, "create writes invoice version 1");

  await prisma.invoice.update({
    where: { id: billed.invoice.id },
    data: { status: "sent", sentAt: new Date(), totalCents: 50000, subtotalCents: 50000 },
  });
  const payOnce = await recordPayment(user.id, billed.invoice.id, { amountCents: 10000, method: "check" }, "api", userActor(user.id));
  assert(payOnce.ok, "partial payment on billed invoice");
  const be2 = await prisma.billingEvent.findMany({
    where: { aggregateType: "invoice", aggregateId: billed.invoice.id },
    orderBy: { sequence: "asc" },
  });
  assert(be2.length >= 2 && be2[1]!.previousHash === be1[0]!.eventHash, "second event chains previousHash");
  assert(be2[1]!.actorType === "user", "payment event has actor");
  const ver2 = await prisma.invoiceVersion.count({ where: { invoiceId: billed.invoice.id } });
  assert(ver2 >= 2, "payment bumps invoice version");

  const idemBody = JSON.stringify({ amountCents: 5000, method: "cash" });
  const keyA = `idem-${Date.now()}`;
  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, name: "test", keyHash: `hash-${keyA}`, prefix: "cb_live_test" },
  });
  const idemReq = (key: string, body: string) =>
    new Request(`http://localhost/api/v1/invoices/${billed.invoice.id}/payments`, {
      method: "POST",
      headers: { "Idempotency-Key": key, "Content-Type": "application/json" },
      body,
    });
  const paymentsBefore = await prisma.payment.count({ where: { invoiceId: billed.invoice.id } });
  const firstRes = await withIdempotency(
    { ok: true, userId: user.id, keyId: apiKey.id, actor: userActor(user.id), keyKind: "live" as const },
    idemReq(keyA, idemBody),
    async ({ body, actor }) => {
    const result = await recordPayment(
      user.id,
      billed.invoice.id,
      { amountCents: Number(body?.amountCents), method: body?.method == null ? null : String(body.method) },
      "api",
      actor,
    );
    if (!result.ok) return { error: result.error, status: result.status };
    return { status: 201, body: { payment: serializePayment(result.payment) } };
  },
  );
  assert(firstRes.status === 201, "first idempotent payment succeeds");
  const replayRes = await withIdempotency(
    { ok: true, userId: user.id, keyId: apiKey.id, actor: userActor(user.id), keyKind: "live" as const },
    idemReq(keyA, idemBody),
    async () => {
    throw new Error("handler must not run on replay");
  },
  );
  assert(replayRes.status === 201 && replayRes.headers.get("Idempotency-Replayed") === "true", "same key+body replays without re-running");
  const paymentsAfter = await prisma.payment.count({ where: { invoiceId: billed.invoice.id } });
  assert(paymentsAfter === paymentsBefore + 1, "duplicate idempotent request does not create a second payment");
  const conflict = await beginIdempotency(user.id, idemReq(keyA, JSON.stringify({ amountCents: 1 })), JSON.stringify({ amountCents: 1 }));
  assert(!conflict.ok && conflict.response.status === 409, "same key different body conflicts");
  const missing = await beginIdempotency(user.id, new Request("http://localhost/api/v1/invoices", { method: "POST", body: "{}" }), "{}");
  assert(!missing.ok && missing.response.status === 400, "missing Idempotency-Key rejected");
  const concurrent = await Promise.all([
    beginIdempotency(user.id, idemReq(`race-${keyA}`, idemBody), idemBody),
    beginIdempotency(user.id, idemReq(`race-${keyA}`, idemBody), idemBody),
  ]);
  assert(concurrent.filter((r) => r.ok).length === 1, "concurrent same-key claims admit exactly one");
  assert(concurrent.some((r) => !r.ok && r.response.status === 409), "the other concurrent claim is in progress or conflict");

  // Scopes, service accounts, webhooks (decision 0026 / epic #34)
  assert(hasScope(parseScopes("invoice:read"), "invoice:read"), "scope parse allows invoice:read");
  assert(!hasScope(parseScopes("invoice:read"), "payment:record"), "scope parse denies payment:record");
  const sa = await prisma.serviceAccount.create({ data: { userId: user.id, name: "agent" } });
  const saKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: "sa",
      keyHash: hashApiKey(`cb_live_sa_${Date.now()}`),
      prefix: "cb_live_sa",
      scopes: ALL_SCOPES_STRING,
      serviceAccountId: sa.id,
    },
  });
  const saCreated = await createInvoice({
    userId: user.id,
    clientId: client.id,
    lines: [{ description: "Agent work", quantity: 1, unitPriceCents: 1000 }],
    taxRateBps: 0,
    dueDate: null,
    notes: null,
    source: "api",
    actor: { type: "service_account", id: sa.id, authorizationId: saKey.id },
  });
  assert(saCreated.ok, "service-account create succeeds");
  if (!saCreated.ok) throw new Error("unreachable");
  const saEvent = await prisma.billingEvent.findFirst({
    where: { aggregateId: saCreated.invoice.id, type: "created" },
  });
  assert(saEvent?.actorType === "service_account" && saEvent.actorId === sa.id, "service-account actor on billing event");

  // Create → mark sent → observe via local webhook receiver (epic #34 exit).
  const http = await import("node:http");
  const received: { type?: string; raw: string; signature?: string }[] = [];
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      let type: string | undefined;
      try {
        type = JSON.parse(raw).type;
      } catch {
        type = undefined;
      }
      received.push({ type, raw, signature: req.headers["clientbilling-signature"] as string | undefined });
      res.writeHead(200);
      res.end("ok");
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no listen port");
  const hookUrl = `http://127.0.0.1:${addr.port}/hooks`;
  const secret = generateWebhookSecret();
  const endpoint = await prisma.webhookEndpoint.create({
    data: { userId: user.id, url: hookUrl, secret },
  });
  // createInvoice already enqueued invoice.created when saCreated ran before the endpoint existed.
  const observe = await createInvoice({
    userId: user.id,
    clientId: client.id,
    lines: [{ description: "Observe", quantity: 1, unitPriceCents: 2500 }],
    taxRateBps: 0,
    dueDate: null,
    notes: null,
    source: "api",
    actor: { type: "service_account", id: sa.id, authorizationId: saKey.id },
  });
  assert(observe.ok, "observe invoice created");
  if (!observe.ok) throw new Error("unreachable");
  const sent = await setInvoiceStatus(user.id, observe.invoice.id, "sent", "api", null, {
    type: "service_account",
    id: sa.id,
    authorizationId: saKey.id,
  });
  assert(sent.ok, "observe invoice marked sent");
  const pending = await prisma.webhookDelivery.count({
    where: { endpointId: endpoint.id, status: "pending" },
  });
  assert(pending >= 2, "created and sent webhooks queued");
  const delivered = await deliverDueWebhooks(20);
  assert(delivered.delivered >= 2, "webhook deliveries succeeded against local receiver");
  assert(
    received.some((r) => r.type === "invoice.created") && received.some((r) => r.type === "invoice.sent"),
    "receiver saw invoice.created and invoice.sent",
  );
  assert(received.every((r) => typeof r.signature === "string" && r.signature.includes("v1=")), "deliveries were signed");
  server.close();

  // Issue #65: a delivery row and the mutation it describes commit together or
  // not at all. Before the fix, enqueueing used the global client, so a
  // transaction that rolled back still left the row behind: an event announcing
  // a mutation that never happened.
  const beforeRollback = await prisma.webhookDelivery.count({ where: { endpointId: endpoint.id } });
  try {
    await prisma.$transaction(async (tx) => {
      await enqueueWebhook(tx, user.id, "invoice.created", { invoiceId: "rolled-back" }, userActor(user.id));
      throw new Error("simulated failure after enqueue");
    });
  } catch {
    /* expected: the throw is the point */
  }
  const afterRollback = await prisma.webhookDelivery.count({ where: { endpointId: endpoint.id } });
  assert(afterRollback === beforeRollback, "a rolled-back mutation queues no webhook");

  await prisma.$transaction(async (tx) => {
    await enqueueWebhook(tx, user.id, "invoice.paid", { invoiceId: "committed" }, userActor(user.id));
  });
  const afterCommit = await prisma.webhookDelivery.count({ where: { endpointId: endpoint.id } });
  assert(afterCommit === beforeRollback + 1, "a committed mutation queues its webhook");

  // The duplicate case stays tolerated: the same event twice is not an error.
  // The write after it is the point. On Postgres a failed statement poisons
  // the transaction, so an implementation that caught the unique violation
  // instead of skipping it would leave this update silently discarded while
  // the transaction still appeared to succeed.
  const twice = "evt_duplicate_probe";
  await prisma.$transaction(async (tx) => {
    await enqueueWebhook(tx, user.id, "invoice.sent", { invoiceId: "dup" }, userActor(user.id), twice);
  });
  const nameBefore = user.name;
  let duplicateThrew = false;
  try {
    await prisma.$transaction(async (tx) => {
      await enqueueWebhook(tx, user.id, "invoice.sent", { invoiceId: "dup" }, userActor(user.id), twice);
      await tx.user.update({ where: { id: user.id }, data: { name: "survived-the-duplicate" } });
    });
  } catch {
    duplicateThrew = true;
  }
  assert(!duplicateThrew, "a repeated eventId is tolerated, not thrown");
  const afterDuplicate = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } });
  assert(
    afterDuplicate?.name === "survived-the-duplicate",
    "a write after a duplicate enqueue still commits (the transaction was not poisoned)",
  );
  await prisma.user.update({ where: { id: user.id }, data: { name: nameBefore } });

  await prisma.user.delete({ where: { id: user.id } });
  console.log("all checks passed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
