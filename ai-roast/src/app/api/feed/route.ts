import { NextResponse } from "next/server";
import type { RoastResult } from "@/types";

export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json([]);
    }
    const { kv } = await import("@vercel/kv");
    const ids = await kv.zrange("roast:feed", 0, 19, { rev: true });

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    const results = await Promise.all(
      ids.map((id) => kv.get<RoastResult>(`roast:${id}`))
    );

    const feedItems = results
      .filter((r): r is RoastResult => r !== null)
      .map((r) => ({
        id: r.id,
        name: r.input.name,
        job: r.input.job,
        roast: r.roast,
        createdAt: r.createdAt,
      }));

    return NextResponse.json(feedItems);
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
