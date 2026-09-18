-- Opt-in automatic reminders at +3 and +10 days past due (decision 0015).
ALTER TABLE "BusinessProfile" ADD COLUMN "autoReminders" BOOLEAN NOT NULL DEFAULT false;
