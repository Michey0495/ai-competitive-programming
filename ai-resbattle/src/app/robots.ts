import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-resbattle.ezoai.jp";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/battle", "/api/feedback", "/api/like", "/api/recent", "/api/og"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
