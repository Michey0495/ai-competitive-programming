import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { kv } from "@vercel/kv";
import type { MinutesResult } from "@/lib/types";

const anthropic = new Anthropic();

const TOOLS = [
  {
    name: "generate_minutes",
    description:
      "会議のメモや発言ログから構造化された議事録を生成します。要約、決定事項、アクションアイテム、重要ポイントを抽出します。",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "会議タイトル",
        },
        date: {
          type: "string",
          description: "会議日付 (YYYY-MM-DD)",
        },
        participants: {
          type: "string",
          description: "参加者（カンマ区切り）",
        },
        notes: {
          type: "string",
          description: "会議メモまたは発言ログ（10文字以上）",
        },
      },
      required: ["notes"],
    },
  },
  {
    name: "get_minutes",
    description: "IDを指定して生成済みの議事録を取得します。",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "議事録ID",
        },
      },
      required: ["id"],
    },
  },
];

async function handleGenerateMinutes(args: Record<string, string>) {
  const prompt = `あなたはプロの議事録作成アシスタントです。以下の会議メモから、構造化された議事録を作成してください。

## 会議情報
- タイトル: ${args.title || "未設定"}
- 日付: ${args.date || "未設定"}
- 参加者: ${args.participants || "未設定"}

## 会議メモ
${args.notes}

## 出力形式
以下のJSON形式で出力してください。日本語で記述してください。
{
  "summary": "会議の要約（3-5文程度）",
  "decisions": ["決定事項1", "決定事項2"],
  "actionItems": [{"assignee": "担当者名", "task": "タスク内容", "deadline": "期限"}],
  "keyPoints": ["重要な議論ポイント1", "重要な議論ポイント2"],
  "nextSteps": "次回に向けた申し送り事項"
}

JSONのみを出力してください。`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text);

  const id = nanoid(10);
  const result: MinutesResult = {
    id,
    input: {
      title: args.title || "",
      date: args.date || "",
      participants: args.participants || "",
      notes: args.notes,
    },
    summary: parsed.summary,
    decisions: parsed.decisions || [],
    actionItems: parsed.actionItems || [],
    keyPoints: parsed.keyPoints || [],
    nextSteps: parsed.nextSteps || "",
    createdAt: new Date().toISOString(),
  };

  if (process.env.KV_REST_API_URL) {
    await kv.set(`minutes:${id}`, result, { ex: 60 * 60 * 24 * 30 });
  }

  return result;
}

async function handleGetMinutes(args: Record<string, string>) {
  if (!process.env.KV_REST_API_URL) {
    return { error: "Storage not configured" };
  }
  const result = await kv.get<MinutesResult>(`minutes:${args.id}`);
  if (!result) return { error: "議事録が見つかりません" };
  return result;
}

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
  const { method } = body;

  if (method === "tools/list") {
    return NextResponse.json({ tools: TOOLS });
  }

  if (method === "tools/call") {
    const { name, arguments: args } = body.params;

    try {
      let result;
      if (name === "generate_minutes") {
        result = await handleGenerateMinutes(args);
      } else if (name === "get_minutes") {
        result = await handleGetMinutes(args);
      } else {
        return NextResponse.json(
          { error: `Unknown tool: ${name}` },
          { status: 400 }
        );
      }

      return NextResponse.json({
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      });
    } catch (e) {
      console.error("MCP error:", e);
      return NextResponse.json(
        {
          content: [
            { type: "text", text: `Error: ${(e as Error).message}` },
          ],
          isError: true,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      name: "ai-minutes",
      version: "1.0.0",
      description:
        "AI議事録生成サーバー - 会議メモから構造化された議事録を自動生成",
      tools: TOOLS,
    },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json({
    name: "ai-minutes",
    version: "1.0.0",
    description:
      "AI議事録生成サーバー - 会議メモから構造化された議事録を自動生成",
    tools: TOOLS,
  });
}
