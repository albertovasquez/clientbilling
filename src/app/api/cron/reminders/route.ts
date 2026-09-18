import { NextResponse } from "next/server";
import { cronAuthorized } from "@/lib/cron-auth";
import { runDueAutoReminders } from "@/lib/invoices/auto-reminders";

/**
 * Daily opt-in automatic reminders (decision 0015). Runs after the overdue
 * sweep. Same recipient and copy rules as manual reminders.
 */
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const results = await runDueAutoReminders();
  const sent = results.filter((r) => r.sent).length;
  const failed = results.filter((r) => r.error).length;
  return NextResponse.json({ ok: true, considered: results.length, sent, failed });
}
