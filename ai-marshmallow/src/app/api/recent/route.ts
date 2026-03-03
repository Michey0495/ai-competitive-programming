import { NextResponse } from "next/server";
import { getRecentQuestions } from "@/lib/storage";

export async function GET() {
  try {
    const questions = await getRecentQuestions(20);

    const items = questions.map((q) => ({
      id: q.id,
      content: q.content,
      answer: q.answer.slice(0, 200),
      createdAt: q.createdAt,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Recent questions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
