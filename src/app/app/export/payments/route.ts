import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { csvFilename, paymentsToCsv } from "@/lib/invoices/export-csv";

/** Merchant CSV of payment records (decision 0012). Auth required; scoped to the session user. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/app/sign-in", req.url));
  }

  const rows = await prisma.payment.findMany({
    where: { userId: session.user.id },
    include: {
      invoice: {
        select: {
          number: true,
          status: true,
          client: { select: { name: true } },
        },
      },
    },
    orderBy: [{ paidOn: "desc" }, { createdAt: "desc" }],
    take: 5000,
  });

  const csv = paymentsToCsv(
    rows.map((row) => ({
      paidOn: row.paidOn,
      amountCents: row.amountCents,
      method: row.method,
      note: row.note,
      source: row.source,
      invoiceNumber: row.invoice.number,
      invoiceStatus: row.invoice.status,
      clientName: row.invoice.client.name,
    })),
  );

  const filename = csvFilename("payments");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
