import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        destination: "/app/sign-up",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
