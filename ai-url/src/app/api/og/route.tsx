import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "AEO Checker";
  const score = searchParams.get("score");
  const url = searchParams.get("url");

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
          backgroundColor: "#000000",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: "#34d399",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            AEO Checker
          </div>

          {score ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "120px",
                  fontWeight: "bold",
                  color:
                    Number(score) >= 80
                      ? "#34d399"
                      : Number(score) >= 50
                        ? "#fbbf24"
                        : "#ef4444",
                }}
              >
                {score}
              </div>
              <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)" }}>
                / 100
              </div>
              {url && (
                <div
                  style={{
                    fontSize: "20px",
                    color: "rgba(255,255,255,0.4)",
                    maxWidth: "800px",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  {url}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)" }}>
                AI検索対策チェッカー
              </div>
            </div>
          )}

          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.3)",
              marginTop: "20px",
            }}
          >
            ai-url.ezoai.jp
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
