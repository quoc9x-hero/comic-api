import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/media/:server/manga/:path*",
        destination: "/api/manga/media?server=:server&path=:path*",
      },
    ];
  },
};

export default nextConfig;
