import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AuthorCard,
  Badge,
  Breadcrumb,
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  Heading,
  Kicker,
  RatingBadge,
  Section,
  VerdictBox,
} from "@/components/ui";
import { author } from "@/lib/author";
import { cdgBestFor, cdgFit } from "@/lib/cdg";
import { exploreCtaForTags } from "@/lib/cta";
import { formatPostDate, getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Topic =
  | "pricing"
  | "recurring"
  | "invoicing"
  | "fees"
  | "gateway"
  | "pos"
  | "general";

function topicForTags(tags: string[]): Topic {
  const h = tags.map((t) => t.toLowerCase()).join(" ");
  if (/\b(pricing|fees?|interchange|rate)\b/.test(h)) return "fees";
  if (/\b(recurring|subscription|dunning)\b/.test(h)) return "recurring";
  if (/\b(invoice|invoicing|b2b)\b/.test(h)) return "invoicing";
  if (/\b(gateway)\b/.test(h)) return "gateway";
  if (/\b(pos|retail)\b/.test(h)) return "pos";
  if (/\b(cdg|review)\b/.test(h)) return "pricing";
  return "general";
}

const inlineTitles: Record<Topic, string> = {
  pricing: "Check CDG's published pricing against your volume",
  fees: "Check CDG's published markup against your volume",
  recurring: "Run recurring billing on a CDG merchant account",
  invoicing: "Take invoice payments through a CDG merchant account",
  gateway: "CDG includes the gateway in its merchant account",
  pos: "Take cards in person on a CDG merchant account",
  general: "See what CDG would charge your business",
};

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
      authors: [{ name: author.name, url: author.url }],
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        url: `/blog/${post.slug}`,
        publishedTime: post.date,
        modifiedTime: post.updated ?? post.date,
        authors: [author.url],
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
  const exploreKey = exploreCtaForTags(post.tags);
  const shownDate = post.updated ?? post.date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <Section>
      <Container width="article">
        <article>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/blog" },
              { label: post.title },
            ]}
          />

          <header className="mt-6 border-b border-rule pb-8">
            <Kicker>
              <time dateTime={shownDate}>
                {post.updated ? "Updated " : ""}
                {formatPostDate(shownDate)}
              </time>
            </Kicker>
            <Heading level={1} className="mt-2">
              {post.title}
            </Heading>
            <p className="mt-4 text-body text-ink-soft">{post.description}</p>
            <p className="mt-5 text-small text-muted">
              <Link href={author.path} className="font-semibold text-ink hover:text-carbon">
                {author.name}
              </Link>
              <span className="mx-2" aria-hidden>
                /
              </span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span className="mx-2" aria-hidden>
                /
              </span>
              <span>{post.readingTime}</span>
            </p>
            {post.tags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="neutral">{tag}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <Disclosure compact className="mt-4" />
          </header>

          {post.rating ? (
            <RatingBadge
              rating={post.rating}
              bestFor={post.bestFor}
              className="mt-8"
            />
          ) : null}

          <div
            className="prose prose-billing prose-lg mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: before }}
          />

          <DecisionCard
            title={inlineTitles[topic]}
            className="my-10"
            actions={
              <>
                <CtaButton cta="quote" position="inline" articleSlug={post.slug} />
                <CtaButton
                  cta={exploreKey}
                  position="inline"
                  variant="secondary"
                  articleSlug={post.slug}
                />
              </>
            }
          >
            CDG publishes its markups and answers a quote request with a rate
            sheet and a phone call.
          </DecisionCard>

          {after ? (
            <div
              className="prose prose-billing prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: after }}
            />
          ) : null}

          {post.rating ? (
            <VerdictBox
              className="mt-10"
              rating={post.rating}
              bestFor={post.bestFor ?? cdgBestFor}
              forList={[...cdgFit.forList]}
              notForList={[...cdgFit.notForList]}
              actions={
                <>
                  <CtaButton cta="quote" position="verdict" articleSlug={post.slug} />
                  <CtaButton
                    cta="apply"
                    position="verdict"
                    variant="secondary"
                    articleSlug={post.slug}
                  />
                </>
              }
            />
          ) : (
            <DecisionCard
              title="See what CDG would charge your business"
              className="mt-10"
              actions={
                <>
                  <CtaButton cta="quote" position="end" articleSlug={post.slug} />
                  <CtaButton
                    cta="compare"
                    position="end"
                    variant="secondary"
                    articleSlug={post.slug}
                  />
                </>
              }
            >
              You can read the three published plans first. A quote request
              ends in a rate sheet and a phone call from CDG.
            </DecisionCard>
          )}

          {post.sources.length > 0 ? (
            <div className="mt-10">
              <Heading level={2} size="sm">
                Sources
              </Heading>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-small text-ink-soft">
                {post.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      rel="noopener noreferrer"
                      className="text-carbon underline-offset-2 hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <AuthorCard className="mt-10" />

          <p className="mt-8">
            <Button href="/blog" variant="quiet">
              All guides
            </Button>
          </p>
        </article>
      </Container>
    </Section>
  );
}
