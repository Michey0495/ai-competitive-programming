import { NextRequest, NextResponse } from "next/server";
import { results } from "@/app/api/scan/route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = results.get(id);

  if (!result) {
    return NextResponse.json(
      { error: "結果が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
