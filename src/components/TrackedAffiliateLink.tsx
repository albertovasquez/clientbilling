"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/affiliate-track";
import type { CtaPosition, CtaType } from "@/lib/cta";

type Props = {
  children: ReactNode;
  className?: string;
  href: string;
  ctaPosition: CtaPosition;
  ctaText: string;
  ctaType: CtaType;
  articleSlug?: string;
} & Omit<ComponentProps<"a">, "href" | "children" | "className" | "onClick">;

/** Outbound affiliate anchor: sponsored rel plus a click event. Prefer CtaButton. */
export function TrackedAffiliateLink({
  children,
  className,
  href,
  ctaPosition,
  ctaText,
  ctaType,
  articleSlug,
  ...rest
}: Props) {
  function onClick() {
    trackAffiliateClick({
      page: window.location.pathname,
      article_slug: articleSlug,
      cta_position: ctaPosition,
      cta_text: ctaText,
      cta_type: ctaType,
    });
  }

  return (
    <Link
      href={href}
      className={className}
      rel="noopener noreferrer sponsored"
      onClick={onClick}
      data-affiliate-cta="true"
      data-cta-position={ctaPosition}
      data-cta-type={ctaType}
      {...rest}
    >
      {children}
    </Link>
  );
}
