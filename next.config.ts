import type { NextConfig } from "next";

/**
 * CSP inventory (decision 0021):
 * - Scripts: first-party /_next only, plus inline JSON-LD in layout/blog/author/breadcrumb.
 * - Styles: Tailwind CSS from self; next/font injects size-adjust style tags.
 * - Images: self (OG, icons) and https (merchant logoUrl on /i/*).
 * - Connect: same-origin fetch/beacon only. Resend and Prisma stay server-side.
 * - No third-party analytics scripts (decision 0007). dataLayer is an in-memory array.
 * Dev loosens script-src (eval) and connect-src (HMR websockets).
 */
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/cdg-commerce",
        destination: "/cdgcommerce",
        permanent: true,
      },
      {
        source: "/cdg-commerce/:path*",
        destination: "/cdgcommerce/:path*",
        permanent: true,
      },
      {
        source: "/create-invoice",
        destination: "/invoices",
        permanent: false,
      },
      {
        source: "/invoices/thanks",
        destination: "/invoices",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
