# AIレスバトル

2つのレストランをAIが多角的に比較・評価！バトル形式で勝敗を判定するWebアプリ。

## 技術スタック

- **フレームワーク:** Next.js 15 (App Router)
- **言語:** TypeScript (strict)
- **UI:** Tailwind CSS + shadcn/ui
- **AI:** Anthropic Claude (claude-haiku-4-5)
- **DB:** Vercel KV (Upstash Redis互換)
- **ホスティング:** Vercel
- **ドメイン:** resbattle.ezoai.jp

## 機能

- 2つのレストランをバトル形式で比較
- 5カテゴリ（味・コスパ・雰囲気・サービス・アクセス）でAI採点
- 結果のSNSシェア（X / LINE）
- バトル履歴の閲覧

## セットアップ

```bash
npm install
cp .env.local.example .env.local
# .env.local に APIキーを設定
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `KV_URL` | Vercel KV URL（Vercelが自動設定） |
| `KV_REST_API_URL` | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | Vercel KV トークン |
| `NEXT_PUBLIC_BASE_URL` | 公開URL（例: https://resbattle.ezoai.jp） |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 測定ID（任意） |
| `GITHUB_TOKEN` | GitHub Personal Access Token（フィードバック用） |

## デプロイ

```bash
vercel --prod
```

Vercelダッシュボードで環境変数を設定し、KV Storageを追加してください。

## プロジェクト構造

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト（GA・フィードバックウィジェット込み）
│   ├── page.tsx            # ホーム（バトル入力）
│   ├── robots.ts           # robots.txt生成
│   ├── sitemap.ts          # サイトマップ生成
│   ├── battle/[id]/        # バトル結果ページ（OGP対応）
│   ├── history/            # 履歴ページ
│   ├── about/              # Aboutページ
│   └── api/
│       ├── battle/         # バトル生成・取得API
│       ├── og/[id]/        # OGP画像生成API
│       └── feedback/       # フィードバックAPI
├── components/
│   ├── ui/                 # shadcn/ui コンポーネント
│   ├── battle-form.tsx     # バトル入力フォーム
│   ├── battle-result.tsx   # 結果表示
│   ├── score-bar.tsx       # スコアバー
│   ├── share-buttons.tsx   # シェアボタン
│   ├── feedback-widget.tsx # フィードバックウィジェット
│   └── nav.tsx             # ナビゲーション
└── lib/
    ├── ai.ts               # Claude API呼び出し
    ├── db.ts               # Vercel KV操作
    └── types.ts            # 型定義
```

詳細設計: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 進捗

### Night 1
- プロジェクト初期設定（Next.js, shadcn/ui, TypeScript strict）
- コアバトル機能: 入力フォーム・API・結果表示
- AI評価ロジック（Claude Haiku）
- Vercel KVによるデータ永続化
- 履歴ページ
- SNSシェア機能（X, LINE）
- ナビゲーション・About・not-foundページ
- 基本的なSEOメタデータ

### Night 2
- フィードバックAPI（`/api/feedback`）追加
- フィードバックウィジェット（画面右下の浮きボタン）追加・layout組み込み
- Google Analytics対応（`NEXT_PUBLIC_GA_ID`環境変数で設定可能）
- 動的OGP画像API（`/api/og/[id]`）追加
- バトル結果ページのOGP・Twitterカードメタデータ強化
- robots.txt、sitemap.xml自動生成
- ビルド確認OK（`npm run build` 成功）

### Night 3
- コピーボタンを `alert()` から inline フィードバック（2秒間「コピーしました✓」表示）に改善
- バトルAPIにIPベースのレート制限を追加（60秒間で最大5リクエスト）
- バトル履歴表示件数を20件→50件に拡大、KVリスト保持数を100→200に変更
- ビルド確認OK（`npm run build` 成功）

### 次回やるべきこと
- Vercelへのデプロイ設定（環境変数・KV Storage）
- 実際の動作確認（本番環境）

### 既知の問題
- KV Storage未設定の場合は履歴機能が動作しない（Vercelデプロイ時に設定必要）
