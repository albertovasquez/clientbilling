import Link from "next/link";
import { formatPostDate, type PostMeta } from "@/lib/posts";

type PostCardProps = {
  post: PostMeta;
  featured?: boolean;
};

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md sm:p-6 ${
        featured ? "sm:p-7" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h3
        className={`mt-3 font-semibold tracking-tight text-slate-900 group-hover:text-teal-800 ${
          featured ? "text-xl sm:text-2xl" : "text-lg"
        }`}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-5 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        Read article
        <span aria-hidden className="ml-1">
          →
        </span>
      </Link>
    </article>
  );
}
