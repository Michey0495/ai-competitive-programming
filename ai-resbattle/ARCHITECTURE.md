# ARCHITECTURE.md — ai-resbattle

## プロジェクト概要

**AI レストランバトル** — 2つのレストラン（または料理）をAIが多角的に比較・評価し、バトル形式で勝敗を判定するWebアプリ。

- バイラル性を重視したSNSシェア機能
- 日本語UI、スマホファースト
- サーバーレス構成でゼロ運用コスト

---

## ページ構成・ルーティング

```
/                    ← ホーム (バトル入力フォーム)
/battle/[id]         ← バトル結果ページ (SSG / ISR)
/history             ← 過去のバトル一覧
/about               ← このサービスについて
/api/battle          ← バトル生成API (POST)
/api/battle/[id]     ← バトル取得API (GET)
```

---

## コンポーネント設計

```
src/
├── app/
│   ├── layout.tsx              ← ルートレイアウト (メタデータ, フォント)
│   ├── page.tsx                ← ホームページ
│   ├── battle/
│   │   └── [id]/
│   │       └── page.tsx        ← バトル結果ページ
│   ├── history/
│   │   └── page.tsx            ← 履歴ページ
│   ├── about/
│   │   └── page.tsx            ← Aboutページ
│   └── api/
│       └── battle/
│           ├── route.ts        ← POST: バトル生成
│           └── [id]/
│               └── route.ts    ← GET: バトル取得
├── components/
│   ├── ui/                     ← shadcn/ui コンポーネント
│   ├── battle-form.tsx         ← バトル入力フォーム
│   ├── battle-result.tsx       ← バトル結果表示
│   ├── battle-card.tsx         ← 各レストランのスコアカード
│   ├── score-bar.tsx           ← スコア表示バー
│   ├── share-buttons.tsx       ← SNSシェアボタン
│   ├── history-list.tsx        ← 履歴一覧
│   └── nav.tsx                 ← ナビゲーション
└── lib/
    ├── ai.ts                   ← AI API呼び出しロジック (Claude API)
    ├── db.ts                   ← データ永続化 (Vercel KV / localStorage)
    ├── types.ts                ← 型定義
    └── utils.ts                ← ユーティリティ
```

---

## データフロー設計

### バトル生成フロー

```
1. ユーザーが2つのレストラン名を入力 (フロント)
2. POST /api/battle にリクエスト (フォーム送信)
3. サーバー: Claude API にプロンプト送信
4. Claude: JSON形式でスコア・コメントを返却
5. サーバー: Vercel KV に保存 → battle ID 生成
6. フロント: /battle/[id] にリダイレクト
7. /battle/[id]: KVからデータ取得 → 結果表示
```

### バトル結果データ構造

```typescript
interface Battle {
  id: string;
  createdAt: string;
  restaurant1: {
    name: string;
    scores: CategoryScore[];
    totalScore: number;
    comment: string;
  };
  restaurant2: {
    name: string;
    scores: CategoryScore[];
    totalScore: number;
    comment: string;
  };
  winner: "restaurant1" | "restaurant2" | "draw";
  summary: string;
}

interface CategoryScore {
  category: string;   // 例: "味", "コスパ", "雰囲気", "サービス", "アクセス"
  score1: number;     // 0-100
  score2: number;     // 0-100
  comment: string;
}
```

---

## API設計

### POST /api/battle

**Request:**
```json
{
  "restaurant1": "スターバックス",
  "restaurant2": "ドトール"
}
```

**Response:**
```json
{
  "id": "abc123",
  "redirectUrl": "/battle/abc123"
}
```

### GET /api/battle/[id]

**Response:** Battle オブジェクト (上記参照)

---

## AI プロンプト設計

Claude API (claude-haiku-4-5) を使用。コスト最小化のためHaikuを選択。

**評価カテゴリ:**
- 味・品質 (Taste & Quality)
- コストパフォーマンス (Cost Performance)
- 雰囲気・居心地 (Atmosphere)
- サービス・接客 (Service)
- アクセス・利便性 (Accessibility)

---

## インフラ構成

- **ホスティング:** Vercel (無料プラン)
- **DB:** Vercel KV (Redis互換、無料プラン)
- **AI:** Anthropic Claude API (claude-haiku-4-5)
- **ドメイン:** resbattle.ezoai.jp
- **DNS:** Xserver

---

## 環境変数

```env
ANTHROPIC_API_KEY=
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
NEXT_PUBLIC_BASE_URL=https://resbattle.ezoai.jp
```

---

## SEO・OGP対針

- 各バトルページに動的OGP画像 (`/api/og/[id]`)
- `next/metadata` でページごとにメタデータ設定
- `robots.txt` でクロール制御
- サイトマップ自動生成

---

## MVP スコープ

**In Scope:**
- バトル入力フォーム
- AI評価・スコア表示
- 結果シェア (X / LINE)
- バトル履歴閲覧

**Out of Scope (v1以降):**
- ユーザー認証
- いいね・コメント機能
- カスタムカテゴリ
- 実際のレストランAPI連携 (食べログ等)
