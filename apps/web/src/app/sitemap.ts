import type { MetadataRoute } from "next";
import { getAllContainers } from "@/lib/strapi/client";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/reference/container`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const items = await getAllContainers();
    const dynamic = items.map((c) => ({
      url: `${siteUrl}/reference/container/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...dynamic];
  } catch {
    return staticRoutes;
  }
}
