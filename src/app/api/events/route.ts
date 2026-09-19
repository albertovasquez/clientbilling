import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { browserEventNames } from "@/lib/browser-events";
import { recordEvent } from "@/lib/events";
import { allow, ipFromHeaders } from "@/lib/rate-limit";

const allowedNames = new Set<string>(browserEventNames);

/** Browser event sink (decision 0007). Accepts a small allowlist of event names. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; path?: unknown; payload?: unknown }
    | null;
  if (!body || typeof body.name !== "string" || !allowedNames.has(body.name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!(await allow(`events:${ipFromHeaders(req.headers)}`, 60, 60))) {
    return NextResponse.json({ ok: false }, { status: 429 });
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
