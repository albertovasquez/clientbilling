import type { ReactNode } from "react";

type DecisionCardProps = {
  tone?: "action" | "verdict";
  title: string;
  actions: ReactNode;
  note?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
  children?: ReactNode;
};

const tones = {
  action: "border-action/30 bg-action-tint",
  verdict: "border-verdict-rule bg-verdict-tint",
} as const;

/**
 * The only boxed unit on a page: a decision point with up to two buttons and
 * one quiet link. At most one per screen of content.
 */
export function DecisionCard({
  tone = "action",
  title,
  actions,
  note,
  headingLevel = 3,
  className = "",
  children,
}: DecisionCardProps) {
  const Tag = `h${headingLevel}` as const;
  return (
    <aside className={`rounded-2xl border p-6 sm:p-8 ${tones[tone]} ${className}`}>
      <Tag className="font-display text-display-sm font-semibold text-ink">
        {title}
      </Tag>
      {children ? (
        <div className="mt-2 text-small text-ink-soft">{children}</div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>
      {note ? <div className="mt-3 text-caption text-muted">{note}</div> : null}
    </aside>
  );
}
