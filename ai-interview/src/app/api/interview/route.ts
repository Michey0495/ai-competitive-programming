import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { callAI, buildInterviewPrompt } from "@/lib/ai";
import type { InterviewInput, InterviewResult } from "@/types";

const RATE_LIMIT = 5;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:interview:api:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through to in-memory
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

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { position, industry, experience, selfpr, motivation } = body;

    if (!position?.trim()) {
      return NextResponse.json(
        { error: "希望職種を入力してください。" },
        { status: 400 }
      );
    }

    const input: InterviewInput = {
      position: String(position).slice(0, 100),
      industry: String(industry ?? "").slice(0, 100),
      experience: String(experience ?? "").slice(0, 50),
      selfpr: String(selfpr ?? "").slice(0, 500),
      motivation: String(motivation ?? "").slice(0, 500),
    };

    const prompt = buildInterviewPrompt(input);
    const text = await callAI(prompt);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    const id = nanoid(10);
    const result: InterviewResult = {
      id,
      input,
      rank: parsed.rank ?? "C",
      verdict: parsed.verdict ?? "要改善",
      evaluations: parsed.evaluations ?? [],
      summary: parsed.summary ?? "",
      advice: parsed.advice ?? "",
      createdAt: new Date().toISOString(),
    };

    const { kv } = await import("@vercel/kv");
    await kv.set(`interview:${id}`, result, { ex: 60 * 60 * 24 * 365 });
    await kv.zadd("interview:feed", { score: Date.now(), member: id });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "面接の準備中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
