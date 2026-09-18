import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { pdfFilename, renderInvoicePdf } from "@/lib/invoices/pdf";

/** Merchant download of their own invoice as PDF. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  if (!process.env.DATABASE_URL) return new Response("Database not configured", { status: 503 });

  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } }, user: { include: { business: true } } },
  });
  if (!invoice) return new Response("Not found", { status: 404 });

  const data = { ...invoice, business: invoice.user.business };
  const pdf = await renderInvoicePdf(data);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFilename(data)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
