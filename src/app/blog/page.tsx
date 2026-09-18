import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import {
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog & Reviews",
  description:
    "CDG Commerce reviews, pricing explainers, processor comparisons, and billing operations guides.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Reviews | ClientBilling",
    description:
      "CDG Commerce reviews, pricing explainers, and payment processing guides.",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Section>
      <Container width="article">
        <Kicker>Guides</Kicker>
        <Heading level={1} className="mt-2">
          Guides to merchant accounts and getting paid
        </Heading>
        <p className="mt-4 text-body text-ink-soft">
          Reviews, pricing explainers, and comparisons built from published
          rate sheets, plus guides to recurring billing, invoicing, and
          dunning. Each one tells you who a provider fits and when to look
          elsewhere.
        </p>
        <Disclosure className="mt-4" />

        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>

        <DecisionCard
          title="Start with CDG's published pricing"
          className="mt-10"
          actions={
            <>
              <CtaButton cta="compare" position="end" />
              <CtaButton cta="quote" position="end" variant="secondary" />
            </>
          }
        >
          You can read the three plans and their markups before you talk to
          anyone. A quote request ends in a rate sheet and a phone call.
        </DecisionCard>
      </Container>
    </Section>
  );
}
