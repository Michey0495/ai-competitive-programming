import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import { kv } from "@vercel/kv";
import { checkRateLimit } from "@/lib/rate-limit";
import type { MinutesInput, MinutesResult } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "レート制限に達しました。10分後にお試しください。" },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  let body: MinutesInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が不正です。" },
      { status: 400 }
    );
  }

  if (!body.notes || body.notes.trim().length < 10) {
    return NextResponse.json(
      { error: "会議メモは10文字以上入力してください。" },
      { status: 400 }
    );
  }

  if (body.notes.length > 20000) {
    return NextResponse.json(
      { error: "会議メモは20,000文字以内で入力してください。" },
      { status: 400 }
    );
  }

  const prompt = `あなたはプロの議事録作成アシスタントです。以下の会議メモから、構造化された議事録を作成してください。

## 会議情報
- タイトル: ${body.title || "未設定"}
- 日付: ${body.date || "未設定"}
- 参加者: ${body.participants || "未設定"}

## 会議メモ
${body.notes}

## 出力形式
以下のJSON形式で出力してください。日本語で記述してください。
{
  "summary": "会議の要約（3-5文程度）",
  "decisions": ["決定事項1", "決定事項2", ...],
  "actionItems": [
    {"assignee": "担当者名", "task": "タスク内容", "deadline": "期限（メモに記載がなければ「要確認」）"},
    ...
  ],
  "keyPoints": ["重要な議論ポイント1", "重要な議論ポイント2", ...],
  "nextSteps": "次回に向けた申し送り事項"
}

JSONのみを出力してください。マークダウンのコードブロックは不要です。`;

  try {
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
      input: body,
      summary: parsed.summary,
      decisions: parsed.decisions || [],
      actionItems: parsed.actionItems || [],
      keyPoints: parsed.keyPoints || [],
      nextSteps: parsed.nextSteps || "",
      createdAt: new Date().toISOString(),
    };

    if (process.env.KV_REST_API_URL) {
      await kv.set(`minutes:${id}`, result, { ex: 60 * 60 * 24 * 30 });

      const feed: string[] = (await kv.get("minutes:feed")) || [];
      feed.unshift(id);
      await kv.set("minutes:feed", feed.slice(0, 50));
    }

    return NextResponse.json(result, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (e) {
    console.error("Generation error:", e);
    return NextResponse.json(
      { error: "議事録の生成に失敗しました。しばらくしてからお試しください。" },
      { status: 500 }
    );
  }
}
