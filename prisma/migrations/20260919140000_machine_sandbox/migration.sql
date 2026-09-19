-- Machine-tier flag designed but not enforced; sandbox keys use cb_test_ (decision 0027).
ALTER TABLE "User" ADD COLUMN "machineEnabled" BOOLEAN NOT NULL DEFAULT false;
