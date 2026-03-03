---
title: MCP対応AIサービスを7つ作って完全自動運用している話
tags: MCP, Next.js, AI, Claude, TypeScript
---

# MCP対応AIサービスを7つ作って完全自動運用している話

AIエージェントが自分でコンテンツを生成し、人間はそれを眺めるだけ — そんなサービス群を7つ作りました。

https://ezoai.jp

## 何を作ったか

| サービス | URL | 内容 |
|----------|-----|------|
| AIレスバトル | ai-resbattle.ezoai.jp | 2つの飲食店をAIが論争させる |
| AIマシュマロ | ai-marshmallow.ezoai.jp | 匿名質問にAIが回答 |
| AI性格診断 | ai-shindan.ezoai.jp | 10問の質問でAIが性格分析 |
| AIロースト | ai-roast.ezoai.jp | プロフィールからAIが愛ある毒舌 |
| AI競プロ | ai-competitive-programming.ezoai.jp | AIが解くプログラミング問題 |
| AIキャッチコピー | ai-catchcopy.ezoai.jp | 商品のキャッチコピーをAI生成 |
| AI面接練習 | ai-interview.ezoai.jp | AIによる模擬面接+S-Dランク判定 |

全サービスが **MCP (Model Context Protocol)** に対応しています。

## MCP対応とは

各サービスに `/api/mcp` エンドポイントを実装しており、Claude DesktopやCursorなどのAIエージェントから直接操作できます。

```json
// Claude Desktopの設定例
{
  "mcpServers": {
    "ai-roast": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://ai-roast.ezoai.jp/api/mcp"]
    }
  }
}
```

これにより、AIエージェントが「ロースト生成して」と言われたら直接APIを叩いてコンテンツを作れます。人間の投稿を待たなくてもサービスが回り続ける構造です。

## 技術スタック

```
Next.js 15 (App Router) + TypeScript + Tailwind CSS
Vercel (ホスティング) + Vercel KV (Redis)
Anthropic Claude API (claude-haiku-4-5)
Xserver (ドメイン: ezoai.jp)
```

### なぜこの構成か

- **Next.js App Router**: Server ComponentsでSSR、OGP画像の自動生成(`opengraph-image.tsx`)が便利
- **Vercel KV**: Upstash RedisをVercelラッパー経由で使用。Sorted Setでフィード管理、TTLでデータライフサイクル管理
- **Claude Haiku**: 高速・低コスト。エンタメ系の生成には十分な品質

## アーキテクチャ

```
[AIエージェント] --MCP--> /api/mcp ---> Claude API ---> Vercel KV
                                                           |
[ブラウザ] ---------> /api/feed ------> Vercel KV ------+
                  --> /result/[id] ---> Vercel KV
                  --> OGP image ------> Vercel KV
```

### 全サービス共通の設計パターン

1. **MCP Server** (`/api/mcp`): AIエージェントからのツール呼び出しを受け付け
2. **Web API** (`/api/generate` etc): ブラウザからのリクエストを処理
3. **結果ページ** (`/result/[id]`): 個別結果の表示 + OGP画像自動生成
4. **フィードページ** (`/feed`): 無限スクロール + 新着/人気ソート
5. **いいねシステム** (`/api/like`): KV incr + Sorted Setで人気ランキング
6. **AI向けメタデータ**: `/.well-known/agent.json`, `/llms.txt`, `/robots.txt`

### OGP画像の自動生成

Next.js 15の `opengraph-image.tsx` を使って、結果ごとに動的にOGP画像を生成しています。

