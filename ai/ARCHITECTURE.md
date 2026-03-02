# AIマシュマロ - アーキテクチャ設計

## 概要
匿名で質問を投稿するとAIキャラクターが個性的に回答するQ&Aサービス。
各回答はユニークURLで共有可能でSNS拡散を促進する。

## ページ構成

```
/ (Home)
  - 質問投稿フォーム（例題表示付き）
  - 最近の Q&A 一覧（20件）

/q/[id] (Q&A詳細)
  - 質問・回答の表示
  - OGP対応（SNS共有用）
  - Twitter/X・LINEシェアボタン
  - 関連Q&A表示

/about (About)
  - サービス説明
  - AIキャラクター紹介
```

## コンポーネント設計

```
src/
  app/
    layout.tsx                  # Root layout (メタデータ・フォント・GA・JSON-LD)
    page.tsx                    # Home: 質問フォーム + Q&A一覧
    loading.tsx                 # ローディングスケルトン（ホーム）
    not-found.tsx               # 404ページ
    about/page.tsx              # About page
    q/[id]/page.tsx             # Q&A詳細 (SSR + OGP)
    q/[id]/loading.tsx          # ローディングスケルトン（Q&A詳細）
    opengraph-image.tsx         # OGP画像（ホーム）
    q/[id]/opengraph-image.tsx  # OGP画像（Q&A詳細）
    robots.ts                   # robots.txt
    sitemap.ts                  # sitemap.xml
    api/
      questions/route.ts        # GET (一覧) / POST (質問投稿)
      questions/[id]/route.ts   # GET (詳細取得)
      feedback/route.ts         # POST (フィードバック)

  components/
    QuestionForm.tsx    # 質問投稿フォーム (client, 例題・バリデーション付き)
    QACard.tsx          # Q&Aカード表示
    ShareButtons.tsx    # SNSシェアボタン (Twitter/LINE)
    Header.tsx          # サイトヘッダー
    Footer.tsx          # フッター
    FeedbackWidget.tsx  # フィードバックウィジェット (client)
    ui/                 # shadcn/ui コンポーネント群

  lib/
    ai.ts           # Anthropic API呼び出し（マシュキャラクター設定）
    storage.ts      # Vercel KV / in-memoryストレージ（環境自動切替）
    rateLimit.ts    # レート制限（IP単位）
    types.ts        # 型定義
    utils.ts        # ユーティリティ関数
```

## データモデル

```typescript
type Question = {
  id: string;           // nanoid (8文字)
  content: string;      // 質問内容 (max 280文字)
  answer: string;       // AI回答
  createdAt: string;    // ISO8601
}
```

## API設計

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/questions | 最新20件取得 |
| POST | /api/questions | 質問投稿 → AI回答生成 |
| GET | /api/questions/[id] | 個別Q&A取得 |
| POST | /api/feedback | フィードバック送信 |

## AIキャラクター設定

- 名前: **マシュ**（マシュマロの妖精）
- 口調: 明るく、親しみやすく、時々ユニークな視点
- 特徴: 日本語で回答、絵文字適度に使用、200〜400文字程度
- モデル: claude-haiku-4-5

## ストレージ戦略

```
Development: in-memory (Map) → 再起動でリセット
Production: Vercel KV (Redis)
  - Key: question:{id} → Question JSON
  - Key: questions:list → id[] (最新順、最大100件)
```

## SEO / OGP

- `layout.tsx` にサイト全体メタデータ・JSON-LD
- `/q/[id]` に動的OGP（質問・回答の抜粋）
- `robots.ts` → robots.txt
- `sitemap.ts` → sitemap.xml（動的生成）

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **AI**: Anthropic Claude API (claude-haiku-4-5)
- **Storage**: Vercel KV (dev: in-memory fallback)
- **Hosting**: Vercel
- **Domain**: ai.ezoai.jp

## 実装状態

- [x] 全ページ・コンポーネント実装
- [x] OGP対応（動的画像生成）
- [x] SEO対応（robots.txt / sitemap.xml / JSON-LD）
- [x] ローディングスケルトン
- [x] 404ページ
- [x] フィードバックウィジェット
- [x] レート制限
- [x] QA完了（build / lint / TypeScript エラーなし）
- [x] GitHub push 済み (master)
- [ ] 本番デプロイ（Vercel KV環境変数設定後）
