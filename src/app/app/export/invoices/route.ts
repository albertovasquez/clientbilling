import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { csvFilename, invoicesToCsv } from "@/lib/invoices/export-csv";

/** Merchant CSV of invoices (decision 0012). Auth required; scoped to the session user. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/app/sign-in", req.url));
  }

  const rows = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: { select: { name: true, email: true } } },
    orderBy: [{ issueDate: "desc" }, { number: "desc" }],
    take: 5000,
  });

  const csv = invoicesToCsv(
    rows.map((row) => ({
      number: row.number,
      status: row.status,
      clientName: row.client.name,
      clientEmail: row.client.email,
      issueDate: row.issueDate,
      dueDate: row.dueDate,
      currency: row.currency,
      subtotalCents: row.subtotalCents,
      taxCents: row.taxCents,
      totalCents: row.totalCents,
      paidCents: row.paidCents,
      sentAt: row.sentAt,
      paidAt: row.paidAt,
      publicId: row.publicId,
    })),
  );

  const filename = csvFilename("invoices");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
