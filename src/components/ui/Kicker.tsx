import type { ReactNode } from "react";

type KickerProps = {
  className?: string;
  children: ReactNode;
};

/**
 * One informational line above a heading, in sentence case: an updated date,
 * a section of the site, a source. Not a decorative label.
 */
export function Kicker({ className = "", children }: KickerProps) {
  return <p className={`text-small text-muted ${className}`}>{children}</p>;
}
