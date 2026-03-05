import type { Battle, CategoryScore } from "./types";

/** MCP/API入力のサニタイズ: 制御文字除去 + 長さ制限 */
export function sanitizeInput(input: string, maxLength: number): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLength)
    .trim();
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const CATEGORIES = ["味・品質", "コスパ", "雰囲気", "サービス", "アクセス"];

const PROMPT_TEMPLATE = (r1: string, r2: string) =>
  `あなたはレストラン評論家です。以下の2つのレストランを比較・評価してください。

レストラン1: ${r1}
レストラン2: ${r2}

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
  "comment1": "${r1}の総評（100字以内）",
  "comment2": "${r2}の総評（100字以内）",
  "winner": "restaurant1" または "restaurant2" または "draw",
  "summary": "バトルの総括コメント（100字以内）"
}`;

async function callAI(prompt: string): Promise<string> {
  // Anthropic API if key is available (production)
  if (ANTHROPIC_API_KEY) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : "";
  }

  // Ollama fallback (local development)
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
  if (!res.ok) throw new Error("AI生成に失敗しました。しばらく経ってから再度お試しください。");
  const data = await res.json();
  return data.message?.content ?? "";
}

function parseAIResponse(text: string) {
  const cleaned = text.trim().replace(/^```json\n?|```$/g, "");

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: extract JSON from mixed text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // ignore
      }
    }
    throw new Error("AI応答の解析に失敗しました。もう一度お試しください。");
  }
}

export async function generateBattle(
  restaurant1: string,
  restaurant2: string,
  id: string
): Promise<Battle> {
  const prompt = PROMPT_TEMPLATE(restaurant1, restaurant2);
  const text = await callAI(prompt);
  const parsed = parseAIResponse(text);

  // Validate
  if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
    throw new Error("AI応答にカテゴリデータがありません。もう一度お試しください。");
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
