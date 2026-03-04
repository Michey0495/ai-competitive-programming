import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メタタグ最適化 - AI検索対策ガイド",
  description: "title, description, OGP, canonicalの最適化方法。AI検索エンジンに正しい情報を伝えるメタタグ設定。",
};

export default function MetaTagsGuide() {
  return (
    <>
      <h1>メタタグ最適化</h1>

      <p>
        メタタグはAI検索エンジンがページの内容を把握するための最も基本的な情報源です。
        適切に設定することで、AI検索結果での表示精度が向上します。
      </p>

      <h2>title タグ</h2>
      <ul>
        <li>10-70文字で簡潔に記述</li>
        <li>ページの内容を正確に表現</li>
        <li>各ページでユニークにする</li>
      </ul>

      <h2>meta description</h2>
      <ul>
        <li>50-160文字で記述</li>
        <li>ページの概要を明確に</li>
        <li>AIが引用しやすい具体的な文章にする</li>
      </ul>

      <h2>OGP (Open Graph Protocol)</h2>
      <pre>{`<meta property="og:title" content="ページタイトル" />
<meta property="og:description" content="ページの説明" />
<meta property="og:image" content="https://example.com/og-image.png" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />`}</pre>

      <h2>canonical URL</h2>
      <p>
        重複コンテンツを防ぎ、正規URLをAI検索エンジンに伝えます。
      </p>
      <pre>{`<link rel="canonical" href="https://example.com/page" />`}</pre>
    </>
  );
}
