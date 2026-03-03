---
title: "Next.js 15でMCP Server対応のWebアプリを作る実装ガイド"
emoji: ""
type: "tech"
topics: ["nextjs", "mcp", "typescript", "claude", "vercel"]
published: false
---

# Next.js 15でMCP Server対応のWebアプリを作る実装ガイド

MCP (Model Context Protocol) は、AIエージェント（Claude Desktop, Cursor等）がWebサービスのツールを直接呼び出すためのプロトコルです。

この記事では、Next.js 15 App RouterにMCPエンドポイントを実装し、AIエージェントからサービスを操作できるようにする方法を解説します。

実際に7つのサービスで運用している実装パターンを元に書いています。

## MCPプロトコルの基本

MCPはJSON-RPC 2.0ベースのプロトコルで、以下の3つのメソッドを実装すれば動きます：

1. `initialize` — サーバー情報を返す
2. `tools/list` — 利用可能なツール一覧を返す
3. `tools/call` — ツールを実行する

## 最小限のMCP Server実装

```typescript
// src/app/api/mcp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, method, params } = body;

  switch (method) {
    case "initialize":
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "my-service-mcp",
            version: "1.0.0",
          },
          capabilities: { tools: {} },
        },
      });

    case "tools/list":
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "greet",
              description: "指定された名前に挨拶する",
              inputSchema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "挨拶する相手の名前",
                  },
                },
                required: ["name"],
              },
            },
          ],
        },
      });

    case "tools/call": {
      const toolName = params?.name;
      const args = params?.arguments ?? {};

      if (toolName === "greet") {
        const greeting = `こんにちは、${args.name}さん！`;
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: greeting }],
          },
        });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Unknown tool" },
      });
    }

    default:
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" },
      });
  }
}
```

## Claude Desktopからの接続

`~/Library/Application Support/Claude/claude_desktop_config.json` に追加：

```json
{
  "mcpServers": {
    "my-service": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-app.vercel.app/api/mcp"
      ]
    }
  }
}
```

`mcp-remote` がHTTP経由のMCP接続をブリッジしてくれます。

## 実践例: AIロースト

実際のサービスでの実装例です。

### ツール定義

```typescript
case "tools/list":
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    result: {
      tools: [{
        name: "generate_roast",
        description: "プロフィール情報からAIが愛のある毒舌ツッコミを生成する",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "名前" },
            occupation: { type: "string", description: "職業" },
            hobby: { type: "string", description: "趣味" },
            selfPR: { type: "string", description: "自己PR" },
          },
          required: ["name"],
        },
      }],
    },
  });
```

### ツール実行

```typescript
case "tools/call": {
  if (params.name === "generate_roast") {
    const args = params.arguments;

    // Claude APIでロースト生成
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `以下のプロフィールに対して愛のある毒舌ツッコミを生成:\n名前: ${args.name}\n職業: ${args.occupation ?? "不明"}`,
      }],
    });

    const roastText = response.content[0].type === "text"
      ? response.content[0].text : "";

    // KVに保存
    const resultId = crypto.randomUUID();
    await kv.set(`roast:${resultId}`, {
      id: resultId,
      input: args,
      roast: roastText,
      createdAt: new Date().toISOString(),
    }, { ex: 60 * 60 * 24 * 365 });

    // フィードに追加
    await kv.zadd("roast:feed", {
      score: Date.now(),
      member: resultId,
    });

    const siteUrl = "https://ai-roast.ezoai.jp";
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: resultId,
            roast: roastText,
            url: `${siteUrl}/result/${resultId}`,
          }),
        }],
      },
    });
  }
}
```

## AI向けメタデータ

MCPだけでなく、AIエージェントがサービスを発見できるようにメタデータも整備します。

### agent.json (A2A Agent Card)

```json
// public/.well-known/agent.json
{
  "name": "AIロースト",
  "description": "プロフィールからAIが愛のある毒舌ツッコミを生成",
  "url": "https://ai-roast.ezoai.jp",
  "capabilities": {
    "mcp": {
      "endpoint": "https://ai-roast.ezoai.jp/api/mcp",
      "protocolVersion": "2024-11-05"
    }
  }
}
```

### llms.txt

```text
# AIロースト
> プロフィールを入力するとAIが愛のある毒舌ツッコミを生成するWebアプリ

## MCP (Model Context Protocol)
- Endpoint: https://ai-roast.ezoai.jp/api/mcp
- Tools: generate_roast
```

### robots.txt

```text
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://ai-roast.ezoai.jp/sitemap.xml
```

## フィードとの連携

MCPツール実行時にKVのSorted Setに結果を追加することで、Webのフィードページに自動的にコンテンツが表示されます。

```typescript
// ツール実行時
await kv.zadd("roast:feed", { score: Date.now(), member: id });

// フィードAPI
const ids = await kv.zrange("roast:feed", cursor, cursor + limit, { rev: true });
```

AIエージェントがMCP経由でコンテンツを生成 → KVに保存 → フィードに自動表示 → 人間がブラウズ

この流れが自動で回ります。

## まとめ

- MCPの実装は `initialize`, `tools/list`, `tools/call` の3メソッドだけ
- Next.js App Routerの `route.ts` に書くだけで動く
- `mcp-remote` を使えばHTTP経由で接続可能
- `agent.json`, `llms.txt`, `robots.txt` でAIからの発見性を高める

MCPに対応するだけで、サービスのユーザーが「人間」から「人間 + AIエージェント」に広がります。

実際の運用例: https://ezoai.jp (7サービス全てMCP対応)
