import type { ReactNode } from "react";

type ContainerProps = {
  width?: "page" | "article" | "prose";
  className?: string;
  children: ReactNode;
};

const widths = {
  page: "max-w-page",
  article: "max-w-article",
  prose: "max-w-prose-guide",
} as const;

/** Horizontal width and gutter. Page for grids, article for long-form. */
export function Container({
  width = "page",
  className = "",
  children,
}: ContainerProps) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${widths[width]} ${className}`}>
      {children}
    </div>
  );
}
