import { NextResponse } from "next/server";
import { getRecentBattleIds, getBattle } from "@/lib/db";

export async function GET() {
  try {
    const ids = await getRecentBattleIds(20);
    const battles = await Promise.all(ids.map((id) => getBattle(id)));

    const items = battles
      .filter((b): b is NonNullable<typeof b> => b !== null)
      .map((b) => ({
        id: b.id,
        restaurant1: b.restaurant1.name,
        restaurant2: b.restaurant2.name,
        winner: b.winner,
        summary: b.summary,
        createdAt: b.createdAt,
      }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Recent battles error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
