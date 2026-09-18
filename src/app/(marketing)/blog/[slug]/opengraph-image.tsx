import { ImageResponse } from "next/og";
import { formatCheckedDate } from "@/components/ui/SourceNote";
import { author } from "@/lib/author";
import { getAllPostSlugs, getPostMeta } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const alt = "Article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/* Paper background, ink title, one action-colored rule. Score in verdict color when present. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  const titleSize = post.title.length > 60 ? 52 : 64;

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

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#0f172a",
              fontSize: titleSize,
              lineHeight: 1.1,
              fontWeight: 600,
              maxWidth: 1000,
            }}
          >
            {post.title}
          </div>
          {post.rating ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <div style={{ color: "#b45309", fontSize: 56, fontWeight: 600, lineHeight: 1 }}>
                {post.rating.overall.toFixed(1)}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: 24,
                  fontFamily: "system-ui, sans-serif",
                  paddingBottom: 6,
                }}
              >
                / 5 editorial score
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#64748b",
            fontSize: 24,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div>
            {`${author.name}, updated ${formatCheckedDate(post.updated ?? post.date)}`}
          </div>
          <div>{siteConfig.domain}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
