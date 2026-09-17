import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MidArticleCdgCard } from "@/components/MidArticleCdgCard";
import {
  EndArticleCdgCta,
  type EndArticleAngle,
} from "@/components/EndArticleCdgCta";
import {
  formatPostDate,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function topicForTags(
  tags: string[],
): "pricing" | "recurring" | "invoicing" | "fees" | "gateway" | "pos" | "general" {
  const h = tags.map((t) => t.toLowerCase()).join(" ");
  if (/\b(pricing|fees?|interchange|rate)\b/.test(h)) return "fees";
  if (/\b(recurring|subscription|dunning)\b/.test(h)) return "recurring";
  if (/\b(invoice|invoicing|b2b)\b/.test(h)) return "invoicing";
  if (/\b(gateway)\b/.test(h)) return "gateway";
  if (/\b(pos|retail)\b/.test(h)) return "pos";
  if (/\b(cdg|review)\b/.test(h)) return "pricing";
  return "general";
}

function angleForTopic(
  topic: ReturnType<typeof topicForTags>,
): EndArticleAngle {
  if (topic === "invoicing") return "invoicing";
  if (topic === "recurring") return "recurring";
  if (topic === "fees" || topic === "pricing") return "pricing";
  if (topic === "pos") return "pos";
  return "general";
}

function angleForSlug(
  slug: string,
  topic: ReturnType<typeof topicForTags>,
): EndArticleAngle {
  if (
    slug.includes("invoice") ||
    slug.includes("choosing-billing-software-for-b2b")
  ) {
    return "invoicing";
  }
  if (
    slug.includes("dunning") ||
    slug.includes("subscription") ||
    slug.includes("recurring") ||
    slug.includes("usage-based")
  ) {
    return "recurring";
  }
  return angleForTopic(topic);
}

function splitHtmlAtSecondHeading(html: string): [string, string] {
  const re = /<h2[\s>]/gi;
  let match: RegExpExecArray | null;
  let count = 0;
  let secondIndex = -1;
  while ((match = re.exec(html)) !== null) {
    count += 1;
    if (count === 2) {
      secondIndex = match.index;
      break;
    }
  }
  if (secondIndex === -1) {
    return [html, ""];
  }
  return [html.slice(0, secondIndex), html.slice(secondIndex)];
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: `/blog/${post.slug}` },
      authors: [{ name: post.author }],
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        url: `/blog/${post.slug}`,
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const [before, after] = splitHtmlAtSecondHeading(post.contentHtml);
  const topic = topicForTags(post.tags);
  const angle = angleForSlug(post.slug, topic);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-teal-800">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-teal-800">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="truncate text-slate-700" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <h1 className="font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {post.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Affiliate disclosure: we may earn a commission from{" "}
          {siteConfig.partnerName}.{" "}
          <Link
            href="/affiliate-disclosure"
            className="underline underline-offset-2 hover:text-slate-700"
          >
            Details
          </Link>
          .
        </p>
      </header>

      <div
        className="prose prose-billing prose-lg mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: before }}
      />

      <MidArticleCdgCard topic={topic} articleSlug={post.slug} />

      {after ? (
        <div
          className="prose prose-billing prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: after }}
        />
      ) : null}

      <EndArticleCdgCta angle={angle} articleSlug={post.slug} />

      <p className="mt-8 text-sm text-slate-500">
        <Link
          href="/blog"
          className="font-semibold text-teal-800 hover:text-teal-700"
        >
          ← Back to all posts
        </Link>
      </p>
    </article>
  );
}
