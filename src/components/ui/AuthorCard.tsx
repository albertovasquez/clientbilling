import Link from "next/link";
import { author } from "@/lib/author";

type AuthorCardProps = {
  className?: string;
};

/** Byline card at the end of an article. */
export function AuthorCard({ className = "" }: AuthorCardProps) {
  const initials = author.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <div className={`flex gap-4 border-t border-rule pt-6 ${className}`}>
      <span
        aria-hidden
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-field font-display text-display-sm font-semibold text-ink"
      >
        {initials}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">
          <Link href={author.path} className="hover:text-carbon">
            {author.name}
          </Link>
        </p>
        <p className="text-caption text-muted">{author.role}</p>
        <p className="mt-2 text-small text-ink-soft">{author.bio}</p>
      </div>
    </div>
  );
}
