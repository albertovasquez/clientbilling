import type { ReactNode } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  size?: "xl" | "lg" | "md" | "sm";
  id?: string;
  className?: string;
  children: ReactNode;
};

const sizes = {
  xl: "text-display-lg sm:text-display-xl",
  lg: "text-display-md sm:text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
} as const;

const defaultSize = { 1: "xl", 2: "lg", 3: "sm" } as const;

/** Display headings in Source Serif. Level is semantic, size is visual. */
export function Heading({ level, size, id, className = "", children }: HeadingProps) {
  const Tag = `h${level}` as const;
  const s = size ?? defaultSize[level];
  return (
    <Tag
      id={id}
      className={`font-display font-semibold text-ink ${sizes[s]} ${className}`}
    >
      {children}
    </Tag>
  );
}
