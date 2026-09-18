import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { formatCents } from "@/lib/money";
import { allow, ipFromHeaders } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

/**
 * Payer card-intent signal (decision 0013). Unauthenticated by design. Stores
 * no payer data. Emails the merchant once per invoice.
 */
export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: false }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { publicId?: string };
  const publicId = typeof body.publicId === "string" ? body.publicId.slice(0, 32) : "";
  if (!/^[0-9a-z]{6,32}$/.test(publicId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip = ipFromHeaders(req.headers);
  if (!(await allow(`card-intent:${ip}`, 10, 3600))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    include: { client: { select: { name: true } }, user: { include: { business: true } } },
  });
  if (!invoice || invoice.status === "paid" || invoice.status === "void") {
    return NextResponse.json({ ok: true });
  }

  const alreadyAsked = await prisma.invoiceEvent.findFirst({
    where: { invoiceId: invoice.id, type: "card_intent" },
    select: { id: true },
  });

  // One invoice event per invoice; repeats are counted in the analytics payload only.
  if (!alreadyAsked) await prisma.invoiceEvent.create({ data: { invoiceId: invoice.id, type: "card_intent" } });
  await recordEvent({
    name: "payer_card_intent",
    userId: invoice.userId,
    payload: { invoiceId: invoice.id, repeat: Boolean(alreadyAsked) },
    country: req.headers.get("x-vercel-ip-country"),
  });

  if (!alreadyAsked) {
    const to = invoice.user.business?.email || invoice.user.email;
    const merchantName = invoice.user.business?.name || siteConfig.name;
    await sendEmail({
      to,
      subject: `A client asked to pay invoice #${invoice.number} by card`,
      text: [
        `Hi ${merchantName},`,
        "",
        `Someone viewing invoice #${invoice.number} (${invoice.client.name}, ${formatCents(invoice.totalCents, invoice.currency)}) said they would prefer to pay by card.`,
        "",
        "Card payment from the invoice page is planned to run on a CDG Commerce merchant account. If you want one in place, request a free quote here:",
        siteConfig.quoteUrl,
        "",
        `You can see all card requests on your dashboard: ${siteConfig.url}/app`,
        "",
        `${siteConfig.name}`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ ok: true });
}
