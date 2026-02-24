import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://internet-tehnologije-2025-uprrezusalonulepote20-production.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;