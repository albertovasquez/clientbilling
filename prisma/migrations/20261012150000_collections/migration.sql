-- Collections service, week 1 (decision 0020): imported B2B debtor accounts and per-account questionnaire.
CREATE TYPE "CollectionRelationship" AS ENUM ('active', 'ended', 'one_off');
CREATE TYPE "CollectionTone" AS ENUM ('warm', 'neutral', 'firm');
CREATE TYPE "CollectionEscalation" AS ENUM ('owner_follow_up', 'pause', 'write_off');
CREATE TYPE "CollectionAccountStatus" AS ENUM ('needs_review', 'ready', 'paused');

CREATE TABLE "CollectionImport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT,
    "rowCount" INTEGER NOT NULL,
    "businessDebtAttest" BOOLEAN NOT NULL,
    "attestedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionImport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CollectionAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "importId" TEXT,
    "debtorName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "invoiceDate" TIMESTAMP(3),
    "ageDays" INTEGER,
    "description" TEXT,
    "status" "CollectionAccountStatus" NOT NULL DEFAULT 'needs_review',
    "relationship" "CollectionRelationship",
    "disputed" BOOLEAN,
    "disputeNotes" TEXT,
    "minSettlementPct" INTEGER,
    "maxPlanMonths" INTEGER,
    "tone" "CollectionTone",
    "escalation" "CollectionEscalation",
    "escalationNotes" TEXT,
    "questionnaireDoneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionAccount_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CollectionImport_userId_idx" ON "CollectionImport"("userId");
CREATE INDEX "CollectionAccount_userId_status_idx" ON "CollectionAccount"("userId", "status");
CREATE INDEX "CollectionAccount_importId_idx" ON "CollectionAccount"("importId");

ALTER TABLE "CollectionImport" ADD CONSTRAINT "CollectionImport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionAccount" ADD CONSTRAINT "CollectionAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionAccount" ADD CONSTRAINT "CollectionAccount_importId_fkey" FOREIGN KEY ("importId") REFERENCES "CollectionImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
