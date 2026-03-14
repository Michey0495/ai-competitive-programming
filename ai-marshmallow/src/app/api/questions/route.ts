import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateAnswer } from "@/lib/ai";
import { saveQuestion, getRecentQuestions } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rateLimit";
import type { Question } from "@/lib/types";

export async function GET() {
  try {
    const questions = await getRecentQuestions(50);
    return NextResponse.json(questions);
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // IP-based rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const rl = await checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `送信が多すぎます。${Math.ceil(rl.retryAfter / 60)}分後にお試しください。` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const content = typeof body?.content === "string" ? body.content.trim() : "";

    if (!content) {
      return NextResponse.json({ error: "質問内容を入力してください" }, { status: 400 });
    }
    if (content.length > 280) {
      return NextResponse.json({ error: "質問は280文字以内にしてください" }, { status: 400 });
    }

    const answer = await generateAnswer(content);
    const question: Question = {
      id: nanoid(8),
      content,
      answer,
      createdAt: new Date().toISOString(),
    };

    await saveQuestion(question);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json({ error: "エラーが発生しました。しばらく後にお試しください。" }, { status: 500 });
  }
}
