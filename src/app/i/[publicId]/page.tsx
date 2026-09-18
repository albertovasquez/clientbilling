import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { buttonClass, Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { bpsToPercentLabel, formatCents } from "@/lib/money";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  return {
    title: `Invoice ${publicId}`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicInvoicePage({ params }: Props) {
  if (!process.env.DATABASE_URL) {
    return (
      <main className="mx-auto max-w-article px-4 py-14">
        <Heading level={1}>Invoice unavailable</Heading>
        <p className="mt-4 text-body text-ink-soft">
          The invoice database is not configured on this deployment yet.
        </p>
      </main>
    );
  }

  const { publicId } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      user: { include: { business: true } },
    },
  });
  if (!invoice || invoice.status === "void") notFound();

  if (!invoice.viewedAt && invoice.status === "sent") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "viewed",
        viewedAt: new Date(),
        events: { create: { type: "viewed" } },
      },
    });
  } else if (!invoice.viewedAt) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        viewedAt: new Date(),
        events: { create: { type: "viewed" } },
      },
    });
  }

  const business = invoice.user.business;
  const quantumConnected = business?.quantumConnected ?? false;

  return (
    <main className="mx-auto max-w-article px-4 py-10 sm:py-14 print:py-4">
      <p className="text-caption text-muted">{siteConfig.name}</p>
      <Heading level={1} className="mt-2">
        Invoice #{invoice.number}
      </Heading>
      <p className="mt-2 text-small text-ink-soft">Status: {invoice.status}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-small font-semibold text-ink">From</h2>
          <p className="mt-1 text-small text-ink-soft">
            {business?.name || "Business"}
            <br />
            {business?.email}
            {business?.address1 ? (
              <>
                <br />
                {business.address1}
              </>
            ) : null}
            {business?.city ? (
              <>
                <br />
                {[business.city, business.state, business.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </>
            ) : null}
          </p>
        </div>
        <div>
          <h2 className="text-small font-semibold text-ink">Bill to</h2>
          <p className="mt-1 text-small text-ink-soft">
            {invoice.client.name}
            {invoice.client.company ? (
              <>
                <br />
                {invoice.client.company}
              </>
            ) : null}
            {invoice.client.email ? (
              <>
                <br />
                {invoice.client.email}
              </>
            ) : null}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-2 text-small sm:grid-cols-2">
        <div>
          <dt className="text-muted">Issued</dt>
          <dd>{invoice.issueDate.toISOString().slice(0, 10)}</dd>
        </div>
        <div>
          <dt className="text-muted">Due</dt>
          <dd>
            {invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : "On receipt"}
          </dd>
        </div>
      </dl>

      <table className="mt-8 w-full border-collapse text-small">
        <thead>
          <tr className="border-b border-rule-strong text-left">
            <th className="py-2 font-semibold">Description</th>
            <th className="py-2 font-semibold">Qty</th>
            <th className="py-2 font-semibold">Price</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((line) => (
            <tr key={line.id} className="border-b border-rule">
              <td className="py-2">{line.description}</td>
              <td className="py-2">{String(line.quantity)}</td>
              <td className="py-2">{formatCents(line.unitPriceCents)}</td>
              <td className="py-2 text-right">
                {formatCents(Math.round(Number(line.quantity) * line.unitPriceCents))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 ml-auto max-w-xs space-y-1 text-small">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatCents(invoice.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Tax ({bpsToPercentLabel(invoice.taxRateBps)})</dt>
          <dd>{formatCents(invoice.taxCents)}</dd>
        </div>
        <div className="flex justify-between text-body font-semibold">
          <dt>Total</dt>
          <dd>{formatCents(invoice.totalCents, invoice.currency)}</dd>
        </div>
      </dl>

      {invoice.notes ? (
        <div className="mt-8">
          <h2 className="text-small font-semibold text-ink">Notes</h2>
          <p className="mt-1 whitespace-pre-wrap text-small text-ink-soft">
            {invoice.notes}
          </p>
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-rule bg-field p-6 print:hidden">
        <Heading level={2}>Pay</Heading>
        {invoice.status === "paid" ? (
          <p className="mt-2 text-small text-ink-soft">This invoice is marked paid.</p>
        ) : quantumConnected ? (
          <div className="mt-2 space-y-3">
            <p className="text-small text-ink-soft">
              Online card pay via Quantum hosted checkout is coming soon for this
              merchant. No card fields are shown on ClientBilling.
            </p>
            <p className="text-caption text-muted">
              Connected merchant: {business?.quantumMerchantLabel || "Quantum"}
            </p>
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            <p className="text-small text-ink-soft">
              The sender has not connected online card collection yet. You can
              still settle by the method they note above, or they can enable
              Quantum through CDG Commerce.
            </p>
            <TrackedAffiliateLink
              href={siteConfig.affiliateSignupUrl}
              ctaPosition="card"
              ctaText="Start a CDG application"
              ctaType="apply"
              className={buttonClass("secondary", "md")}
            >
              Sender: start a CDG application
            </TrackedAffiliateLink>
          </div>
        )}
      </section>

      <p className="mt-8 text-caption text-muted print:hidden">
        Print this page for a PDF. ClientBilling provides invoice software only.
        Card processing, when used, is provided by CDG Commerce / Quantum Gateway.
      </p>
    </main>
  );
}
