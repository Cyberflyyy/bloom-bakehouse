import type { MetadataRoute } from "next";
import siteConfig from "@/site.config.json";
import type { SiteConfig } from "@/lib/types";

const config = siteConfig as unknown as SiteConfig;

export default function sitemap(): MetadataRoute.Sitemap {
  const url =
    config.site?.url ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return [{ url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
