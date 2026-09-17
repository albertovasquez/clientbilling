export type AffiliateClickPayload = {
  page: string;
  article_slug?: string;
  cta_position: string;
  cta_text: string;
  cta_type: "soft" | "mid" | "end" | "nav" | "footer" | "eligibility";
};

/** Lightweight affiliate click instrumentation (no paid analytics required). */
export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  if (typeof window === "undefined") return;

  try {
    // eslint-disable-next-line no-console
    console.info("[affiliate_cta_click]", payload);
  } catch {
    /* ignore */
  }

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
