import { NextRequest, NextResponse } from "next/server";
import { generateLlmsTxt, generateRobotsTxt } from "@/lib/generator";

export async function POST(req: NextRequest) {
  let body: { url?: string; type?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = body.url?.trim();
  const type = body.type?.trim();

  if (!url || !type) {
    return NextResponse.json(
      { error: "url and type are required" },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "有効なURLを入力してください" },
      { status: 400 }
    );
  }

  try {
    let content: string;

    if (type === "llms-txt") {
      content = await generateLlmsTxt(url);
    } else if (type === "robots-txt") {
      content = generateRobotsTxt(url);
    } else {
      return NextResponse.json(
        { error: 'type must be "llms-txt" or "robots-txt"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "生成に失敗しました" },
      { status: 500 }
    );
  }
}
