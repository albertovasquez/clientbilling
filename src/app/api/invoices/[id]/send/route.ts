import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendInvoiceEmail } from "@/lib/invoices/email";

/** Email the public invoice link and PDF to the client on file (decision 0004). */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const result = await sendInvoiceEmail(session.user.id, id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, mode: "sent", to: result.to });
}
