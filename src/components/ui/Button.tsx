import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

const variants: Record<ButtonVariant, string> = {
  primary: "rounded-lg bg-action text-paper hover:bg-action-hover",
  secondary:
    "rounded-lg border border-rule-strong bg-paper text-ink hover:border-muted hover:bg-field",
  quiet: "text-action underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-4 py-2.5 text-small",
  lg: "px-5 py-3 text-body",
};

const quietSizes: Record<ButtonSize, string> = {
  md: "text-small",
  lg: "text-body",
};

/** The only button styling on the site. Internal links and plain external links. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  const sizing = variant === "quiet" ? quietSizes[size] : sizes[size];
  return `${base} ${variants[variant]} ${sizing} ${className}`.trim();
}

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  children,
}: ButtonProps) {
  const cls = buttonClass(variant, size, className);
  if (external) {
    return (
      <a href={href} className={cls} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
