import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { BusinessProfile, Client, Invoice, InvoiceLineItem } from "@prisma/client";
import { balanceCents } from "@/lib/invoices/payments";
import { payLinkForInvoice } from "@/lib/pay-link";
import { payerStatusLabel } from "@/lib/invoices/status";
import { bpsToPercentLabel, formatCents, lineTotalCents } from "@/lib/money";
import { siteConfig } from "@/lib/site";

/**
 * Branded invoice PDF (decision 0016). Same data and wording as /i/[publicId].
 * Built-in Helvetica keeps rendering deterministic with no font fetching.
 * No card data, no affiliate links, ClientBilling only in the footer.
 */
export type InvoiceForPdf = Invoice & {
  client: Client;
  lineItems: InvoiceLineItem[];
  business: BusinessProfile | null;
};

const ink = "#0f172a";
const soft = "#334155";
const muted = "#64748b";
const rule = "#e2e8f0";
const action = "#115e59";

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, fontFamily: "Helvetica", fontSize: 10, color: soft },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  merchant: { fontSize: 16, fontFamily: "Helvetica-Bold", color: ink },
  small: { fontSize: 9, color: muted },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: ink, textAlign: "right" },
  status: { fontSize: 10, textAlign: "right", marginTop: 2, color: soft },
  statusPaid: { color: action, fontFamily: "Helvetica-Bold" },
  cols: { flexDirection: "row", marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: rule },
  col: { flex: 1, paddingRight: 12 },
  label: { fontSize: 8, color: muted, marginBottom: 3, fontFamily: "Helvetica-Bold" },
  table: { marginTop: 24 },
  row: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: rule },
  head: { borderBottomColor: "#cbd5e1", fontFamily: "Helvetica-Bold", color: ink },
  cDesc: { flex: 6 },
  cQty: { flex: 1, textAlign: "right" },
  cPrice: { flex: 2, textAlign: "right" },
  cAmt: { flex: 2, textAlign: "right" },
  totals: { marginTop: 10, alignSelf: "flex-end", width: 220 },
  tRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  tTotal: { borderTopWidth: 1, borderTopColor: "#cbd5e1", marginTop: 4, paddingTop: 6, fontFamily: "Helvetica-Bold", color: ink, fontSize: 12 },
  section: { marginTop: 24 },
  h2: { fontSize: 11, fontFamily: "Helvetica-Bold", color: ink, marginBottom: 4 },
  pay: { marginTop: 24, padding: 12, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: rule, borderRadius: 6 },
  link: { color: action },
  footer: { position: "absolute", left: 48, right: 48, bottom: 28, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: muted, borderTopWidth: 1, borderTopColor: rule, paddingTop: 6 },
});

