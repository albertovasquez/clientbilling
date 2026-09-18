import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type ChangeFrequency = MetadataRoute.Sitemap[0]["changeFrequency"];

/** Static routes with the date they last changed. Update the date when the page changes. */
const STATIC: {
  path: string;
  updated: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}[] = [
  { path: "", updated: "2026-09-17", priority: 1, changeFrequency: "weekly" },
  { path: "/cdgcommerce", updated: "2026-09-17", priority: 0.95, changeFrequency: "weekly" },
  { path: "/cdgcommerce/online-payments", updated: "2026-09-17", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cdgcommerce/retail", updated: "2026-09-17", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cdgcommerce/recurring-billing", updated: "2026-09-17", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cdgcommerce/b2b", updated: "2026-09-17", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cdgcommerce/wireless", updated: "2026-09-17", priority: 0.85, changeFrequency: "monthly" },
  { path: "/blog", updated: "2026-09-17", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/fee-calculator", updated: "2026-09-18", priority: 0.9, changeFrequency: "weekly" },
  { path: "/invoices", updated: "2026-09-18", priority: 0.85, changeFrequency: "weekly" },
  { path: "/invoices/thanks", updated: "2026-09-18", priority: 0.2, changeFrequency: "yearly" },
  { path: "/get-started", updated: "2026-09-17", priority: 0.7, changeFrequency: "monthly" },
  { path: "/methodology", updated: "2026-09-17", priority: 0.5, changeFrequency: "yearly" },
  { path: "/authors/alberto-vasquez", updated: "2026-09-17", priority: 0.4, changeFrequency: "yearly" },
  { path: "/about", updated: "2026-09-17", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", updated: "2026-09-17", priority: 0.3, changeFrequency: "yearly" },
  { path: "/affiliate-disclosure", updated: "2026-09-17", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = STATIC.map(
    ({ path, updated, priority, changeFrequency }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(updated),
      changeFrequency,
      priority,
    }),
  );

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...posts];
}
