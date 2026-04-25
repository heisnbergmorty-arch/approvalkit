import type { MetadataRoute } from "next";

const BASE = process.env.AUTH_URL ?? "https://approvalkit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/changelog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/roadmap`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
