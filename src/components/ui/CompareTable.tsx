import type { ReactNode } from "react";

type CompareTableProps = {
  caption?: string;
  columns: string[];
  rows: { label: string; values: ReactNode[] }[];
  className?: string;
};

/** Side-by-side comparison. First column is the attribute, the rest are options. */
export function CompareTable({
  caption,
  columns,
  rows,
  className = "",
}: CompareTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left text-small">
        {caption ? (
          <caption className="mb-2 text-left text-caption text-muted">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-rule-strong py-2 pr-4 font-semibold text-ink"
            >
              <span className="sr-only">Attribute</span>
            </th>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="border-b border-rule-strong py-2 pr-4 font-semibold text-ink"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="border-b border-rule py-2.5 pr-4 align-top font-semibold text-ink"
              >
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className="border-b border-rule py-2.5 pr-4 align-top tabular-nums text-ink-soft"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
