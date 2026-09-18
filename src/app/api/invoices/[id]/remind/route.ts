import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendInvoiceReminder } from "@/lib/invoices/email";

/** Send a payment reminder to the client on file (decision 0015). */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const result = await sendInvoiceReminder(session.user.id, id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, to: result.to });
}
