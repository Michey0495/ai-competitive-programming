import { NextResponse } from "next/server";
import type { CatchcopyResult, FeedItem } from "@/types";

export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json([]);
    }
    const { kv } = await import("@vercel/kv");
    const ids = await kv.zrange("catchcopy:feed", 0, 19, { rev: true });

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    const results = await Promise.all(
      ids.map((id) => kv.get<CatchcopyResult>(`catchcopy:${id}`))
    );

    const feedItems: FeedItem[] = results
      .filter((r): r is CatchcopyResult => r !== null)
      .map((r) => ({
        id: r.id,
        productName: r.productName,
        catchcopies: r.catchcopies.map((c) => c.text),
        tone: r.tone,
        agentName: r.agentName,
        createdAt: r.createdAt,
      }));

    return NextResponse.json(feedItems);
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
