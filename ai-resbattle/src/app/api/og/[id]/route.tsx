import { ImageResponse } from "next/og";
import { getBattle } from "@/lib/db";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const battle = await getBattle(id);

  if (!battle) {
    return new Response("Not found", { status: 404 });
  }

  const { restaurant1, restaurant2, winner } = battle;
  const winnerName =
    winner === "restaurant1"
      ? restaurant1.name
      : winner === "restaurant2"
      ? restaurant2.name
      : "引き分け";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#a5b4fc",
            marginBottom: 24,
            fontWeight: "bold",
          }}
        >
          ⚔️ AIレスバトル
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "rgba(59,130,246,0.2)",
              border: "2px solid #3b82f6",
              borderRadius: "16px",
              padding: "16px 28px",
              color: "#93c5fd",
              fontSize: 32,
              fontWeight: "bold",
              textAlign: "center",
              maxWidth: "280px",
            }}
          >
            {restaurant1.name}
            <div style={{ fontSize: 20, marginTop: 8, color: "#bfdbfe" }}>
              {restaurant1.totalScore}点
            </div>
          </div>

          <div style={{ color: "#e2e8f0", fontSize: 40, fontWeight: "bold" }}>
            VS
          </div>

          <div
            style={{
              background: "rgba(249,115,22,0.2)",
              border: "2px solid #f97316",
              borderRadius: "16px",
              padding: "16px 28px",
              color: "#fdba74",
              fontSize: 32,
              fontWeight: "bold",
              textAlign: "center",
              maxWidth: "280px",
            }}
          >
            {restaurant2.name}
            <div style={{ fontSize: 20, marginTop: 8, color: "#fed7aa" }}>
              {restaurant2.totalScore}点
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(234,179,8,0.2)",
            border: "2px solid #eab308",
            borderRadius: "12px",
            padding: "16px 32px",
            color: "#fde047",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          🏆 勝者: {winnerName}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
