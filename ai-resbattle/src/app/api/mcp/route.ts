import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateBattle } from "@/lib/ai";
import { saveBattle } from "@/lib/db";

/**
 * MCP-compatible JSON-RPC endpoint
 *
 * Exposes the battle functionality as an MCP tool:
 * - Tool: "create_battle" - takes topic, restaurant1, restaurant2 and returns battle result
 *
 * Request format (JSON-RPC 2.0):
 * {
 *   "jsonrpc": "2.0",
 *   "id": 1,
 *   "method": "tools/call",
 *   "params": {
 *     "name": "create_battle",
 *     "arguments": {
 *       "restaurant1": "スターバックス",
 *       "restaurant2": "ドトール",
 *       "topic": "カフェ対決"
 *     }
 *   }
 * }
 */

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

const TOOLS = [
  {
    name: "create_battle",
    description:
      "2つのレストランをAIが味・コスパ・雰囲気・サービス・アクセスの5項目で比較し、勝者を判定します。",
    inputSchema: {
      type: "object" as const,
      properties: {
        restaurant1: {
          type: "string",
          description: "比較するレストラン1の名前（50文字以内）",
        },
        restaurant2: {
          type: "string",
          description: "比較するレストラン2の名前（50文字以内）",
        },
        topic: {
          type: "string",
          description: "バトルのテーマ（任意、例: カフェ対決）",
        },
      },
      required: ["restaurant1", "restaurant2"],
    },
  },
];

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message, data },
  };
}

function jsonRpcSuccess(
  id: string | number | null,
  result: unknown
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

async function handleCreateBattle(args: Record<string, unknown>) {
  const restaurant1 = String(args.restaurant1 ?? "").trim();
  const restaurant2 = String(args.restaurant2 ?? "").trim();

  if (!restaurant1 || !restaurant2) {
    throw new Error("restaurant1 and restaurant2 are required");
  }

  if (restaurant1.length > 50 || restaurant2.length > 50) {
    throw new Error("Restaurant names must be 50 characters or less");
  }

  const id = nanoid(10);
  const battle = await generateBattle(restaurant1, restaurant2, id);
  await saveBattle(battle);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-resbattle.ezoai.jp";

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            id: battle.id,
            url: `${baseUrl}/battle/${battle.id}`,
            restaurant1: {
              name: battle.restaurant1.name,
              totalScore: battle.restaurant1.totalScore,
              comment: battle.restaurant1.comment,
            },
            restaurant2: {
              name: battle.restaurant2.name,
              totalScore: battle.restaurant2.totalScore,
              comment: battle.restaurant2.comment,
            },
            winner:
              battle.winner === "restaurant1"
                ? battle.restaurant1.name
                : battle.winner === "restaurant2"
                ? battle.restaurant2.name
                : "draw",
            summary: battle.summary,
            categories: battle.restaurant1.scores.map((s) => ({
              category: s.category,
              score1: s.score1,
              score2: s.score2,
              comment: s.comment,
            })),
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      jsonRpcError(null, -32700, "Parse error"),
      { status: 400 }
    );
  }

  if (body.jsonrpc !== "2.0" || !body.method) {
    return NextResponse.json(
      jsonRpcError(body.id ?? null, -32600, "Invalid Request"),
      { status: 400 }
    );
  }

  const { id, method, params } = body;

  // Handle MCP protocol methods
  switch (method) {
    case "initialize": {
      return NextResponse.json(
        jsonRpcSuccess(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "ai-resbattle",
            version: "1.0.0",
          },
        })
      );
    }

    case "tools/list": {
      return NextResponse.json(
        jsonRpcSuccess(id, { tools: TOOLS })
      );
    }

    case "tools/call": {
      const toolName = (params as Record<string, unknown>)?.name as string;
      const args =
        ((params as Record<string, unknown>)?.arguments as Record<string, unknown>) ?? {};

      if (toolName !== "create_battle") {
        return NextResponse.json(
          jsonRpcError(id, -32601, `Unknown tool: ${toolName}`)
        );
      }

      try {
        const result = await handleCreateBattle(args);
        return NextResponse.json(jsonRpcSuccess(id, result));
      } catch (e) {
        const message = e instanceof Error ? e.message : "Internal error";
        return NextResponse.json(
          jsonRpcError(id, -32000, message)
        );
      }
    }

    default: {
      return NextResponse.json(
        jsonRpcError(id, -32601, `Method not found: ${method}`)
      );
    }
  }
}

// Allow GET for health check / tool discovery
export async function GET() {
  return NextResponse.json({
    name: "ai-resbattle",
    version: "1.0.0",
    description:
      "AIレスバトル - 2つのレストランをAIが5項目で比較し、バトル形式で勝者を判定するMCPサーバー",
    tools: TOOLS,
  });
}
