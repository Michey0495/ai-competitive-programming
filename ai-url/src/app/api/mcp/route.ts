import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { generateLlmsTxt } from "@/lib/generator";

interface JsonRpcRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

const TOOLS = [
  {
    name: "check_aeo_score",
    description:
      "URLを指定してAI検索最適化(AEO)スコアを取得。7カテゴリで0-100点のスコアリングと改善提案を返す。",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "チェック対象のURL",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "generate_llms_txt",
    description:
      "URLを指定してllms.txtファイルを自動生成。AI検索エンジンがサイトを理解するための説明ファイル。",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "対象サイトのURL",
        },
      },
      required: ["url"],
    },
  },
];

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string
) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message },
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
    return jsonRpcError(body.id ?? null, -32600, "Invalid Request");
  }

  if (body.method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      result: { tools: TOOLS },
    });
  }

  if (body.method === "tools/call") {
    const params = body.params as
      | { name?: string; arguments?: Record<string, unknown> }
      | undefined;

    if (!params?.name) {
      return jsonRpcError(body.id, -32601, "Tool not found");
    }

    const args = (params.arguments ?? {}) as { url?: string };

    if (!args.url?.trim()) {
      return jsonRpcError(body.id, -32602, "Parameter 'url' is required");
    }

    try {
      new URL(args.url);
    } catch {
      return jsonRpcError(body.id, -32602, "Invalid URL");
    }

    try {
      if (params.name === "check_aeo_score") {
        const { categories, totalScore, maxTotalScore } = await scanUrl(
          args.url
        );

        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { url: args.url, totalScore, maxTotalScore, categories },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      if (params.name === "generate_llms_txt") {
        const content = await generateLlmsTxt(args.url);

        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{ type: "text", text: content }],
          },
        });
      }

      return jsonRpcError(body.id, -32601, "Tool not found");
    } catch (e) {
      console.error("MCP error:", e);
      return jsonRpcError(body.id, -32000, "Internal error");
    }
  }

  return jsonRpcError(body.id, -32601, "Method not found");
}

export async function GET() {
  return NextResponse.json({
    name: "aeo-checker",
    version: "1.0.0",
    description:
      "AEO Checker - AI検索対策チェッカー。URLのAI検索最適化スコアを診断。",
    tools: TOOLS,
    endpoint: "/api/mcp",
    protocol: "jsonrpc",
  });
}
