import Anthropic from "@anthropic-ai/sdk";
import type { Battle, CategoryScore } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CATEGORIES = ["味・品質", "コスパ", "雰囲気", "サービス", "アクセス"];

export async function generateBattle(
  restaurant1: string,
  restaurant2: string,
  id: string
): Promise<Battle> {
  const prompt = `あなたはレストラン評論家です。以下の2つのレストランを比較・評価してください。

レストラン1: ${restaurant1}
レストラン2: ${restaurant2}

以下のカテゴリで各レストランを0〜100点で採点し、コメントを付けてください。
カテゴリ: ${CATEGORIES.join("、")}

必ず以下のJSON形式のみで回答してください（説明文不要）:

{
  "categories": [
    {
      "category": "カテゴリ名",
      "score1": 数値(0-100),
      "score2": 数値(0-100),
      "comment": "このカテゴリの比較コメント（50字以内）"
    }
  ],
  "comment1": "${restaurant1}の総評（100字以内）",
  "comment2": "${restaurant2}の総評（100字以内）",
  "winner": "restaurant1" または "restaurant2" または "draw",
  "summary": "バトルの総括コメント（100字以内）"
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonText = content.text.trim().replace(/^```json\n?|```$/g, "");
  let parsed: {
    categories: CategoryScore[];
    comment1: string;
    comment2: string;
    winner: "restaurant1" | "restaurant2" | "draw";
    summary: string;
  };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("AI response JSON parse failed");
  }

  const categories: CategoryScore[] = parsed.categories;
  const totalScore1 =
    categories.reduce((sum: number, c: CategoryScore) => sum + c.score1, 0) /
    categories.length;
  const totalScore2 =
    categories.reduce((sum: number, c: CategoryScore) => sum + c.score2, 0) /
    categories.length;

  return {
    id,
    createdAt: new Date().toISOString(),
    restaurant1: {
      name: restaurant1,
      scores: categories,
      totalScore: Math.round(totalScore1),
      comment: parsed.comment1,
    },
    restaurant2: {
      name: restaurant2,
      scores: categories,
      totalScore: Math.round(totalScore2),
      comment: parsed.comment2,
    },
    winner: parsed.winner,
    summary: parsed.summary,
  };
}
