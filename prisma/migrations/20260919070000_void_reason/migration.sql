-- Required void reason for auditability (roadmap P1).
ALTER TABLE "Invoice" ADD COLUMN "voidReason" TEXT;
