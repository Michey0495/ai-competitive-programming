import { NextRequest, NextResponse } from "next/server";
import { getRecentQuestions } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const cursor = parseInt(searchParams.get("cursor") || "0", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const sort = searchParams.get("sort") || "new";

    let ids: string[] | null = null;

    if (sort === "popular" && process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      ids = await kv.zrange("marshmallow:popular", cursor, cursor + limit, { rev: true }) as string[];
    }

    if (ids && ids.length > 0) {
      const { kv } = await import("@vercel/kv");
      const questions = await Promise.all(
        ids.map((id) => kv.get<{ id: string; content: string; answer: string; createdAt: number }>(
          `question:${id}`
        ))
      );
      const likeKeys = ids.map((id) => `likes:marshmallow:${id}`);
      const likeCounts = await kv.mget<(number | null)[]>(...likeKeys);

      const items = questions
        .filter((q): q is NonNullable<typeof q> => q !== null)
        .map((q, i) => ({
          id: q.id,
          content: q.content,
          answer: q.answer.slice(0, 200),
          createdAt: q.createdAt,
          likes: likeCounts[i] ?? 0,
        }));

      return NextResponse.json({ items, nextCursor: ids.length === limit + 1 ? cursor + limit : null });
    }

    const allQuestions = await getRecentQuestions(cursor + limit + 1);
    const sliced = allQuestions.slice(cursor, cursor + limit + 1);

    let likeCounts: (number | null)[] = [];
    if (process.env.KV_REST_API_URL && sliced.length > 0) {
      const { kv } = await import("@vercel/kv");
      const likeKeys = sliced.map((q) => `likes:marshmallow:${q.id}`);
      likeCounts = await kv.mget<(number | null)[]>(...likeKeys);
    }

    const items = sliced.map((q, i) => ({
      id: q.id,
      content: q.content,
      answer: q.answer.slice(0, 200),
      createdAt: q.createdAt,
      likes: likeCounts[i] ?? 0,
    }));

    const nextCursor = sliced.length === limit + 1 ? cursor + limit : null;

    return NextResponse.json({ items, nextCursor });
  } catch (error) {
    console.error("Recent questions error:", error);
    return NextResponse.json({ items: [], nextCursor: null }, { status: 500 });
  }
}
