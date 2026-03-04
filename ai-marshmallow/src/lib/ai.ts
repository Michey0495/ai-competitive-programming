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
  if (!res.ok) throw new Error("Ollama request failed");
  const data = await res.json();
  return data.message?.content ?? "";
}
