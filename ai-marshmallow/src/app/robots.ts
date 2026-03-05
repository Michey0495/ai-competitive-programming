import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-marshmallow.ezoai.jp";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/questions", "/api/feedback", "/api/like", "/api/recent"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
