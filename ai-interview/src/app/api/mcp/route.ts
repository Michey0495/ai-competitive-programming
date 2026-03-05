import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { callAI, buildInterviewPrompt, sanitizeInput } from "@/lib/ai";
import type { InterviewResult } from "@/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

const RATE_LIMIT = 10;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:interview:mcp:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through
  }
  const now = Date.now();
  const entry = memRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    memRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_SEC * 1000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const TOOL_DEFINITION = {
  name: "mock_interview",
  description:
    "AI模擬面接 - 候補者の希望職種とプロフィールから面接質問を生成し、面接準備度をS/A/B/C/Dランクで評価します。",
  inputSchema: {
    type: "object" as const,
    properties: {
      position: {
        type: "string",
        description: "希望職種（例: フロントエンドエンジニア）",
      },
      industry: {
        type: "string",
        description: "志望業界（任意）",
      },
      experience: {
        type: "string",
        description: "経験年数（任意）",
      },
      selfpr: {
        type: "string",
        description: "自己PR（任意）",
      },
      motivation: {
        type: "string",
        description: "志望動機（任意）",
      },
    },
    required: ["position"],
  },
};

export async function GET() {
  return NextResponse.json({
    name: "ai-interview",
    version: "0.2.0",
    description:
      "AI模擬面接 MCP Server - 希望職種とプロフィールからAIが面接質問を生成し、S~Dランクで面接準備度を評価。",
    tools: [TOOL_DEFINITION],
    endpoints: {
      mcp: "/api/mcp",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      });
    }

    const { method, id: requestId, params } = body;

    switch (method) {
      case "initialize": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "ai-interview", version: "0.2.0" },
          },
        });
      }

      case "tools/list": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: { tools: [TOOL_DEFINITION] },
        });
      }

      case "tools/call": {
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        if (await isRateLimited(ip)) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: requestId ?? null,
            error: { code: -32000, message: "Rate limit exceeded. Try again later." },
          });
        }

        const toolName = params?.name;
        if (toolName !== "mock_interview") {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: requestId ?? null,
            error: { code: -32601, message: `Unknown tool: ${toolName}` },
          });
        }

        const args = params?.arguments ?? {};
        if (!args.position) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: requestId ?? null,
            error: { code: -32602, message: "Invalid params: position is required" },
          });
        }

        const input = {
          position: sanitizeInput(String(args.position), 100),
          industry: args.industry ? sanitizeInput(String(args.industry), 100) : undefined,
          experience: args.experience ? sanitizeInput(String(args.experience), 50) : undefined,
          selfpr: args.selfpr ? sanitizeInput(String(args.selfpr), 500) : undefined,
          motivation: args.motivation ? sanitizeInput(String(args.motivation), 500) : undefined,
        };

        const prompt = buildInterviewPrompt(input);
        const text = await callAI(prompt);

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
            position: input.position,
            industry: input.industry ?? "",
            experience: input.experience ?? "",
            selfpr: input.selfpr ?? "",
            motivation: input.motivation ?? "",
          },
          rank: parsed.rank ?? "C",
          verdict: parsed.verdict ?? "要改善",
          evaluations: parsed.evaluations ?? [],
          summary: parsed.summary ?? "",
          advice: parsed.advice ?? "",
          createdAt: new Date().toISOString(),
        };

        const { kv } = await import("@vercel/kv");
        await kv.set(`interview:${id}`, result, { ex: 60 * 60 * 24 * 365 });
        await kv.zadd("interview:feed", { score: Date.now(), member: id });

        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    rank: result.rank,
                    verdict: result.verdict,
                    summary: result.summary,
                    advice: result.advice,
                    evaluations: result.evaluations,
                    resultUrl: `${siteUrl}/result/${id}`,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      default: {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
      }
    }
  } catch (err) {
    console.error("MCP error:", err);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: "Internal error" },
      },
      { status: 500 }
    );
  }
}
