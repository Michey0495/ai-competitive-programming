import type { Battle, CategoryScore } from "./types";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

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

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "user", content: prompt },
      ],
      stream: false,
      options: { num_ctx: 2048, temperature: 0.7 },
    }),
  });
  if (!res.ok) throw new Error("Ollama request failed");
  const data = await res.json();
  const text = data.message?.content ?? "";

  const jsonText = text.trim().replace(/^```json\n?|```$/g, "");
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
