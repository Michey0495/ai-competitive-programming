import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, message, page } = body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "評価は1-5の数値で指定してください" },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const feedback = {
      id,
      rating,
      message: message || "",
      page: page || "/",
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "",
    };

    console.log("[Feedback]", JSON.stringify(feedback));

    if (process.env.KV_REST_API_URL) {
      await kv.set(`feedback:${id}`, feedback, { ex: 60 * 60 * 24 * 90 });
      await kv.lpush("feedback:list", id);
      await kv.ltrim("feedback:list", 0, 199);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "フィードバックの送信に失敗しました" },
      { status: 500 }
    );
  }
}
