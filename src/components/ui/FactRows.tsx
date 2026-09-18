import type { ReactNode } from "react";

type FactRowsProps = {
  rows: { label: ReactNode; value: ReactNode }[];
  columns?: 1 | 2;
  className?: string;
};

/** Ruled label and value rows. Facts go here, not in cards. */
export function FactRows({ rows, columns = 1, className = "" }: FactRowsProps) {
  const grid = columns === 2 ? "sm:grid-cols-2 sm:gap-x-10" : "";
  return (
    <dl className={`grid border-b border-rule ${grid} ${className}`}>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid gap-1 border-t border-rule py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-6"
        >
          <dt className="text-small font-semibold text-ink">{row.label}</dt>
          <dd className="text-small text-ink-soft">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
