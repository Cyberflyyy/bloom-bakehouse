import type { MetadataRoute } from "next";
import siteConfig from "@/site.config.json";
import type { SiteConfig } from "@/lib/types";

const config = siteConfig as unknown as SiteConfig;

export default function robots(): MetadataRoute.Robots {
  const url =
    config.site?.url ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
  };
}
