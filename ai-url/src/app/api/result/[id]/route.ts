import { NextRequest, NextResponse } from "next/server";
import { getResult } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = getResult(id);

  if (!result) {
    return NextResponse.json(
      { error: "結果が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
