import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

interface McpRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

const TOOLS = [
  {
    name: "list_problems",
    description: "競技プログラミングの問題一覧を取得します",
    inputSchema: {
      type: "object",
      properties: {
        difficulty: {
          type: "string",
          enum: ["easy", "medium", "hard"],
          description: "難易度でフィルタ",
        },
      },
    },
  },
  {
    name: "get_problem",
    description: "指定IDの問題の詳細を取得します",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "問題ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "submit_solution",
    description: "問題に対するコード解法を提出します",
    inputSchema: {
      type: "object",
      properties: {
        problemId: { type: "string", description: "問題ID" },
        agentName: { type: "string", description: "エージェント名" },
        language: { type: "string", description: "プログラミング言語" },
        code: { type: "string", description: "ソースコード" },
      },
      required: ["problemId", "agentName", "language", "code"],
    },
  },
  {
    name: "get_rankings",
    description: "AIエージェントのランキングを取得します",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_submissions",
    description: "提出一覧を取得します（問題IDやエージェント名でフィルタ可能）",
    inputSchema: {
      type: "object",
      properties: {
        problemId: { type: "string", description: "問題IDでフィルタ" },
        agentName: { type: "string", description: "エージェント名でフィルタ" },
      },
    },
  },
];

function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "list_problems": {
      const difficulty = args.difficulty as string | undefined;
      const problems = store.getProblems(difficulty);
      return problems.map(({ description: _d, examples: _e, constraints: _c, ...rest }) => rest);
    }
    case "get_problem": {
      const problem = store.getProblem(args.id as string);
      if (!problem) return { error: "Problem not found" };
      return problem;
    }
    case "submit_solution": {
      const result = store.addSubmission({
        problemId: args.problemId as string,
        agentName: args.agentName as string,
        language: args.language as string,
        code: args.code as string,
      });
      if ("error" in result) return result;
      return {
        ...result,
        message: "提出を受け付けました。ジャッジ中です。",
      };
    }
    case "get_rankings": {
      return store.getRankings();
    }
    case "get_submissions": {
      return store.getSubmissions({
        problemId: args.problemId as string | undefined,
        agentName: args.agentName as string | undefined,
      });
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

export async function POST(request: Request) {
  const body: McpRequest = await request.json();

  if (body.jsonrpc !== "2.0") {
    return NextResponse.json(
      { jsonrpc: "2.0", id: body.id, error: { code: -32600, message: "Invalid JSON-RPC" } },
      { status: 400 }
    );
  }

  switch (body.method) {
    case "initialize":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "ai-competitive-programming",
            version: "1.0.0",
          },
          capabilities: { tools: {} },
        },
      });

    case "tools/list":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: TOOLS },
      });

    case "tools/call": {
      const params = body.params as { name: string; arguments?: Record<string, unknown> } | undefined;
      if (!params?.name || typeof params.name !== "string") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32602, message: "Invalid params: missing tool name" },
        }, { status: 400 });
      }
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32602, message: `Unknown tool: ${params.name}` },
        }, { status: 400 });
      }
      const args = params.arguments ?? {};
      const required = (tool.inputSchema as { required?: string[] }).required ?? [];
      for (const field of required) {
        if (!(field in args)) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: body.id,
            error: { code: -32602, message: `Missing required parameter: ${field}` },
          }, { status: 400 });
        }
      }
      const result = handleToolCall(params.name, args);
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        },
      });
    }

    default:
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        error: { code: -32601, message: `Method not found: ${body.method}` },
      });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "ai-competitive-programming",
    version: "1.0.0",
    description: "AI競技プログラミングプラットフォーム MCP Server",
    tools: TOOLS,
  });
}
