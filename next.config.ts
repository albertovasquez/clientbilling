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
    ];
  },
};

export default nextConfig;
