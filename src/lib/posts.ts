import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";
import type { Rating } from "@/components/ui/RatingBadge";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type PostSource = { label: string; href: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** ISO date of the last substantive edit. Shown under the title and sent as dateModified. */
  updated?: string;
  /** Author slug. Display data comes from src/lib/author.ts. */
  author: string;
  tags: string[];
  featured?: boolean;
  sources: PostSource[];
  rating?: Rating;
  bestFor?: string;
  readingTime: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function getAllPostSlugs(): string[] {
  return getMarkdownFiles().map((file) => file.replace(/\.mdx?$/, ""));
}

function readPostFile(slug: string): { data: Record<string, unknown>; content: string } {
  const fullPathMd = path.join(postsDirectory, `${slug}.md`);
  const fullPathMdx = path.join(postsDirectory, `${slug}.mdx`);
  const fullPath = fs.existsSync(fullPathMd) ? fullPathMd : fullPathMdx;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return matter(fileContents);
}

function parseSources(value: unknown): PostSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (s): s is { label: unknown; href: unknown } =>
        typeof s === "object" && s !== null && "label" in s && "href" in s,
    )
    .map((s) => ({ label: String(s.label), href: String(s.href) }));
}

function parseRating(value: unknown): Rating | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const r = value as Record<string, unknown>;
  const pricing = Number(r.pricing);
  const contract = Number(r.contract);
  const support = Number(r.support);
  if ([pricing, contract, support].some((n) => Number.isNaN(n))) return undefined;
  const overall =
    typeof r.overall === "number"
      ? r.overall
      : Math.round(((pricing + contract + support) / 3) * 10) / 10;
  return { overall, pricing, contract, support };
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const stats = readingTime(content);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    updated: data.updated ? String(data.updated) : undefined,
    author: String(data.author ?? "alberto-vasquez"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    sources: parseSources(data.sources),
    rating: parseRating(data.rating),
    bestFor: data.bestFor ? String(data.bestFor) : undefined,
    readingTime: stats.text,
  };
}

export function getPostMeta(slug: string): PostMeta {
  const { data, content } = readPostFile(slug);
  return toMeta(slug, data, content);
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(limit = 3): PostMeta[] {
  const featured = getAllPosts().filter((p) => p.featured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  return getAllPosts().slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data, content } = readPostFile(slug);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: true })
    .process(content);

  return {
    ...toMeta(slug, data, content),
    contentHtml: processed.toString(),
  };
}

export function formatPostDate(date: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  } catch {
    return date;
  }
}
