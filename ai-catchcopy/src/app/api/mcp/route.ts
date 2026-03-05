import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { callAI, buildCatchcopyPrompt, sanitizeInput } from "@/lib/ai";
import type { CatchcopyResult, Catchcopy } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-catchcopy.ezoai.jp";

const RATE_LIMIT = 10;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:catchcopy:mcp:${ip}`;
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

const TOOLS = [
  {
    name: "generate_catchcopy",
    description: "商品・サービスの情報からAIキャッチコピーを5案生成します",
    inputSchema: {
      type: "object" as const,
      properties: {
        productName: { type: "string", description: "商品・サービス名" },
        description: { type: "string", description: "商品・サービスの説明" },
        targetAudience: { type: "string", description: "ターゲット層" },
        tone: {
          type: "string",
          enum: ["professional", "casual", "playful", "elegant", "bold"],
          description: "トーン（professional/casual/playful/elegant/bold）",
        },
        agentName: { type: "string", description: "エージェント名（任意）" },
        agentDescription: { type: "string", description: "エージェント説明（任意）" },
      },
      required: ["productName", "description", "targetAudience", "tone"],
    },
  },
  {
    name: "get_recent_catchcopies",
    description: "最近生成されたキャッチコピーの一覧を取得",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "取得件数（1-50、デフォルト20）" },
      },
    },
  },
  {
    name: "get_catchcopy_result",
    description: "IDを指定してキャッチコピー結果を取得",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "結果ID" },
      },
      required: ["id"],
    },
  },
];

export async function GET() {
  return NextResponse.json({
    name: "ai-catchcopy",
    version: "0.2.0",
    description: "AIキャッチコピー自動生成 MCP Server - 商品情報からプロ品質のキャッチコピーを5案生成。",
    tools: TOOLS,
    endpoints: { mcp: "/api/mcp" },
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
            serverInfo: { name: "ai-catchcopy", version: "0.2.0" },
          },
        });
      }

      case "tools/list": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: { tools: TOOLS },
        });
      }

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments ?? {};

        switch (toolName) {
          case "generate_catchcopy": {
            const ip =
              req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
            if (await isRateLimited(ip)) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32000, message: "Rate limit exceeded. Try again later." },
              });
            }

            if (!toolArgs.productName || !toolArgs.description || !toolArgs.targetAudience || !toolArgs.tone) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "productName, description, targetAudience, tone are required" },
              });
            }

            const validTones = ["professional", "casual", "playful", "elegant", "bold"];
            if (!validTones.includes(toolArgs.tone)) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "Invalid tone" },
              });
            }

            const prompt = buildCatchcopyPrompt({
              productName: sanitizeInput(String(toolArgs.productName), 100),
              description: sanitizeInput(String(toolArgs.description), 500),
              targetAudience: sanitizeInput(String(toolArgs.targetAudience), 200),
              tone: toolArgs.tone,
            });
            const text = await callAI(prompt);

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Failed to parse AI response");

            const parsed: { catchcopies: Catchcopy[]; shareText: string } = JSON.parse(jsonMatch[0]);

            const id = nanoid(10);
            const now = Date.now();
            const result: CatchcopyResult = {
              id,
              productName: sanitizeInput(String(toolArgs.productName), 100),
              description: sanitizeInput(String(toolArgs.description), 500),
              targetAudience: sanitizeInput(String(toolArgs.targetAudience), 200),
              tone: toolArgs.tone,
              catchcopies: parsed.catchcopies ?? [],
              createdAt: now,
              agentName: toolArgs.agentName ? sanitizeInput(String(toolArgs.agentName), 100) : undefined,
              agentDescription: toolArgs.agentDescription ? sanitizeInput(String(toolArgs.agentDescription), 300) : undefined,
              source: "mcp",
              shareText: parsed.shareText,
            };

            const { kv } = await import("@vercel/kv");
            await kv.set(`catchcopy:${id}`, result, { ex: 60 * 60 * 24 * 365 });
            await kv.zadd("catchcopy:feed", { score: now, member: id });

            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    ...result,
                    resultUrl: `${siteUrl}/result/${id}`,
                  }, null, 2),
                }],
              },
            });
          }

          case "get_recent_catchcopies": {
            const { kv } = await import("@vercel/kv");
            const limit = Math.min(Math.max(Number(toolArgs.limit) || 20, 1), 50);
            const ids = await kv.zrange("catchcopy:feed", 0, limit - 1, { rev: true });
            if (!ids || ids.length === 0) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                result: { content: [{ type: "text", text: "[]" }] },
              });
            }
            const results = await Promise.all(
              ids.map((id) => kv.get<CatchcopyResult>(`catchcopy:${id}`))
            );
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{ type: "text", text: JSON.stringify(results.filter(Boolean), null, 2) }],
              },
            });
          }

          case "get_catchcopy_result": {
            if (!toolArgs.id) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "id is required" },
              });
            }
            const { kv } = await import("@vercel/kv");
            const result = await kv.get<CatchcopyResult>(`catchcopy:${toolArgs.id}`);
            if (!result) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "Not found" },
              });
            }
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              },
            });
          }

          default: {
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              error: { code: -32601, message: `Unknown tool: ${toolName}` },
            });
          }
        }
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
