import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { AffiliateCTA } from "@/components/AffiliateCTA";
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          Blog & reviews
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Payment processing & billing guides
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          High-intent reviews and pricing explainers first, plus practical
          billing operations articles for growing teams.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-14">
        <AffiliateCTA
          variant="compact"
          headline="Compare CDG Commerce pricing before you apply."
        />
      </div>
    </div>
  );
}
