import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import type { InterviewResult } from "@/types";

export const runtime = "edge";
export const alt = "AI模擬面接の結果";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rankColorMap: Record<string, string> = {
  S: "#facc15",
  A: "#a78bfa",
  B: "#60a5fa",
  C: "#9ca3af",
  D: "#f87171",
};

const verdictBgMap: Record<string, string> = {
  合格見込み: "#22c55e",
  要改善: "#eab308",
  厳しい: "#ef4444",
};

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await kv.get<InterviewResult>(`interview:${id}`);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          AI模擬面接
        </div>
      ),
      { ...size }
    );
  }

  const rankColor = rankColorMap[result.rank] ?? "#9ca3af";
  const verdictBg = verdictBgMap[result.verdict] ?? "#6b7280";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          color: "#fff",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#8b5cf6", fontSize: 32, fontWeight: 900 }}>
              {"//"}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
              AI模擬面接
            </span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
            ai-interview.ezoai.jp
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: position + verdict */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
              希望職種
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#fff" }}>
              {result.input.position.slice(0, 20)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  background: verdictBg,
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "6px 20px",
                  borderRadius: 999,
                }}
              >
                {result.verdict}
              </div>
            </div>
          </div>

          {/* Right: rank */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
              RANK
            </div>
            <div
              style={{
                fontSize: 160,
                fontWeight: 900,
                color: rankColor,
                lineHeight: 1,
              }}
            >
              {result.rank}
            </div>
          </div>
        </div>

        {/* Bottom scores */}
        <div
          style={{
            display: "flex",
            gap: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          {result.evaluations.slice(0, 3).map((ev, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}
              >
                Q{i + 1}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color:
                    ev.score === "良い"
                      ? "#4ade80"
                      : ev.score === "要改善"
                        ? "#f87171"
                        : "rgba(255,255,255,0.6)",
                  fontWeight: 700,
                }}
              >
                {ev.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
