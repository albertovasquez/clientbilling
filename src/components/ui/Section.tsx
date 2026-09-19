import type { ReactNode } from "react";

type SectionProps = {
  band?: "paper" | "field" | "sheet";
  /** tight is the strip rhythm: a band that separates two sections rather than holding one. */
  density?: "normal" | "tight";
  rule?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Vertical rhythm. Alternate bands to separate topics; rule adds a top
 * hairline. The sheet band is the document white the proofs use for a block
 * that reads as a record rather than as page background.
 */
export function Section({
  band = "paper",
  density = "normal",
  rule = false,
  id,
  className = "",
  children,
}: SectionProps) {
  const bg = band === "field" ? "bg-field" : band === "sheet" ? "bg-sheet" : "bg-paper";
  const pad = density === "tight" ? "py-6" : "py-14 sm:py-20";
  const border = rule ? "border-t border-rule" : "";
  return (
    <section id={id} className={`${pad} ${bg} ${border} ${className}`}>
      {children}
    </section>
  );
}
