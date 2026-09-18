import type { CtaPosition, CtaType } from "@/lib/cta";

export type AffiliateClickPayload = {
  page: string;
  article_slug?: string;
  cta_position: CtaPosition;
  cta_text: string;
  cta_type: CtaType;
};

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | undefined> },
) => void;

/**
 * Affiliate click instrumentation. Fires a DOM event, pushes to a dataLayer,
 * and, when the Plausible script is loaded (NEXT_PUBLIC_PLAUSIBLE_DOMAIN set),
 * sends an "affiliate_cta_click" custom event with the payload as props.
 */
export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(
      new CustomEvent("affiliate_cta_click", { detail: payload }),
    );
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "affiliate_cta_click", ...payload });
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & { plausible?: PlausibleFn };
    if (typeof w.plausible === "function") {
      w.plausible("affiliate_cta_click", { props: { ...payload } });
    }
  } catch {
    /* ignore */
  }
}
