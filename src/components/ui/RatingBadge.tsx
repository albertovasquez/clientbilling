import Link from "next/link";

export type Rating = {
  overall: number;
  pricing: number;
  contract: number;
  support: number;
};

type RatingBadgeProps = {
  rating: Rating;
  bestFor?: string;
  size?: "md" | "lg";
  className?: string;
};

const subscoreLabels: { key: keyof Omit<Rating, "overall">; label: string }[] = [
  { key: "pricing", label: "Pricing transparency" },
  { key: "contract", label: "Contract terms" },
  { key: "support", label: "Support" },
];

/** Editorial score with three sub-scores. How scores are set: /methodology. */
export function RatingBadge({
  rating,
  bestFor,
  size = "md",
  className = "",
}: RatingBadgeProps) {
  const overallSize =
    size === "lg" ? "text-display-xl" : "text-display-lg";
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <p className="leading-none">
            <span
              className={`font-display font-semibold tabular-nums text-verdict ${overallSize}`}
            >
              {rating.overall.toFixed(1)}
            </span>
            <span className="ml-1 text-small text-muted">/ 5</span>
          </p>
          <p className="mt-1 text-caption text-muted">
            Editorial score.{" "}
            <Link
              href="/methodology"
              className="underline underline-offset-2 hover:text-ink"
            >
              How we score
            </Link>
          </p>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 border-l border-rule pl-6">
          {subscoreLabels.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-caption text-muted">{label}</dt>
              <dd className="text-small font-semibold tabular-nums text-ink">
                {rating[key].toFixed(1)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {bestFor ? (
        <p className="mt-4 text-small text-ink-soft">
          <span className="font-semibold text-ink">Best for:</span> {bestFor}
        </p>
      ) : null}
    </div>
  );
}
