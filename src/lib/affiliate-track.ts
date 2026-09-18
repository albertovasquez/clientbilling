import type { CtaPosition, CtaType } from "@/lib/cta";

export type AffiliateClickPayload = {
  page: string;
  article_slug?: string;
  cta_position: CtaPosition;
  cta_text: string;
  cta_type: CtaType;
};

/** Lightweight affiliate click instrumentation (no paid analytics required). */
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
}
