import { NextResponse } from "next/server";
import { cronAuthorized } from "@/lib/cron-auth";
import { runDueSchedules } from "@/lib/invoices/recurring";

/** Daily recurring sweep (decision 0018). Same bearer secret as the overdue sweep. */
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const results = await runDueSchedules();
  return NextResponse.json({
    ok: true,
    generated: results.filter((r) => r.invoiceId).length,
    sent: results.filter((r) => r.sent).length,
    failed: results.filter((r) => r.error).length,
  });
}
