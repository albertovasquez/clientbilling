import type { ReactNode } from "react";

type SectionProps = {
  band?: "paper" | "field";
  rule?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Vertical rhythm. Alternate bands to separate topics; rule adds a top hairline. */
export function Section({
  band = "paper",
  rule = false,
  id,
  className = "",
  children,
}: SectionProps) {
  const bg = band === "field" ? "bg-field" : "bg-paper";
  const border = rule ? "border-t border-rule" : "";
  return (
    <section id={id} className={`py-14 sm:py-20 ${bg} ${border} ${className}`}>
      {children}
    </section>
  );
}
