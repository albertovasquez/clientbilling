import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Paper background, ink text, one action-colored mark. Matches the tokens in globals.css. */
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
          backgroundColor: "#ffffff",
          padding: "64px",
          fontFamily: "Georgia, serif",
          borderTop: "16px solid #115e59",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#0f172a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#115e59",
              color: "#ffffff",
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
              color: "#0f172a",
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 600,
              maxWidth: 980,
            }}
          >
            What a merchant account really costs, in plain numbers.
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 28,
              fontFamily: "system-ui, sans-serif",
              maxWidth: 860,
            }}
          >
            Published rates, contract terms, and who each plan fits.
          </div>
        </div>
        <div
          style={{
            color: "#64748b",
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
