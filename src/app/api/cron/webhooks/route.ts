import { NextResponse } from "next/server";
import { cronAuthorized } from "@/lib/cron-auth";
import { deliverDueWebhooks } from "@/lib/webhooks/deliver";

/** Deliver due signed webhooks (decision 0026). */
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const result = await deliverDueWebhooks();
  return NextResponse.json({ ok: true, ...result });
}
