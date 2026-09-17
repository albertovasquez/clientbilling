import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(15,118,110,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(217,119,6,0.2), transparent 45%)",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#99f6e4",
            fontSize: 28,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#115e59",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            CB
          </div>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 600,
              maxWidth: 980,
            }}
          >
            Billing best practices for growing B2B teams
          </div>
          <div
            style={{
              color: "#cbd5e1",
              fontSize: 28,
              fontFamily: "system-ui, sans-serif",
              maxWidth: 860,
            }}
          >
            Invoicing, subscriptions, dunning, and revenue operations—with
            transparent partner CTAs.
          </div>
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 24,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
