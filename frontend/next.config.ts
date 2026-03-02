import type { NextConfig } from "next";

// v2 — auth + billing
const nextConfig: NextConfig = {
  // When NEXT_PUBLIC_API_URL is set (production), rewrites are not needed.
  // In local dev, rewrites proxy /api/* → localhost:8001 so no CORS headers needed.
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) return [];           // production: frontend calls Railway directly
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8001/:path*",
      },
    ];
  },
};

export default nextConfig;
