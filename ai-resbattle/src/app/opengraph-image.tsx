import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIレスバトル - AIがレストランを比較・判定";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#60a5fa",
            }}
          />
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            AIレスバトル
          </div>
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          2つのレストランをAIが5項目で徹底比較
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              background: "rgba(59,130,246,0.2)",
              border: "2px solid rgba(96,165,250,0.5)",
              borderRadius: "16px",
              padding: "16px 32px",
              color: "#93c5fd",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            レストラン A
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 36, fontWeight: "bold" }}>
            VS
          </div>
          <div
            style={{
              background: "rgba(249,115,22,0.2)",
              border: "2px solid rgba(251,146,60,0.5)",
              borderRadius: "16px",
              padding: "16px 32px",
              color: "#fdba74",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            レストラン B
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.3)",
            marginTop: "16px",
          }}
        >
          ai-resbattle.ezoai.jp
        </div>
      </div>
    ),
    { ...size }
  );
}
