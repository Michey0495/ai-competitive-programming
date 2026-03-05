import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-catchcopy.ezoai.jp";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/generate", "/api/feedback", "/api/like"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
