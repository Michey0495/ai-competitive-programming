import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { InterviewResult } from "@/types";

export async function GET() {
  try {
    const ids = await kv.zrange("interview:feed", 0, 19, { rev: true });

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    const results = await Promise.all(
      ids.map((id) => kv.get<InterviewResult>(`interview:${id}`))
    );

    const feedItems = results
      .filter((r): r is InterviewResult => r !== null)
      .map((r) => ({
        id: r.id,
        position: r.input.position,
        industry: r.input.industry,
        rank: r.rank,
        verdict: r.verdict,
        summary: r.summary,
        createdAt: r.createdAt,
      }));

    return NextResponse.json(feedItems);
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
