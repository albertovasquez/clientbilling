import { siteConfig } from "@/lib/site";

/** The site's author. Bylines, the author page, and Article JSON-LD all read from here. */
export const author = {
  slug: "alberto-vasquez",
  name: "Alberto Vasquez",
  role: "Founder and editor, ClientBilling",
  bio: "Alberto writes about merchant accounts, processing fees, and billing operations for small and mid-sized businesses. He reads the published rate sheets, compares them at stated volumes, and says plainly where a provider is not a fit. ClientBilling is an affiliate of CDG Commerce and discloses it on every page.",
  path: "/authors/alberto-vasquez",
  url: `${siteConfig.url}/authors/alberto-vasquez`,
  sameAs: [] as string[],
} as const;
