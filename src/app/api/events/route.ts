import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { recordEvent } from "@/lib/events";

const allowedNames = new Set(["affiliate_cta_click", "calculator_complete"]);

/** Browser event sink (decision 0007). Accepts a small allowlist of event names. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; path?: unknown; payload?: unknown }
    | null;
  if (!body || typeof body.name !== "string" || !allowedNames.has(body.name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const session = await auth().catch(() => null);
  const country = req.headers.get("x-vercel-ip-country");
  await recordEvent({
    name: body.name,
    path: typeof body.path === "string" ? body.path : undefined,
    userId: session?.user?.id ?? null,
    payload: body.payload && typeof body.payload === "object" ? (body.payload as Record<string, unknown>) : undefined,
    country,
  });
  return NextResponse.json({ ok: true });
}
