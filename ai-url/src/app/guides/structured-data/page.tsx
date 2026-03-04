import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "構造化データ(JSON-LD)の実装 - AI検索対策ガイド",
  description: "Schema.orgのJSON-LD構造化データを実装してAI検索エンジンにコンテンツを正しく理解させる方法。",
};

export default function StructuredDataGuide() {
  return (
    <>
      <h1>構造化データ(JSON-LD)の実装</h1>

      <p>
        構造化データ(JSON-LD)はサイトのコンテンツを機械可読な形式で記述する仕組みです。
        AI検索エンジンがコンテンツの種類・関係性を正確に理解するために重要です。
      </p>

      <h2>WebSite構造化データ</h2>
      <pre>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "サイト名",
  "url": "https://example.com",
  "description": "サイトの説明"
}
</script>`}</pre>

      <h2>FAQPage構造化データ</h2>
      <pre>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "質問文",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "回答文"
      }
    }
  ]
}
</script>`}</pre>

      <h2>重要なポイント</h2>
      <ul>
        <li>JSON-LD形式を使用する（MicrodataやRDFaより推奨）</li>
        <li>Schema.orgのボキャブラリに準拠する</li>
        <li>WebSiteまたはOrganizationを最低限追加する</li>
        <li>FAQ/Q&Aコンテンツがある場合はFAQPageを追加する</li>
      </ul>
    </>
  );
}
