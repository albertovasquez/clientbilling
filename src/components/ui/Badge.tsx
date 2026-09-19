import type { ReactNode } from "react";

type BadgeProps = {
  tone?: "verdict" | "neutral";
  className?: string;
  children: ReactNode;
};

const tones = {
  verdict: "border-rule-due bg-due-tint text-due",
  neutral: "border-rule bg-field text-ink-soft",
} as const;

/** Small pill: best-for (verdict tone) or a topic tag (neutral). */
export function Badge({ tone = "neutral", className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-caption font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
