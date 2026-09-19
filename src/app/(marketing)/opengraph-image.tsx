import { ImageResponse } from "next/og";
import { exampleInvoice, exampleInvoiceCosts } from "@/lib/example-invoice";
import { formatCents } from "@/lib/money";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}: Bill clients. Know what getting paid costs.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The homepage share card (ticket #45). Same tokens as the page: paper ground,
 * ink text, carbon as the one accent, and the stacked record from the mark.
 * Values are literal hex because the OG renderer has no stylesheet; they match
 * the @theme block in globals.css and the table in docs/STYLE_GUIDE.md.
 */
const token = {
  paper: "#FBFAF6",
  sheet: "#FFFFFF",
  ink: "#15142B",
  muted: "#6E6C80",
  rule: "#E6E3DA",
  ruleStrong: "#C8C4B6",
  carbon: "#3F3BA6",
  carbonTint: "#ECEBF8",
  cleared: "#1E7A4D",
};

/** One row of the cost table on the front sheet. */
function CostRow({
  label,
  value,
  tone = "ink",
  top = true,
}: {
  label: string;
  value: string;
  tone?: "ink" | "muted" | "cleared";
  top?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderTop: top ? `1px solid ${token.rule}` : "none",
        fontSize: 19,
        color: token.ink,
      }}
    >
      <span>{label}</span>
      <span style={{ color: token[tone], fontWeight: tone === "cleared" ? 600 : 400 }}>{value}</span>
    </div>
  );
}

export default function OpenGraphImage() {
  // Same calculator and the same rates module as the page, so the card the
  // share shows cannot drift from the invoice the visitor lands on.
  const costs = exampleInvoiceCosts(exampleInvoice.amountCents);
  const row = (id: string) => costs.find((c) => c.rateId === id);
  const flat = row("cdg_flat_online");
  const icp = row("cdg_interchange_plus_online");
  const ach = row("ach_example");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: token.paper,
          fontFamily: "system-ui, sans-serif",
          borderTop: `16px solid ${token.carbon}`,
        }}
      >
        {/* Left: the line. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 0 56px 64px",
            width: 620,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 600, color: token.ink }}>
            {/* The stacked record: three sheets offset down and right. */}
            <div style={{ display: "flex", position: "relative", width: 40, height: 44 }}>
              <div style={{ position: "absolute", left: 10, top: 10, width: 26, height: 30, borderRadius: 3, backgroundColor: token.carbonTint }} />
              <div style={{ position: "absolute", left: 5, top: 5, width: 26, height: 30, borderRadius: 3, backgroundColor: token.carbonTint }} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 26,
                  height: 30,
                  borderRadius: 3,
                  backgroundColor: token.sheet,
                  border: `2px solid ${token.carbon}`,
                  display: "flex",
                }}
              >
                <div style={{ width: 14, height: 3, margin: "6px 0 0 4px", backgroundColor: token.carbon }} />
              </div>
            </div>
            {siteConfig.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 62, lineHeight: 1.05, fontWeight: 600, color: token.ink, letterSpacing: "-0.025em" }}>
              Bill clients. Know what getting paid costs.
            </div>
            <div style={{ display: "flex", fontSize: 25, lineHeight: 1.4, color: token.muted, maxWidth: 520 }}>
              Free invoicing that applies payment costs to the invoice before you send it.
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 22, color: token.muted }}>{siteConfig.domain}</div>
        </div>

        {/* Right: the invoice stack, the file copy with its cost table. */}
        <div style={{ display: "flex", position: "relative", width: 516, padding: "56px 64px 56px 0" }}>
          <div style={{ position: "absolute", left: 24, top: 80, width: 452, height: 400, borderRadius: 4, backgroundColor: token.carbonTint }} />
          <div style={{ position: "absolute", left: 12, top: 68, width: 452, height: 400, borderRadius: 4, backgroundColor: token.carbonTint }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 56,
              width: 452,
              height: 400,
              borderRadius: 4,
              backgroundColor: token.sheet,
              border: `1px solid ${token.rule}`,
              padding: "26px 28px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 23, fontWeight: 600, color: token.ink }}>Invoice #1042</div>
                <div style={{ fontSize: 15, color: token.muted, marginTop: 2 }}>Northgate Plumbing</div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: token.carbon,
                  border: `1px solid ${token.carbon}`,
                  borderRadius: 3,
                  padding: "3px 8px",
                }}
              >
                File copy
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: `1px solid ${token.rule}`,
                marginTop: 16,
                paddingTop: 14,
              }}
            >
              <span style={{ fontSize: 17, color: token.muted }}>Total due</span>
              <span style={{ fontSize: 34, fontWeight: 500, color: token.ink }}>
                {formatCents(exampleInvoice.amountCents)}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
              <div style={{ display: "flex", fontSize: 16, fontWeight: 600, color: token.ink, paddingBottom: 8 }}>
                What getting paid costs
              </div>
              <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${token.ruleStrong}` }}>
                <CostRow label={flat?.label ?? "Card, flat rate"} value={formatCents(flat?.knownFeeCents ?? 0)} top={false} />
                <CostRow
                  label={icp?.label ?? "Card, interchange-plus"}
                  value={icp?.variableComponents[0]?.label ?? "varies by card"}
                  tone="muted"
                />
                <CostRow label={ach?.label ?? "ACH bank transfer"} value={formatCents(ach?.knownFeeCents ?? 0)} tone="cleared" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
