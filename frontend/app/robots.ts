import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://avanti.so";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/history",
          "/schedules",
          "/runs/",
          "/account",
          "/zh/dashboard",
          "/zh/history",
          "/zh/schedules",
          "/zh/runs/",
          "/zh/account",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
