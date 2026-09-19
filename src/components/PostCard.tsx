import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatPostDate, type PostMeta } from "@/lib/posts";

type PostCardProps = {
  post: PostMeta;
  featured?: boolean;
};

/** A ruled list item, not a card. Use inside a list with divide-y divide-rule. */
export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className="group py-6">
      <p className="text-caption text-muted">
        <time dateTime={post.updated ?? post.date}>
          {post.updated ? "Updated " : ""}
          {formatPostDate(post.updated ?? post.date)}
        </time>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span>{post.readingTime}</span>
      </p>
      <h3
        className={`mt-2 font-display font-semibold text-ink group-hover:text-carbon ${
          featured ? "text-display-md" : "text-display-sm"
        }`}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carbon"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-prose-guide text-small text-ink-soft">{post.description}</p>
      {post.bestFor ? (
        <p className="mt-3">
          <Badge tone="verdict">Best for: {post.bestFor}</Badge>
        </p>
      ) : null}
    </article>
  );
}
