import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateBattle } from "@/lib/ai";
import { saveBattle } from "@/lib/db";

// Simple in-memory rate limiter: 5 requests per 60 seconds per IP
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらく待ってからお試しください。" },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { restaurant1, restaurant2 } = body;

  if (
    !restaurant1?.trim() ||
    !restaurant2?.trim() ||
    restaurant1.length > 50 ||
    restaurant2.length > 50
  ) {
    return NextResponse.json(
      { error: "レストラン名を入力してください（50文字以内）" },
      { status: 400 }
    );
  }

  const id = nanoid(10);

  try {
    const battle = await generateBattle(restaurant1.trim(), restaurant2.trim(), id);
    await saveBattle(battle);
    return NextResponse.json({ id });
  } catch (e) {
    console.error("Battle generation failed:", e);
    return NextResponse.json(
      { error: "AI判定に失敗しました。しばらくしてからお試しください。" },
      { status: 500 }
    );
  }
}
