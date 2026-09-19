import type { Metadata } from "next";
import Link from "next/link";
import { Container, Disclosure, Heading, Kicker, Section } from "@/components/ui";
import { author } from "@/lib/author";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${author.name}`,
  description: `${author.name}, ${author.role}. ${author.bio}`,
  alternates: { canonical: author.path },
};

export default function AuthorPage() {
  const posts = getAllPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: author.url,
    worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section>
        <Container width="article">
          <Kicker>{author.role}</Kicker>
          <Heading level={1} className="mt-2">
            {author.name}
          </Heading>
          <p className="mt-4 text-body text-ink-soft">{author.bio}</p>
          <Disclosure compact className="mt-4" />
          <p className="mt-4 text-small text-muted">
            Read{" "}
            <Link href="/methodology" className="text-carbon underline-offset-4 hover:underline">
              how scores are set
            </Link>{" "}
            and the{" "}
            <Link href="/affiliate-disclosure" className="text-carbon underline-offset-4 hover:underline">
              affiliate disclosure
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Articles</Heading>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {posts.map((post) => (
              <li key={post.slug} className="py-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-display text-display-sm font-semibold text-ink hover:text-carbon"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-small text-ink-soft">{post.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
