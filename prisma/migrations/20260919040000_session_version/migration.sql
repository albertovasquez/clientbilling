-- Session versioning so a password reset signs out every existing session (decision 0020)
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;
