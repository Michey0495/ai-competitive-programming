import { NextRequest, NextResponse } from "next/server";
import type { InterviewResult } from "@/types";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json({ items: [], nextCursor: null });
    }
    const { kv } = await import("@vercel/kv");
    const { searchParams } = request.nextUrl;
    const cursor = parseInt(searchParams.get("cursor") || "0", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const sort = searchParams.get("sort") || "new";

    const feedKey = sort === "popular" ? "interview:popular" : "interview:feed";
    const ids = await kv.zrange(feedKey, cursor, cursor + limit, { rev: true });

    if (!ids || ids.length === 0) {
      return NextResponse.json({ items: [], nextCursor: null });
    }

    const results = await Promise.all(
      ids.map((id) => kv.get<InterviewResult>(`interview:${id}`))
    );

    const likeKeys = ids.map((id) => `likes:interview:${id}`);
    const likeCounts = await kv.mget<(number | null)[]>(...likeKeys);

    const feedItems = results
      .filter((r): r is InterviewResult => r !== null)
      .map((r, i) => ({
        id: r.id,
        position: r.input.position,
        industry: r.input.industry,
        rank: r.rank,
        verdict: r.verdict,
        summary: r.summary,
        createdAt: r.createdAt,
        likes: likeCounts[i] ?? 0,
      }));

    const nextCursor = ids.length === limit + 1 ? cursor + limit : null;

    return NextResponse.json({ items: feedItems, nextCursor });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json({ items: [], nextCursor: null }, { status: 500 });
  }
}
