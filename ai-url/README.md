# AEO Checker - AI検索対策チェッカー

URLを入力するだけでAI検索エンジン(ChatGPT, Perplexity, Claude, Gemini等)での発見されやすさを100点満点でスコアリング。日本語で具体的な改善アクションを提示。llms.txt/robots.txtの自動生成機能付き。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- Cheerio (HTMLパース)
- Vercel (hosting)

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス

## スコアリングカテゴリ (100点満点)

| カテゴリ | 配点 |
|----------|------|
| llms.txt | 15点 |
| robots.txt AI対応 | 15点 |
| 構造化データ | 15点 |
| メタタグ | 15点 |
| コンテンツ構造 | 15点 |
| 内部リンク | 15点 |
| 技術的要素 | 10点 |

## API

- `POST /api/scan` - URLをスキャンしてAEOスコアを取得
- `POST /api/generate` - llms.txt/robots.txtを自動生成
- `POST /api/mcp` - MCP JSON-RPCエンドポイント (AIエージェント向け)

## AI公開チャネル

- `/llms.txt` - AI向けサイト説明
- `/.well-known/agent.json` - A2A Agent Card
- `/robots.txt` - AIクローラー許可設定
- `/api/mcp` - MCP Server

## プロジェクト構造

```
src/
  app/
    page.tsx              # トップページ (URL入力フォーム)
    result/[id]/page.tsx  # 結果ページ
    guides/               # SEOガイドページ (7カテゴリ)
    api/
      scan/route.ts       # スキャンAPI
      generate/route.ts   # ファイル生成API
      mcp/route.ts        # MCP Server
  components/
    ScanForm.tsx          # URL入力フォーム
    ScoreCircle.tsx       # 円形スコア表示
    CategoryBar.tsx       # カテゴリ別バー
    ResultDetail.tsx      # 結果詳細
  lib/
    scanner.ts            # 7カテゴリスキャンロジック
    generator.ts          # llms.txt/robots.txt生成
```

## デプロイ

```bash
vercel
```

ドメイン: aeo.ezoai.jp
