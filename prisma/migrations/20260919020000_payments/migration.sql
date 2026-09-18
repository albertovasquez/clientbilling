-- Partial payments and payment records (decision 0019)
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'check', 'bank_transfer', 'card', 'other');

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'other',
    "paidOn" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "source" TEXT NOT NULL DEFAULT 'app',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");
CREATE INDEX "Payment_userId_paidOn_idx" ON "Payment"("userId", "paidOn");

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD COLUMN "paidCents" INTEGER NOT NULL DEFAULT 0;

-- Invoices already marked paid get one balancing record so totals reconcile.
INSERT INTO "Payment" ("id", "invoiceId", "userId", "amountCents", "method", "paidOn", "note", "source")
SELECT 'pay_' || "id", "id", "userId", "totalCents", 'other', COALESCE("paidAt", "updatedAt"), 'Marked paid before payment records existed', 'migration'
FROM "Invoice" WHERE "status" = 'paid' AND "totalCents" > 0;

UPDATE "Invoice" SET "paidCents" = "totalCents" WHERE "status" = 'paid';
