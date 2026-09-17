"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import {
  trackAffiliateClick,
  type AffiliateClickPayload,
} from "@/lib/affiliate-track";
import { siteConfig } from "@/lib/site";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  ctaPosition: string;
  ctaText: string;
  ctaType: AffiliateClickPayload["cta_type"];
  articleSlug?: string;
  page?: string;
} & Omit<ComponentProps<"a">, "href" | "children" | "className" | "onClick">;

export function TrackedAffiliateLink({
  children,
  className,
  href = siteConfig.affiliateSignupUrl,
  ctaPosition,
  ctaText,
  ctaType,
  articleSlug,
  page,
  ...rest
}: Props) {
  function onClick(_e: MouseEvent<HTMLAnchorElement>) {
    const path =
      page ||
      (typeof window !== "undefined" ? window.location.pathname : "");
    trackAffiliateClick({
      page: path,
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
      data-cta-text={ctaText}
      {...rest}
    >
      {children}
    </Link>
  );
}
