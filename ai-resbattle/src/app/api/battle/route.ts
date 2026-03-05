import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateBattle } from "@/lib/ai";
import { saveBattle } from "@/lib/db";

const RATE_LIMIT = 5;
const RATE_WINDOW_SEC = 60;

// In-memory fallback when KV is unavailable
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  // Try KV-based rate limiting first (works across serverless instances)
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:battle:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through to in-memory
  }

  // In-memory fallback (local dev)
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

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらく待ってからお試しください。" },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }
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
    const message = e instanceof Error ? e.message : "AI判定に失敗しました。しばらくしてからお試しください。";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
