import { prisma } from "@/lib/db";
import { pdfFilename, renderInvoicePdf } from "@/lib/invoices/pdf";

export const dynamic = "force-dynamic";

/** Payer download of the invoice PDF by public id. Same access rule as the page. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ publicId: string }> },
) {
  if (!process.env.DATABASE_URL) return new Response("Unavailable", { status: 503 });
  const { publicId } = await ctx.params;
  if (!/^[0-9a-z]{6,32}$/.test(publicId)) return new Response("Not found", { status: 404 });

  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } }, user: { include: { business: true } } },
  });
  if (!invoice || invoice.status === "void") return new Response("Not found", { status: 404 });

  const data = { ...invoice, business: invoice.user.business };
  const pdf = await renderInvoicePdf(data);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdfFilename(data)}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
