type RecordMarkProps = {
  /** stacked: the record and its two copies. registration: the proof seal's circle and cross. */
  variant?: "stacked" | "registration";
  size?: number;
  className?: string;
};

/**
 * The mark (docs/brand/brief.md). Stacked is the logo: three sheets offset
 * down and right, the front one in sheet white with a carbon rule at its
 * head. Registration is the corner mark of a document or a section rule, at
 * most one per view. Decorative: pair it with visible text or an aria-label
 * on the parent.
 */
export function RecordMark({ variant = "stacked", size = 26, className = "" }: RecordMarkProps) {
  if (variant === "registration") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 ${className}`}
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
        <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="7" y="7" width="16" height="18" rx="1.5" className="fill-carbon-tint" />
      <rect x="4" y="4" width="16" height="18" rx="1.5" className="fill-carbon-tint" />
      <rect x="1" y="1" width="16" height="18" rx="1.5" className="fill-sheet stroke-carbon" strokeWidth="1.5" />
      <rect x="4" y="5" width="10" height="2" className="fill-carbon" />
    </svg>
  );
}
