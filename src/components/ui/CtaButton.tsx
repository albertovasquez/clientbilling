import Link from "next/link";
import { EventLink } from "@/components/EventLink";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import type { BrowserEventName } from "@/lib/browser-events";
import { cta, type CtaKey, type CtaPosition } from "@/lib/cta";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./Button";

type CtaButtonProps = {
  cta: CtaKey;
  position: CtaPosition;
  variant?: ButtonVariant;
  size?: ButtonSize;
  articleSlug?: string;
  /** For internal rungs: a browser event to record on click. Affiliate rungs record their own. */
  event?: BrowserEventName;
  className?: string;
};

/**
 * A call to action. Label, destination, and tracking all come from the CTA
 * ladder in src/lib/cta.ts, so a page only decides which rung and where.
 */
export function CtaButton({
  cta: key,
  position,
  variant = "primary",
  size = "md",
  articleSlug,
  event,
  className = "",
}: CtaButtonProps) {
  const item = cta(key);
  const cls = buttonClass(variant, size, className);

  if (!item.external && event) {
    return (
      <EventLink href={item.href} event={event} className={cls} data-cta-position={position}>
        {item.label}
      </EventLink>
    );
  }

  if (item.external) {
    return (
      <TrackedAffiliateLink
        href={item.href}
        ctaPosition={position}
        ctaText={item.label}
        ctaType={item.type}
        articleSlug={articleSlug}
        className={cls}
      >
        {item.label}
      </TrackedAffiliateLink>
    );
  }

  return (
    <Link href={item.href} className={cls} data-cta-position={position}>
      {item.label}
    </Link>
  );
}
