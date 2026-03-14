import { NextRequest, NextResponse } from "next/server";
import { generateAnswer } from "@/lib/ai";

/**
 * MCP-compatible JSON-RPC endpoint
 *
 * Exposes the "ask_question" tool for AI agents.
 *
 * Request format (JSON-RPC 2.0):
 *   POST /api/mcp
 *   { "jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": { "name": "ask_question", "arguments": { "question": "..." } } }
 *
 * Also supports:
 *   { "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
 */

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

type JsonRpcRequest = {
  jsonrpc: string;
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  }, { status: code === -32600 ? 400 : code === -32601 ? 404 : 500 });
}

function jsonRpcSuccess(id: string | number | null, result: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    result,
  });
}

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest;
  try {
    body = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (body.jsonrpc !== "2.0" || !body.method) {
    return jsonRpcError(body.id ?? null, -32600, "Invalid JSON-RPC request");
  }

  const { id, method, params } = body;

  // tools/list - return available tools
  if (method === "tools/list") {
    return jsonRpcSuccess(id, {
      tools: [TOOL_DEFINITION],
    });
  }

  // tools/call - execute a tool
  if (method === "tools/call") {
    const toolName = (params as Record<string, unknown>)?.name as string | undefined;
    const args = (params as Record<string, unknown>)?.arguments as Record<string, unknown> | undefined;

    if (toolName !== "ask_question") {
      return jsonRpcError(id, -32601, `Unknown tool: ${toolName}`);
    }

    const question = typeof args?.question === "string" ? args.question.trim() : "";

    if (!question) {
      return jsonRpcError(id, -32602, "question is required");
    }

    if (question.length > 280) {
      return jsonRpcError(id, -32602, "question must be 280 characters or less");
    }

    try {
      const answer = await generateAnswer(question);
      return jsonRpcSuccess(id, {
        content: [
          {
            type: "text",
            text: answer,
          },
        ],
      });
    } catch (error) {
      console.error("MCP ask_question error:", error);
      return jsonRpcError(id, -32603, "Internal error generating answer");
    }
  }

  return jsonRpcError(id, -32601, `Unknown method: ${method}`);
}

// GET endpoint for discovery
export async function GET() {
  return NextResponse.json({
    name: "ai-marshmallow",
    version: "1.0.0",
    description: "AIマシュマロ - 匿名Q&AサービスのMCPエンドポイント",
    tools: [TOOL_DEFINITION],
  });
}
