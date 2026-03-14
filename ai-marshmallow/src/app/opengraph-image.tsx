import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIマシュマロ -- AIが匿名質問に個性的に回答";
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
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-1px",
          }}
        >
          AIマシュマロ
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.6)",
            maxWidth: 720,
            textAlign: "center",
          }}
        >
          匿名で質問するとAIが個性的に回答します
        </div>
      </div>
    ),
    size
  );
}
