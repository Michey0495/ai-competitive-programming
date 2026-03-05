import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { callAI, buildCatchcopyPrompt } from "@/lib/ai";
import type { GenerateRequest, CatchcopyResult, Catchcopy } from "@/types";

const RATE_LIMIT = 5;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:catchcopy:api:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through
  }
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
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: "利用回数の上限に達しました。10分後に再度お試しください。" },
        { status: 429 }
      );
    }

    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body.productName?.trim() || !body.description?.trim() || !body.targetAudience?.trim() || !body.tone) {
      return NextResponse.json(
        { error: "productName, description, targetAudience, tone は必須です" },
        { status: 400 }
      );
    }

    const validTones = ["professional", "casual", "playful", "elegant", "bold"];
    if (!validTones.includes(body.tone)) {
      return NextResponse.json({ error: "無効なトーンです" }, { status: 400 });
    }

    if (body.productName.length > 100 || body.description.length > 500 || body.targetAudience.length > 200) {
      return NextResponse.json({ error: "入力が長すぎます" }, { status: 400 });
    }

    const prompt = buildCatchcopyPrompt({
      productName: body.productName,
      description: body.description,
      targetAudience: body.targetAudience,
      tone: body.tone,
    });
    const text = await callAI(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    let parsed: { catchcopies: Catchcopy[]; shareText: string };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    if (!Array.isArray(parsed.catchcopies) || parsed.catchcopies.length === 0) {
      return NextResponse.json({ error: "AIの応答を解析できませんでした" }, { status: 500 });
    }

    const id = nanoid(10);
    const now = Date.now();

    const result: CatchcopyResult = {
      id,
      productName: body.productName,
      description: body.description,
      targetAudience: body.targetAudience,
      tone: body.tone,
      catchcopies: parsed.catchcopies,
      createdAt: now,
      agentName: body.agentName,
      agentDescription: body.agentDescription,
      source: body.source || "web",
      shareText: parsed.shareText,
    };

    const { kv } = await import("@vercel/kv");
    await kv.set(`catchcopy:${id}`, result, { ex: 60 * 60 * 24 * 365 });
    await kv.zadd("catchcopy:feed", { score: now, member: id });

    return NextResponse.json({ id, shareText: parsed.shareText });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
  }
}
