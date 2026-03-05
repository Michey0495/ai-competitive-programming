import { NextRequest, NextResponse } from "next/server";
import { generateAnswer, sanitizeInput } from "@/lib/ai";

const RATE_LIMIT = 10;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:marshmallow:mcp:${ip}`;
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
  name: "ask_question",
  description: "AIキャラクター「マシュ」に匿名で質問し、個性的な回答を得る。恋愛・悩み・雑学など何でもOK。",
  inputSchema: {
    type: "object" as const,
    properties: {
      question: {
        type: "string" as const,
        description: "質問内容 (最大280文字)",
      },
    },
    required: ["question"],
  },
};

export async function GET() {
  return NextResponse.json({
    name: "ai-marshmallow",
    version: "0.2.0",
    description: "AIマシュマロ MCP Server - AIキャラクター「マシュ」に匿名で質問し個性的な回答を得る。",
    tools: [TOOL_DEFINITION],
    endpoints: { mcp: "/api/mcp" },
  });
}

export async function POST(req: NextRequest) {
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
          serverInfo: { name: "ai-marshmallow", version: "0.2.0" },
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
      const toolName = params?.name;
      const args = params?.arguments ?? {};

      if (toolName !== "ask_question") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32601, message: `Unknown tool: ${toolName}` },
        });
      }

      const question = typeof args?.question === "string" ? sanitizeInput(args.question, 280) : "";

      if (!question) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32602, message: "question is required" },
        });
      }

      if (question.length > 280) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32602, message: "question must be 280 characters or less" },
        });
      }

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      if (await isRateLimited(ip)) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32000, message: "Rate limit exceeded. Try again later." },
        });
      }

      try {
        const answer = await generateAnswer(question);
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: {
            content: [{ type: "text", text: answer }],
          },
        });
      } catch (error) {
        console.error("MCP ask_question error:", error);
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32603, message: "Internal error generating answer" },
        });
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
}
