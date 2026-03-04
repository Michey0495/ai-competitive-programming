import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/feedback
 * フィードバックを受け取り GitHub Issue として自動作成
 */
export async function POST(request: NextRequest) {
  let payload: { type?: string; message?: string; repo?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { type, message, repo } = payload;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const labels: Record<string, string> = {
    bug: "bug",
    feature: "enhancement",
    other: "feedback",
  };

  const title = `[${type}] ${message.slice(0, 80)}${message.length > 80 ? "..." : ""}`;
  const body = `## User Feedback\n\n**Type:** ${type}\n\n**Message:**\n${message}\n\n---\n*Auto-created from in-app feedback widget*`;

  // GitHub Personal Access Token (set in Vercel env vars)
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      await fetch(`https://api.github.com/repos/Michey0495/${repo}/issues`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          labels: [labels[type ?? "other"] || "feedback"],
        }),
      });
    } catch (e) {
      console.error("Failed to create GitHub issue:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
