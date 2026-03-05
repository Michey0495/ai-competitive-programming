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
          background: "#000000",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        {/* Top gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "radial-gradient(ellipse 80% 100% at 50% -20%, rgba(239,68,68,0.3), transparent)",
          }}
        />

        <div
          style={{
            fontSize: 20,
            color: "rgba(239,68,68,0.7)",
            marginBottom: 32,
            fontWeight: "bold",
            letterSpacing: "0.2em",
          }}
        >
          AI RES BATTLE
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            marginBottom: "36px",
          }}
        >
          {/* Restaurant 1 */}
          <div
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "2px solid rgba(59,130,246,0.4)",
              borderRadius: "16px",
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "240px",
            }}
          >
            <div
              style={{
                color: "#93c5fd",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {restaurant1.name}
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: "900",
                color: "#ffffff",
                marginTop: 8,
              }}
            >
              {restaurant1.totalScore}
              <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>
                pts
              </span>
            </div>
          </div>

          {/* VS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(239,68,68,0.4)",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: 24, fontWeight: "900" }}
              >
                VS
              </span>
            </div>
          </div>

          {/* Restaurant 2 */}
          <div
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "2px solid rgba(249,115,22,0.4)",
              borderRadius: "16px",
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "240px",
            }}
          >
            <div
              style={{
                color: "#fdba74",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {restaurant2.name}
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: "900",
                color: "#ffffff",
                marginTop: 8,
              }}
            >
              {restaurant2.totalScore}
              <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>
                pts
              </span>
            </div>
          </div>
        </div>

        {/* Winner */}
        <div
          style={{
            background: "rgba(234,179,8,0.1)",
            border: "2px solid rgba(234,179,8,0.4)",
            borderRadius: "12px",
            padding: "14px 40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{ color: "#fde047", fontSize: 24, fontWeight: "900" }}
          >
            WINNER:
          </span>
          <span
            style={{ color: "#ffffff", fontSize: 24, fontWeight: "bold" }}
          >
            {winnerName}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
