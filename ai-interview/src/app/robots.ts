import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/interview", "/api/feedback"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
