import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { GenerateRequest, CatchcopyResult, Catchcopy } from "@/types";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.productName?.trim() || !body.description?.trim() || !body.targetAudience?.trim() || !body.tone) {
      return NextResponse.json(
        { error: "productName, description, targetAudience, tone は必須です" },
        { status: 400 }
      );
    }

    const validTones = ["professional", "casual", "playful", "elegant", "bold"];
    if (!validTones.includes(body.tone)) {
      return NextResponse.json(
        { error: "無効なトーンです" },
        { status: 400 }
      );
    }

    if (body.productName.length > 100 || body.description.length > 500 || body.targetAudience.length > 200) {
      return NextResponse.json(
        { error: "入力が長すぎます" },
        { status: 400 }
      );
    }

    const prompt = `あなたはトップクラスのコピーライターです。以下の商品・サービス情報をもとに、日本語のキャッチコピーを5案生成してください。

## 商品・サービス情報
- 名前: ${body.productName}
- 説明: ${body.description}
- ターゲット: ${body.targetAudience}
- トーン: ${body.tone}

## ルール
- 各キャッチコピーは20文字以内を目安（最大30文字）
- 短く、記憶に残る表現
- 5案それぞれ異なるアプローチで
- 各案にコンセプト（30文字以内の解説）を付与

## 出力形式（JSON のみ、説明不要）
{
  "catchcopies": [
    { "text": "キャッチコピー", "concept": "コンセプト解説" }
  ],
  "shareText": "【AIキャッチコピー】「${body.productName}」のキャッチコピーをAIが生成！\\n\\n1つ目のキャッチコピーをここに入れてください\\n\\n#AIキャッチコピー #catchcopy"
}`;

    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        options: { num_ctx: 2048, temperature: 0.7 },
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "AI生成に失敗しました。" }, { status: 502 });
    }
    const data = await res.json();
    const text = data.message?.content ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    let parsed: { catchcopies: Catchcopy[]; shareText: string };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    if (!Array.isArray(parsed.catchcopies) || parsed.catchcopies.length === 0) {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    const id = nanoid(10);
    const now = Date.now();

    const result: CatchcopyResult = {
      id,
      productName: body.productName,
      description: body.description,
      targetAudience: body.targetAudience,
      tone: body.tone,
      catchcopies: parsed.catchcopies,
      createdAt: now,
      agentName: body.agentName,
      agentDescription: body.agentDescription,
      source: body.source || "web",
      shareText: parsed.shareText,
    };

    await kv.set(`catchcopy:${id}`, result, { ex: 60 * 60 * 24 * 365 });
    await kv.zadd("catchcopy:feed", { score: now, member: id });

    return NextResponse.json({ id, shareText: parsed.shareText });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
  }
}
