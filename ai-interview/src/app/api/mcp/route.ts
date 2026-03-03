import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { InterviewResult } from "@/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

const TOOL_DEFINITION = {
  name: "mock_interview",
  description:
    "Conduct an AI mock interview evaluation. Given a candidate's target position and profile, generates interview questions and evaluates their readiness with a rank (S/A/B/C/D).",
  inputSchema: {
    type: "object" as const,
    properties: {
      position: {
        type: "string",
        description: "Target job position (e.g., Frontend Engineer)",
      },
      industry: {
        type: "string",
        description: "Target industry (optional)",
      },
      experience: {
        type: "string",
        description: "Years of experience (optional)",
      },
      selfpr: {
        type: "string",
        description: "Self-PR / strengths description (optional)",
      },
      motivation: {
        type: "string",
        description: "Motivation for applying (optional)",
      },
    },
    required: ["position"],
  },
};

export async function GET() {
  return NextResponse.json({
    name: "AI模擬面接 MCP Server",
    version: "1.0.0",
    tools: [TOOL_DEFINITION],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: [TOOL_DEFINITION] },
      });
    }

    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      if (toolName !== "mock_interview") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32601, message: `Tool not found: ${toolName}` },
        });
      }

      const args = body.params?.arguments ?? {};
      if (!args.position) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32602, message: "position is required" },
        });
      }

      const anthropic = new Anthropic();
      const prompt = `あなたは大手企業の採用面接官です。厳しくも公正な目で候補者を評価してください。

以下の候補者情報をもとに、模擬面接の評価を行ってください。

【候補者情報】
- 希望職種: ${args.position}
${args.industry ? `- 業界: ${args.industry}` : ""}
${args.experience ? `- 経験年数: ${args.experience}` : ""}
${args.selfpr ? `- 自己PR: ${args.selfpr}` : ""}
${args.motivation ? `- 志望動機: ${args.motivation}` : ""}

以下のJSON形式で回答してください。日本語で回答。絵文字は使わないでください。

{
  "rank": "S, A, B, C, D のいずれか",
  "verdict": "合格見込み or 要改善 or 厳しい の3段階で1つ",
  "evaluations": [
    {"question": "質問1", "evaluation": "評価（2-3文）", "score": "良い or 普通 or 要改善"},
    {"question": "質問2", "evaluation": "評価（2-3文）", "score": "良い or 普通 or 要改善"},
    {"question": "質問3", "evaluation": "評価（2-3文）", "score": "良い or 普通 or 要改善"}
  ],
  "summary": "総合評価（3-4文）",
  "advice": "改善アドバイス（3-4文）"
}

JSONのみを出力してください。`;

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
        input: {
          position: String(args.position).slice(0, 100),
          industry: String(args.industry ?? "").slice(0, 100),
          experience: String(args.experience ?? "").slice(0, 50),
          selfpr: String(args.selfpr ?? "").slice(0, 500),
          motivation: String(args.motivation ?? "").slice(0, 500),
        },
        rank: parsed.rank ?? "C",
        verdict: parsed.verdict ?? "要改善",
        evaluations: parsed.evaluations ?? [],
        summary: parsed.summary ?? "",
        advice: parsed.advice ?? "",
        createdAt: new Date().toISOString(),
      };

      await kv.set(`interview:${id}`, result, { ex: 60 * 60 * 24 * 365 });
      await kv.zadd("interview:feed", { score: Date.now(), member: id });

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { rank: result.rank, verdict: result.verdict, summary: result.summary, advice: result.advice, evaluations: result.evaluations },
                null,
                2
              ),
            },
          ],
          meta: {
            resultId: id,
            resultUrl: `${siteUrl}/result/${id}`,
          },
        },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32601, message: "Method not found" },
    });
  } catch (error) {
    console.error("MCP error:", error);
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message: "Server error" },
    });
  }
}
