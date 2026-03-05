import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIキャッチコピー - プロ品質のキャッチコピーを5案生成";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.15), transparent)",
          }}
        />
        <div
          style={{
            fontSize: 14,
            color: "rgba(34,211,238,0.8)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            fontFamily: "monospace",
            marginBottom: 16,
          }}
        >
          AI Catchcopy Generator
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          AIキャッチコピー
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 600,
            textAlign: "center" as const,
            marginTop: 16,
          }}
        >
          商品情報を入力するだけ。プロ品質のコピーを5案同時生成
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          ai-catchcopy.ezoai.jp
        </div>
      </div>
    ),
    size
  );
}
