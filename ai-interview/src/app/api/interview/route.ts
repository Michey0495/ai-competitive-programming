import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { InterviewInput, InterviewResult } from "@/types";

const RATE_LIMIT = 5;
const RATE_WINDOW = 600; // 10 minutes

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate:interview:${ip}`;
  const count = (await kv.get<number>(key)) ?? 0;
  if (count >= RATE_LIMIT) return false;
  await kv.set(key, count + 1, { ex: RATE_WINDOW });
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "利用回数の上限に達しました。10分後に再度お試しください。" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { position, industry, experience, selfpr, motivation } = body;

    if (!position?.trim()) {
      return NextResponse.json(
        { error: "希望職種を入力してください。" },
        { status: 400 }
      );
    }

    const input: InterviewInput = {
      position: String(position).slice(0, 100),
      industry: String(industry ?? "").slice(0, 100),
      experience: String(experience ?? "").slice(0, 50),
      selfpr: String(selfpr ?? "").slice(0, 500),
      motivation: String(motivation ?? "").slice(0, 500),
    };

    const anthropic = new Anthropic();

    const prompt = `あなたは大手企業の採用面接官です。厳しくも公正な目で候補者を評価してください。

以下の候補者情報をもとに、模擬面接の評価を行ってください。

【候補者情報】
- 希望職種: ${input.position}
${input.industry ? `- 業界: ${input.industry}` : ""}
${input.experience ? `- 経験年数: ${input.experience}` : ""}
${input.selfpr ? `- 自己PR: ${input.selfpr}` : ""}
${input.motivation ? `- 志望動機: ${input.motivation}` : ""}

以下のJSON形式で回答してください。日本語で回答。絵文字は使わないでください。

{
  "rank": "S, A, B, C, D のいずれか",
  "verdict": "合格見込み or 要改善 or 厳しい の3段階で1つ",
  "evaluations": [
    {
      "question": "面接で聞かれるであろう質問1",
      "evaluation": "この候補者の回答予測と評価（2-3文）",
      "score": "良い or 普通 or 要改善"
    },
    {
      "question": "面接で聞かれるであろう質問2",
      "evaluation": "この候補者の回答予測と評価（2-3文）",
      "score": "良い or 普通 or 要改善"
    },
    {
      "question": "面接で聞かれるであろう質問3",
      "evaluation": "この候補者の回答予測と評価（2-3文）",
      "score": "良い or 普通 or 要改善"
    }
  ],
  "summary": "総合評価（3-4文。厳しくも的確に。候補者の強みと弱みを明確に指摘）",
  "advice": "改善アドバイス（3-4文。具体的で実践的な改善策を提示）"
}

重要:
- JSONのみを出力してください。前後に説明文やマークダウンは不要です
- 質問は実際の面接で聞かれそうなリアルなものにしてください
- 評価は厳しめに。甘い評価は候補者のためにならない
- アドバイスは具体的かつ実践的に`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    const id = nanoid(10);
    const result: InterviewResult = {
      id,
      input,
      rank: parsed.rank ?? "C",
      verdict: parsed.verdict ?? "要改善",
      evaluations: parsed.evaluations ?? [],
      summary: parsed.summary ?? "",
      advice: parsed.advice ?? "",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`interview:${id}`, result, { ex: 60 * 60 * 24 * 365 });
    await kv.zadd("interview:feed", { score: Date.now(), member: id });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "面接の準備中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
