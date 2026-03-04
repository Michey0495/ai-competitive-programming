import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "技術的要素 - AI検索対策ガイド",
  description: "HTTPS、ページ速度、モバイル対応などの技術的要素がAI検索にどう影響するか。",
};

export default function TechnicalGuide() {
  return (
    <>
      <h1>技術的要素</h1>

      <p>
        AI検索エンジンはコンテンツの質だけでなく、技術的な信頼性も評価します。
        HTTPS、速度、モバイル対応は基本要素です。
      </p>

      <h2>HTTPS</h2>
      <p>
        HTTPSは必須です。暗号化されていないHTTPサイトは、AI検索エンジンからの信頼度が下がります。
        無料のLet&apos;s Encryptで簡単に導入できます。
      </p>

      <h2>ページ速度</h2>
      <ul>
        <li>画像を最適化する(WebP形式推奨)</li>
        <li>不要なJavaScriptを削減する</li>
        <li>CDNを使用する</li>
        <li>Core Web Vitalsを改善する</li>
      </ul>

      <h2>モバイル対応</h2>
      <p>
        viewportメタタグを設定し、レスポンシブデザインを実装してください。
      </p>
      <pre>{`<meta name="viewport" content="width=device-width, initial-scale=1" />`}</pre>

      <h2>lang属性</h2>
      <p>
        HTMLのlang属性を設定して、コンテンツの言語をAI検索エンジンに伝えましょう。
      </p>
      <pre>{`<html lang="ja">`}</pre>
    </>
  );
}
