import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // frame-ancestors is the CSP equivalent of X-Frame-Options and covers modern browsers.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
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
