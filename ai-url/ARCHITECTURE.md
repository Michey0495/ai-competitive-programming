# AEO Checker - Architecture

AI検索対策チェッカー。URLを入力するだけでAI検索エンジンでの発見されやすさを100点満点でスコアリング。

## ページ構成

| パス | 種別 | 説明 |
|------|------|------|
| `/` | Server | トップページ: サービス説明 + URL入力フォーム |
| `/result/[id]` | Server | スキャン結果ページ: スコア表示 + 改善提案 |
| `/guides/llms-txt` | Server | ガイド: llms.txtの書き方 |
| `/guides/robots-txt-ai` | Server | ガイド: robots.txtのAIクローラー設定 |
| `/guides/structured-data` | Server | ガイド: 構造化データ(JSON-LD) |
| `/guides/meta-tags` | Server | ガイド: メタタグ最適化 |
| `/guides/content-structure` | Server | ガイド: AI向けコンテンツ構造 |
| `/guides/sitemap` | Server | ガイド: サイトマップと内部リンク |
| `/guides/technical` | Server | ガイド: 技術的要素(HTTPS, 速度) |

## API設計

### `POST /api/scan`
URLを受け取り、7カテゴリでスキャン・スコアリング。

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "id": "abc123",
  "url": "https://example.com",
  "totalScore": 72,
  "categories": [
    { "key": "llms_txt", "label": "llms.txt", "score": 10, "maxScore": 15, "findings": [...], "recommendations": [...] },
    { "key": "robots_txt", "label": "robots.txt AI対応", "score": 12, "maxScore": 15, ... },
    { "key": "structured_data", "label": "構造化データ", ... },
    { "key": "meta_tags", "label": "メタタグ", ... },
    { "key": "content_structure", "label": "コンテンツ構造", ... },
    { "key": "internal_links", "label": "内部リンク", ... },
    { "key": "technical", "label": "技術的要素", ... }
  ],
  "generatedFiles": {
    "llmsTxt": "# Example.com\n...",
    "robotsTxt": "User-agent: GPTBot\nAllow: /\n..."
  }
}
```

### `POST /api/generate`
llms.txt / robots.txt を生成。

**Request:**
```json
{ "url": "https://example.com", "type": "llms-txt" }
```

### `GET /api/result/[id]`
保存済み結果を取得。

## スコアリング (100点満点)

| カテゴリ | 配点 | チェック内容 |
|----------|------|------------|
| llms.txt | 15点 | 存在有無、フォーマット、内容の充実度 |
| robots.txt AI対応 | 15点 | GPTBot/ClaudeBot/PerplexityBot等の許可設定 |
| 構造化データ | 15点 | JSON-LD/Schema.org の有無・品質 |
| メタタグ | 15点 | title/description/OGP/canonical |
| コンテンツ構造 | 15点 | 見出し階層、FAQ、回答性 |
| 内部リンク | 15点 | サイトマップ、ナビゲーション構造 |
| 技術的要素 | 10点 | HTTPS、読み込み速度、モバイル対応 |

## コンポーネント設計

```
src/
  app/
    page.tsx              # トップ (URL入力フォーム)
    layout.tsx            # 共通レイアウト
    globals.css           # Tailwind
    result/[id]/page.tsx  # 結果ページ
    guides/
      llms-txt/page.tsx
      robots-txt-ai/page.tsx
      structured-data/page.tsx
      meta-tags/page.tsx
      content-structure/page.tsx
      sitemap/page.tsx
      technical/page.tsx
    api/
      scan/route.ts       # スキャンAPI
      generate/route.ts   # ファイル生成API
      result/[id]/route.ts # 結果取得API
      mcp/route.ts        # MCP Server
  components/
    ScanForm.tsx          # URL入力フォーム (client)
    ScoreCircle.tsx       # 総合スコア円形表示 (client)
    CategoryBar.tsx       # カテゴリ別バー (client)
    ResultDetail.tsx      # 結果詳細 (client)
    FileGenerator.tsx     # llms.txt/robots.txt生成 (client)
    Header.tsx            # 共通ヘッダー
    Footer.tsx            # 共通フッター
  lib/
    scanner.ts            # スキャンロジック
    scoring.ts            # スコアリングロジック
    generator.ts          # ファイル生成ロジック
    constants.ts          # AI Bot名等の定数
  types/
    index.ts              # 型定義
```

## データフロー

1. ユーザーがURLを入力 → `ScanForm` がPOST `/api/scan`
2. サーバーがURLをfetch → Cheerioでパース → 7カテゴリ分析
3. 結果をVercel KVに保存 → IDを返却
4. `/result/[id]` にリダイレクト → 結果表示
5. llms.txt/robots.txt生成ボタン → POST `/api/generate`

## MCP Server設計

### ツール定義

**Tool: `check_aeo_score`**
- description: "URLを指定してAI検索最適化(AEO)スコアを取得。7カテゴリで0-100点のスコアリングと改善提案を返す。"
- inputSchema:
  - `url` (string, required): チェック対象URL
- output: スコア結果JSON

**Tool: `generate_llms_txt`**
- description: "URLを指定してllms.txtファイルを自動生成。AI検索エンジンがサイトを理解するための説明ファイル。"
- inputSchema:
  - `url` (string, required): 対象URL
- output: 生成されたllms.txtテキスト

### エンドポイント: `POST /api/mcp`
JSON-RPC 2.0プロトコル。`tools/list` と `tools/call` をサポート。

## AI公開チャネル

### `/llms.txt`
```
# AEO Checker
> AI検索対策チェッカー - URLを入力してAI検索エンジンでの発見されやすさをスコアリング

## API
- POST /api/scan: URLのAEOスコアを取得
- POST /api/mcp: MCP JSON-RPCエンドポイント

## ガイド
- /guides/llms-txt: llms.txtの書き方
- /guides/robots-txt-ai: robots.txtのAIクローラー設定
- /guides/structured-data: 構造化データの実装
```

### `/.well-known/agent.json`
A2A Agent Card。AEOチェックエージェントとして他AIエージェントとの連携を可能にする。

### `/robots.txt`
全AIクローラー許可設定（自ツールが100点を取る模範設定）。

## デザイン

- 背景: `#000000`
- アクセント: `emerald-400` (#34d399)
- カード: `bg-white/5 border border-white/10`
- スコア表示: SVG円形プログレス + カテゴリ別横棒グラフ
