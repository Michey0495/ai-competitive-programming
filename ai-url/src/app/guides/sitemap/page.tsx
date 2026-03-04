import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サイトマップと内部リンク - AI検索対策ガイド",
  description: "sitemap.xmlの作成と内部リンク構造の最適化。AI検索エンジンにサイト全体を正しく認識させる方法。",
};

export default function SitemapGuide() {
  return (
    <>
      <h1>サイトマップと内部リンク</h1>

      <p>
        サイトマップと内部リンクは、AI検索エンジンがサイト全体を効率的にクロールするために重要です。
      </p>

      <h2>sitemap.xml</h2>
      <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-01-01</lastmod>
  </url>
</urlset>`}</pre>

      <h2>内部リンクの最適化</h2>
      <ul>
        <li>関連ページ同士をリンクで繋ぐ</li>
        <li>navタグでナビゲーションを構造化する</li>
        <li>パンくずリストを実装する</li>
        <li>重要なページへのリンクを増やす</li>
      </ul>

      <h2>Next.jsでのsitemap生成</h2>
      <pre>{`// src/app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://example.com', lastModified: new Date() },
    { url: 'https://example.com/about', lastModified: new Date() },
  ]
}`}</pre>
    </>
  );
}
