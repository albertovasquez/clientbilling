import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { pdfFilename, renderInvoicePdf } from "@/lib/invoices/pdf";
import { publicInvoiceVisible } from "@/lib/invoices/visibility";
import { allow, ipFromHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Payer download of the invoice PDF by public id. Same access rule as the
 * page. Rendering is the most expensive thing a stranger can trigger, so it
 * is rate limited per address and per invoice and answers 304 when the
 * invoice has not changed (decision 0020).
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ publicId: string }> },
) {
  if (!process.env.DATABASE_URL) return new Response("Unavailable", { status: 503 });
  const { publicId } = await ctx.params;
  if (!/^[0-9a-z]{6,32}$/.test(publicId)) return new Response("Not found", { status: 404 });

  const ip = ipFromHeaders(req.headers);
  const [ipOk, idOk] = await Promise.all([allow(`pdf:ip:${ip}`, 30, 600), allow(`pdf:id:${publicId}`, 120, 3600)]);
  if (!ipOk || !idOk) return new Response("Too many requests", { status: 429, headers: { "Retry-After": "600" } });

  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } }, user: { include: { business: true } } },
  });
  if (!invoice) return new Response("Not found", { status: 404 });
  const session = await auth().catch(() => null);
  if (!publicInvoiceVisible(invoice, session?.user?.id)) return new Response("Not found", { status: 404 });

  const etag = `W/"${invoice.updatedAt.getTime()}-${invoice.paidCents}-${invoice.status}"`;
  const headers = {
    "Cache-Control": "private, max-age=300",
    ETag: etag,
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (req.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });

  const data = { ...invoice, business: invoice.user.business };
  const pdf = await renderInvoicePdf(data);
  return new Response(new Uint8Array(pdf), {
    headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdfFilename(data)}"`,
    },
  });
}
