import type { ReactNode } from "react";
import { RatingBadge, type Rating } from "./RatingBadge";

type VerdictBoxProps = {
  rating: Rating;
  bestFor: string;
  forList: string[];
  notForList: string[];
  actions: ReactNode;
  title?: string;
  className?: string;
};

/** End-of-page verdict: score, best for, who should and should not, two CTAs. */
export function VerdictBox({
  rating,
  bestFor,
  forList,
  notForList,
  actions,
  title = "Verdict",
  className = "",
}: VerdictBoxProps) {
  return (
    <aside
      className={`rounded-2xl border border-rule-due bg-due-tint p-6 sm:p-8 ${className}`}
    >
      <h2 className="font-display text-display-sm font-semibold text-ink">
        {title}
      </h2>
      <RatingBadge rating={rating} bestFor={bestFor} className="mt-4" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-small font-semibold text-ink">Consider CDG if</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-ink-soft">
            {forList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-small font-semibold text-ink">Look elsewhere if</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-ink-soft">
            {notForList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
    </aside>
  );
}
