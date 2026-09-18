/**
 * Safe remote logo fetch for invoice PDFs. https only, short timeout, size cap,
 * image content-types only. Failures return null so PDF rendering never 500s.
 */

const MAX_BYTES = 500_000;
const TIMEOUT_MS = 2_000;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]);

export function isAllowedLogoUrl(url: string | null | undefined): boolean {
  return typeof url === "string" && url.startsWith("https://") && url.length <= 500;
}

/** Returns a data URL for @react-pdf/renderer Image, or null on any failure. */
export async function fetchLogoForPdf(url: string | null | undefined): Promise<string | null> {
  if (!isAllowedLogoUrl(url)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url!, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: { Accept: "image/*" },
    });
    if (!res.ok) return null;
    if (!res.url.startsWith("https://")) return null;

    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(type)) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) return null;

    const mime = type === "image/jpg" ? "image/jpeg" : type;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
