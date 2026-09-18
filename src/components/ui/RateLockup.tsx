type RateLockupProps = {
  figure: string;
  label: string;
  detail?: string;
  size?: "md" | "lg";
  className?: string;
};

/**
 * A published rate set large: "0.35% + $0.15" with what it applies to.
 * The memorable element on pricing pages. Always pair a group with a SourceNote.
 */
export function RateLockup({
  figure,
  label,
  detail,
  size = "md",
  className = "",
}: RateLockupProps) {
  const figureSize =
    size === "lg"
      ? "text-display-lg sm:text-display-xl"
      : "text-display-md sm:text-display-lg";
  return (
    <div className={className}>
      <p
        className={`font-display font-semibold tabular-nums text-ink ${figureSize}`}
      >
        {figure}
      </p>
      <p className="mt-1 text-small font-medium text-ink">{label}</p>
      {detail ? <p className="text-caption text-muted">{detail}</p> : null}
    </div>
  );
}
