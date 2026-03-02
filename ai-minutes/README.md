# AI議事録

会議のメモや発言ログを入力するだけで、AIが構造化された議事録を自動生成するWebサービス。

**https://minutes.ezoai.jp**

## 機能

- 会議メモ / 発言ログ → 構造化議事録の自動生成
- 要約・決定事項・アクションアイテム・重要ポイントの自動抽出
- シェア可能な議事録URL（OGP画像付き）
- MCP Server対応（AIエージェントからの直接利用）

## 技術スタック

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui
- Claude Haiku 4.5（議事録生成）
- Vercel KV（データ保存）

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に API キーを設定
npm run dev
```

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API キー | Yes |
| `KV_REST_API_URL` | Vercel KV REST URL | No (ローカルではKV無しで動作) |
| `KV_REST_API_TOKEN` | Vercel KV REST トークン | No |
| `NEXT_PUBLIC_SITE_URL` | サイトURL | No (default: https://minutes.ezoai.jp) |

## API

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/generate` | POST | 議事録を生成 |
| `/api/mcp` | GET | MCP Server情報 + ツール一覧 |
| `/api/mcp` | POST | MCP Serverツール実行 |
| `/api/og/[id]` | GET | OGP画像生成 |

## MCP Server

エンドポイント: `https://minutes.ezoai.jp/api/mcp`

| ツール名 | 説明 |
|----------|------|
| `generate_minutes` | 会議メモから議事録生成 |
| `get_minutes` | IDで議事録取得 |

## AI公開チャネル

- `/.well-known/agent.json` - A2A Agent Card
- `/llms.txt` - AI向けサイト説明
- `/robots.txt` - クローラー許可設定
- `/api/mcp` - MCP Server

## デプロイ

Vercel にデプロイ。環境変数を Vercel Dashboard で設定。

## 環境変数（追加）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 測定 ID | No |

## 進捗

### Night 1 (初回)
- プロジェクト初期構築（Next.js 16, Tailwind v4, shadcn/ui）
- 議事録生成API（Claude Haiku 4.5）
- フォームUI / 結果表示コンポーネント
- 結果共有ページ（OGP画像付き）
- MCP Server API
- AI公開チャネル（llms.txt, agent.json, robots.txt）
- レート制限

### Night 2
- フィードバックAPI（`/api/feedback`）
- フィードバックウィジェット
- Google Analytics 対応（`NEXT_PUBLIC_GA_ID`）

### Night 3
- フィードバック永続化（Vercel KV保存、90日TTL、最新200件管理）
- JSON-LD構造化データ（トップページ: WebApplication、結果ページ: Article）
- エラーページ改善（404 not-found.tsx、error.tsx エラーバウンダリ）
- ローディングアニメーション改善（スピナー + スケルトンUI）
- 結果ページにloading.tsx（Suspense対応スケルトン）
- パフォーマンス最適化（viewport設定、poweredByHeader無効化、compress有効化）
- サイトマップ自動生成（`/sitemap.xml`）
- robots.txt にAIクローラー（GPTBot, Claude-Web, anthropic-ai）明示追加

### 次回やるべきこと
- Vercel にデプロイして動作確認
- OGP画像の改善（フォントの日本語対応確認）
- アクセシビリティ改善（aria属性の追加）

## ライセンス

Private
