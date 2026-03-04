import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txtの書き方 - AI検索対策ガイド",
  description:
    "llms.txtとは何か、なぜ必要か、どう書くか。AI検索エンジンにサイトを正しく理解させるためのファイル設置ガイド。",
};

export default function LlmsTxtGuide() {
  return (
    <>
      <h1>llms.txtの書き方</h1>

      <p>
        llms.txtは、AI検索エンジンやLLM(大規模言語モデル)がサイトを理解するための説明ファイルです。
        robots.txtがクローラーの「アクセス許可」を制御するのに対し、llms.txtはサイトの「内容理解」を助けます。
      </p>

      <h2>なぜllms.txtが必要か</h2>
      <p>
        AI検索エンジン(ChatGPT, Perplexity, Claude等)は、検索結果を生成する際にサイトのコンテンツを参照します。
        llms.txtがあることで、AIがサイトの構造・目的・主要コンテンツを正確に把握でき、
        検索結果での引用精度が向上します。
      </p>

      <h2>基本フォーマット</h2>
      <pre>{`# サイト名
> サイトの概要説明（1-2文）

## 主要ページ
- [ページ名](URL): ページの説明
- [ページ名](URL): ページの説明

## API
- POST /api/endpoint: APIの説明`}</pre>

      <h2>設置方法</h2>
      <p>
        ファイル名を <code>llms.txt</code> としてサイトのルートディレクトリに配置します。
        <code>https://example.com/llms.txt</code> でアクセスできるようにしてください。
      </p>

      <h2>ベストプラクティス</h2>
      <ul>
        <li>サイトの目的と対象ユーザーを明記する</li>
        <li>主要なページを一覧にする</li>
        <li>APIがある場合はエンドポイントを記載する</li>
        <li>Markdownフォーマットで記述する</li>
        <li>200文字以上の十分な情報量を確保する</li>
        <li>定期的に更新する</li>
      </ul>

      <h2>AEO Checkerで自動生成</h2>
      <p>
        AEO Checkerでは、URLを入力するだけでllms.txtを自動生成できます。
        トップページからスキャンを実行し、結果ページで生成されたファイルをダウンロードしてください。
      </p>
    </>
  );
}