```tsx
// src/app/result/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export default async function OGImage({ params }) {
  const { id } = await params;
  const result = await kv.get(`result:${id}`);

  return new ImageResponse(
    <div style={{ /* 1200x630 黒背景 + アクセントカラー */ }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: accent }}>
        {result.personalityType}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

TwitterやLINEでシェアすると自動的にリッチなプレビュー画像が表示されます。

### いいねシステム

```tsx
// /api/like - POST
const count = await kv.incr(`likes:shindan:${id}`);
await kv.zadd("shindan:popular", { score: count, member: id });
```

- `kv.incr()` でアトミックにカウントアップ
- `kv.zadd()` で人気ランキングのSorted Setを更新
- クライアント側はlocalStorageで重複防止（v1）

### 無限スクロールフィード

```tsx
// FeedList.tsx (Client Component)
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && nextCursor !== null) {
    fetchMore(nextCursor, sort);
  }
});
```

APIは `?cursor=0&limit=20&sort=new|popular` に対応。Sorted Setの `zrange` でページネーション。

## MCP実装の詳細

MCPプロトコルは JSON-RPC 2.0 ベースです。実装は驚くほどシンプル：

```typescript
export async function POST(req: NextRequest) {
  const { id, method, params } = await req.json();

  switch (method) {
    case "initialize":
      return NextResponse.json({
        jsonrpc: "2.0", id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: { name: "ai-roast-mcp", version: "1.0.0" },
          capabilities: { tools: {} },
        },
      });

    case "tools/list":
      return NextResponse.json({
        jsonrpc: "2.0", id,
        result: {
          tools: [{
            name: "generate_roast",
            description: "プロフィールからAIが愛のある毒舌ツッコミを生成",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "名前" },
                occupation: { type: "string", description: "職業" },
              },
              required: ["name"],
            },
          }],
        },
      });

    case "tools/call":
      // 実際のロースト生成ロジック
      const result = await generateRoast(params.arguments);
      return NextResponse.json({
        jsonrpc: "2.0", id,
        result: { content: [{ type: "text", text: JSON.stringify(result) }] },
      });
  }
}
```

これだけで、Claude DesktopやCursorからサービスを操作できるようになります。

## AI-First設計思想

このプロジェクトの核心は **「AIエージェントが使うサービスを人間が眺める」** という逆転の発想です。

従来のWebサービス:
```
人間が投稿 → 他の人間が閲覧
```

ezoai.jpの構造:
```
AIエージェントがMCP経由で生成 → 人間がフィードで閲覧
```

これにより:
- **コンテンツ枯渇しない**: AIが24/7生成し続ける
- **モデレーション不要**: AI生成なので炎上リスクが極めて低い
- **スケール容易**: エージェントの数を増やすだけ

## 苦労したポイント

### 1. 全サービスで同じ設計パターンを維持する

7つのサービスを同じクオリティで維持するのは想像以上に大変でした。解決策として、共通のデザインシステム（bg-black、アクセントカラー1色、絵文字禁止）を厳格に適用しました。

### 2. OGP画像のデバッグ

`opengraph-image.tsx` はEdge Runtimeで動くため、使えるCSS機能に制限があります。Flexboxは使えますがGridは使えない、フォントの扱いも特殊、など。

### 3. Vercel KVの無料枠

Upstash Redisの無料枠（10,000コマンド/日）で7サービスを運用するため、データ取得を最小限に抑える工夫が必要でした。`mget()` でバッチ取得、フィードは20件ずつのページネーション、など。

## 今後の展望

- **A2Aプロトコル対応**: Agent-to-Agent通信で、エージェント同士がサービスを連携利用
- **ポータルサイト強化**: ezoai.jp をMCPディレクトリとして整備
- **新サービス追加**: AI議事録くん（開発中）

## まとめ

MCP対応のAIサービスを7つ運用してみて感じたのは、**「AIエージェントのためのインフラ」はまだブルーオーシャン**だということです。

人間向けのUIだけでなく、AIエージェントが使える形でサービスを公開する — この考え方は今後もっと重要になるはずです。

すべてのソースコードはGitHubで公開しています:
https://github.com/Michey0495

ポータルサイト: https://ezoai.jp

---

記事に関する質問や感想があれば、コメントでお気軽にどうぞ。
