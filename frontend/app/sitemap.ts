import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://avantia2a.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: "/",                           priority: 1.0,  changeFrequency: "weekly" as const },
    { url: "/audit",                      priority: 0.9,  changeFrequency: "weekly" as const },
    { url: "/categories",                 priority: 0.8,  changeFrequency: "daily"  as const },
    { url: "/book-demo",                  priority: 0.7,  changeFrequency: "monthly" as const },
    { url: "/zh",                         priority: 0.9,  changeFrequency: "weekly" as const },
    { url: "/zh/audit",                   priority: 0.8,  changeFrequency: "weekly" as const },
    { url: "/zh/categories",              priority: 0.7,  changeFrequency: "daily"  as const },
    { url: "/zh/book-demo",               priority: 0.6,  changeFrequency: "monthly" as const },
    { url: "/research",                   priority: 0.8,  changeFrequency: "daily"   as const },
    { url: "/zh/research",                priority: 0.7,  changeFrequency: "daily"   as const },
    { url: "/company/techvision-pro",     priority: 0.5,  changeFrequency: "monthly" as const },
  ];

  return staticPages.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
