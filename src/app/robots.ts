import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** Must live at the app root; inside a route group it is not emitted. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app", "/app/", "/i/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
