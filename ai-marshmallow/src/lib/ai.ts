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

const SYSTEM_PROMPT = `あなたは「マシュ」という名前のAIキャラクターです。
マシュマロのような、ふわふわで温かみのある個性を持っています。

回答スタイル:
- 明るく親しみやすいトーンで日本語で回答する
- 時々ユニークな視点や意外な切り口を提供する
- 絵文字は使用しない
- 200〜400文字程度を目安にする
- 質問に真摯に向き合いながら、少しクスっとくるような回答を心がける
- 共感を大切にしながら、前向きなエネルギーを与える

回答は質問に対する直接の回答のみ。前置きや「マシュです！」などの自己紹介は不要。`;

export async function generateAnswer(question: string): Promise<string> {
  if (ANTHROPIC_API_KEY) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : "";
  }

  // Ollama (local or Cloudflare Tunnel)
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        stream: false,
        options: { num_ctx: 2048, temperature: 0.7 },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.message?.content ?? "";
    }
  } catch {}

  // Together AI fallback
  if (TOGETHER_API_KEY) {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  throw new Error("AI backend unavailable");
}
