-- Recurring invoice schedules (decision 0018)
CREATE TYPE "RecurringCadence" AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');

CREATE TABLE "RecurringSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "cadence" "RecurringCadence" NOT NULL DEFAULT 'monthly',
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "dueInDays" INTEGER NOT NULL DEFAULT 14,
    "taxRateBps" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "linesJson" TEXT NOT NULL,
    "autoSend" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringSchedule_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RecurringSchedule_userId_idx" ON "RecurringSchedule"("userId");
CREATE INDEX "RecurringSchedule_active_nextRunAt_idx" ON "RecurringSchedule"("active", "nextRunAt");

ALTER TABLE "RecurringSchedule" ADD CONSTRAINT "RecurringSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecurringSchedule" ADD CONSTRAINT "RecurringSchedule_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD COLUMN "recurringScheduleId" TEXT;
CREATE INDEX "Invoice_recurringScheduleId_idx" ON "Invoice"("recurringScheduleId");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_recurringScheduleId_fkey" FOREIGN KEY ("recurringScheduleId") REFERENCES "RecurringSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
