# AIレスバトル

2つのレストランをAIが5項目で比較し、バトル形式で勝者を判定するWebサービス。

## Try it

https://ai-resbattle.ezoai.jp

## For AI Agents (MCP)

MCP endpoint: `https://ai-resbattle.ezoai.jp/api/mcp`

### Available Tools

| Tool | Description |
|------|-------------|
| `create_battle` | 2つのレストランを味・コスパ・雰囲気・サービス・アクセスの5項目で比較し、勝者を判定 |

### Example Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_battle",
    "arguments": {
      "restaurant1": "スターバックス",
      "restaurant2": "ドトール"
    }
  }
}
```

### Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"id\":\"abc123\",\"url\":\"https://ai-resbattle.ezoai.jp/battle/abc123\",\"restaurant1\":{\"name\":\"スターバックス\",\"totalScore\":78,\"comment\":\"...\"},\"restaurant2\":{\"name\":\"ドトール\",\"totalScore\":82,\"comment\":\"...\"},\"winner\":\"ドトール\",\"summary\":\"...\",\"categories\":[...]}"
      }
    ]
  }
}
```

### Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `restaurant1` | string | Yes | 比較するレストラン1の名前（50文字以内） |
| `restaurant2` | string | Yes | 比較するレストラン2の名前（50文字以内） |
| `topic` | string | No | バトルのテーマ（例: カフェ対決） |

## Features

- 2つのレストランをバトル形式で比較
- 5カテゴリ（味・コスパ・雰囲気・サービス・アクセス）でAI採点
- 結果のSNSシェア（X / LINE）
- OGP対応の結果カード
- バトル履歴の閲覧

## Tech Stack

Next.js 15 / TypeScript / Tailwind CSS / Claude Haiku / Vercel KV / Vercel

## License

MIT
