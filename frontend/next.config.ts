import type { NextConfig } from "next";

// v2 — auth + billing
const nextConfig: NextConfig = {
  // When NEXT_PUBLIC_API_URL is set (production), rewrites are not needed.
  // In local dev, rewrites proxy /api/* → localhost:8001 so no CORS headers needed.
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // B2A proxy: avantia2a.com/b2a/* → Railway /b2a/* (branded URL for tracking snippet)
    if (apiUrl) return [
      { source: "/b2a/:path*", destination: `${apiUrl}/b2a/:path*` },
    ];
    // Local dev: proxy both API and B2A to localhost backend
    return [
      { source: "/api/:path*", destination: "http://localhost:8001/:path*" },
      { source: "/b2a/:path*", destination: "http://localhost:8001/b2a/:path*" },
    ];
  },
};

export default nextConfig;
