# 0021: Full Content Security Policy and CI harness

Status: Accepted 2026-09-18

## Context

Decision 0020 left a full Content Security Policy open until inline scripts and image hosts were inventoried. The same continuous-improvement pass also needed an automated gate: `npm run check` and the Postgres flow script were local-only, so regressions could merge unnoticed.

Inventory of browser-loaded sources:

| Kind | Sources |
| --- | --- |
| Scripts | First-party `/_next/*`. Inline JSON-LD (`application/ld+json`) in the root layout, blog posts, author page, and breadcrumb. No third-party script tags (decision 0007). |
| Styles | First-party CSS. `next/font` injects small inline style tags for size-adjust. |
| Images | First-party OG/icons. Merchant `logoUrl` on `/i/*` may be any `https:` host (decision 0020). |
| Connect | Same-origin `fetch` and beacons only. Resend and the database are server-side. |
| Frames | None. |

## Decision

- Ship an enforced Content-Security-Policy on every path via `next.config.ts`, replacing the previous `frame-ancestors`-only value. Keep the other security headers.
- Allow `'unsafe-inline'` for `script-src` and `style-src` so JSON-LD and `next/font` keep working without per-request nonces (which would force every marketing page dynamic). Do not allow any third-party script host.
- Allow `img-src https:` for merchant logos. Restrict `connect-src`, `frame-src`, `object-src`, `base-uri`, and `form-action` tightly. Use `upgrade-insecure-requests`.
- In development only, also allow `'unsafe-eval'` and `ws:`/`wss:` for Next HMR.
- Add GitHub Actions CI: `npm run check` on every PR and push to `main`, plus `npm run test:db` against a Postgres 16 service after `prisma migrate deploy`.

## Reasons

- A static policy is enough to block injected third-party scripts and unexpected connect/frame targets without paying a dynamism tax on the content site.
- Nonce-based `script-src` remains available later if we drop inline JSON-LD or accept dynamic marketing pages.
- CI makes the definition-of-done checks (`check`, money/auth/rate-limit DB flows) automatic.

## Consequences

- Adding a browser-side third-party script, font CDN, or analytics pixel requires a CSP change in the same PR.
- `'unsafe-inline'` still permits inline script if an XSS sink appears; sanitization (0020) and React text rendering remain the primary XSS controls.
- PRs need a green CI run before merge.

## Revisit when

A real XSS or supply-chain incident, a need to load a third-party script, or a move to nonce-based CSP.
