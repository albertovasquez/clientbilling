type SourceNoteProps = {
  source: { label: string; href: string };
  checked: string;
  note?: string;
  className?: string;
};

export function formatCheckedDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Attribution for numbers, once per section. Replaces inline "as CDG states". */
export function SourceNote({ source, checked, note, className = "" }: SourceNoteProps) {
  return (
    <p className={`text-caption text-muted ${className}`}>
      Source:{" "}
      <a
        href={source.href}
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-ink"
      >
        {source.label}
      </a>
      , checked {formatCheckedDate(checked)}.{note ? ` ${note}` : ""}
    </p>
  );
}
