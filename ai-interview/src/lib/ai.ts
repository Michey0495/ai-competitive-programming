/** MCP/API入力のサニタイズ: 制御文字除去 + 長さ制限 */
export function sanitizeInput(input: string, maxLength: number): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLength)
    .trim();
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

export async function callAI(prompt: string): Promise<string> {
  // Anthropic (primary)
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

  // Together AI (fallback)
  if (TOGETHER_API_KEY) {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    }
  }

  // Ollama (local fallback)
  try {
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
    if (res.ok) {
      const data = await res.json();
      return data.message?.content ?? "";
    }
  } catch {}

  throw new Error("AI backend unavailable");
}

export function buildInterviewPrompt(input: {
  position: string;
  industry?: string;
  experience?: string;
  selfpr?: string;
  motivation?: string;
}): string {
  return `あなたは大手企業の採用面接官です。厳しくも公正な目で候補者を評価してください。

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
    {"question": "面接で聞かれるであろう質問1", "evaluation": "この候補者の回答予測と評価（2-3文）", "score": "良い or 普通 or 要改善"},
    {"question": "面接で聞かれるであろう質問2", "evaluation": "この候補者の回答予測と評価（2-3文）", "score": "良い or 普通 or 要改善"},
    {"question": "面接で聞かれるであろう質問3", "evaluation": "この候補者の回答予測と評価（2-3文）", "score": "良い or 普通 or 要改善"}
  ],
  "summary": "総合評価（3-4文。厳しくも的確に。候補者の強みと弱みを明確に指摘）",
  "advice": "改善アドバイス（3-4文。具体的で実践的な改善策を提示）"
}

重要:
- JSONのみを出力してください。前後に説明文やマークダウンは不要です
- 質問は実際の面接で聞かれそうなリアルなものにしてください
- 評価は厳しめに。甘い評価は候補者のためにならない
- アドバイスは具体的かつ実践的に`;
}
