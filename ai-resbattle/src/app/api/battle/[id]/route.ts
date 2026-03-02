import { NextRequest, NextResponse } from "next/server";
import { getBattle } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const battle = await getBattle(id);

  if (!battle) {
    return NextResponse.json({ error: "バトルが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(battle);
}