function date(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export function InvoicePdf({ invoice }: { invoice: InvoiceForPdf }) {
  const b = invoice.business;
  const merchant = b?.name || "Your vendor";
  const paid = invoice.status === "paid";
  const balance = balanceCents(invoice);
  const partial = !paid && invoice.paidCents > 0;
  const address = [b?.address1, b?.address2, [b?.city, b?.state, b?.postalCode].filter(Boolean).join(", ")].filter(Boolean);
  const instructions = b?.paymentInstructions?.trim();
  const payLink = payLinkForInvoice(b?.payLinkUrl, balance, invoice.currency);

  return (
    <Document title={`Invoice ${invoice.number} from ${merchant}`} author={merchant} producer={siteConfig.name}>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.merchant}>{merchant}</Text>
            {b?.email ? <Text style={s.small}>{b.email}</Text> : null}
            {b?.phone ? <Text style={s.small}>{b.phone}</Text> : null}
          </View>
          <View>
            <Text style={s.title}>Invoice #{invoice.number}</Text>
            <Text style={[s.status, ...(paid ? [s.statusPaid] : [])]}>{payerStatusLabel(invoice.status, invoice.dueDate)}</Text>
          </View>
        </View>

        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.label}>FROM</Text>
            <Text>{merchant}</Text>
            {address.map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
          </View>
          <View style={s.col}>
            <Text style={s.label}>BILL TO</Text>
            <Text>{invoice.client.name}</Text>
            {invoice.client.company ? <Text>{invoice.client.company}</Text> : null}
            {invoice.client.email ? <Text>{invoice.client.email}</Text> : null}
          </View>
          <View style={s.col}>
            <Text style={s.label}>DATES</Text>
            <Text>Issued {date(invoice.issueDate)}</Text>
            <Text>{invoice.dueDate ? `Due ${date(invoice.dueDate)}` : "Due on receipt"}</Text>
            {paid && invoice.paidAt ? <Text>Paid {date(invoice.paidAt)}</Text> : null}
          </View>
        </View>

        <View style={s.table}>
          <View style={[s.row, s.head]}>
            <Text style={s.cDesc}>Description</Text>
            <Text style={s.cQty}>Qty</Text>
            <Text style={s.cPrice}>Price</Text>
            <Text style={s.cAmt}>Amount</Text>
          </View>
          {invoice.lineItems.map((line) => (
            <View key={line.id} style={s.row} wrap={false}>
              <Text style={s.cDesc}>{line.description}</Text>
              <Text style={s.cQty}>{String(line.quantity)}</Text>
              <Text style={s.cPrice}>{formatCents(line.unitPriceCents)}</Text>
              <Text style={s.cAmt}>{formatCents(lineTotalCents(String(line.quantity), line.unitPriceCents))}</Text>
            </View>
          ))}
        </View>

        <View style={s.totals}>
          <View style={s.tRow}>
            <Text style={{ color: muted }}>Subtotal</Text>
            <Text>{formatCents(invoice.subtotalCents)}</Text>
          </View>
          {invoice.taxRateBps > 0 ? (
            <View style={s.tRow}>
              <Text style={{ color: muted }}>Tax ({bpsToPercentLabel(invoice.taxRateBps)})</Text>
              <Text>{formatCents(invoice.taxCents)}</Text>
            </View>
          ) : null}
          {partial ? (
            <>
              <View style={[s.tRow, s.tTotal]}>
                <Text>Total</Text>
                <Text>{formatCents(invoice.totalCents, invoice.currency)}</Text>
              </View>
              <View style={s.tRow}>
                <Text style={{ color: muted }}>Paid to date</Text>
                <Text>{formatCents(invoice.paidCents, invoice.currency)}</Text>
              </View>
              <View style={[s.tRow, s.tTotal]}>
                <Text>Balance due</Text>
                <Text>{formatCents(balance, invoice.currency)}</Text>
              </View>
            </>
          ) : (
            <View style={[s.tRow, s.tTotal]}>
              <Text>{paid ? "Total paid" : "Total due"}</Text>
              <Text>{formatCents(invoice.totalCents, invoice.currency)}</Text>
            </View>
          )}
        </View>

        {invoice.notes ? (
          <View style={s.section}>
            <Text style={s.h2}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        ) : null}

        {!paid ? (
          <View style={s.pay} wrap={false}>
            <Text style={s.h2}>How to pay</Text>
            {payLink ? <Text style={s.link}>Pay online: {payLink}</Text> : null}
            {instructions ? (
              <Text style={{ marginTop: payLink ? 4 : 0 }}>{instructions}</Text>
            ) : !payLink ? (
              <Text>
                Contact {merchant}
                {b?.email ? ` at ${b.email}` : ""} for payment options.
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={s.footer} fixed>
          <Text>
            Invoice #{invoice.number} from {merchant}
          </Text>
          <Text>Invoice software by {siteConfig.name}. Card data is never collected.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(invoice: InvoiceForPdf): Promise<Buffer> {
  return renderToBuffer(<InvoicePdf invoice={invoice} />);
}

export function pdfFilename(invoice: InvoiceForPdf): string {
  const merchant = (invoice.business?.name || "invoice").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `${merchant || "invoice"}-invoice-${invoice.number}.pdf`;
}
