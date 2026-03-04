import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { scanUrl } from "@/lib/scanner";
import { generateLlmsTxt, generateRobotsTxt } from "@/lib/generator";
import type { ScanResult } from "@/types";

// In-memory store for MVP (replace with Vercel KV in production)
const results = new Map<string, ScanResult>();

export { results };

export async function POST(req: NextRequest) {
  let body: { url?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json(
      { error: "URLが必要です" },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "有効なURLを入力してください" },
      { status: 400 }
    );
  }

  try {
    const { categories, totalScore, maxTotalScore } = await scanUrl(url);

    // Generate files if llms.txt is missing
    const llmsCat = categories.find((c) => c.key === "llms_txt");
    const hasLlmsTxt =
      llmsCat?.findings.some((f) => f.status === "pass") ?? false;

    const [llmsTxt, robotsTxt] = await Promise.all([
      hasLlmsTxt ? Promise.resolve(null) : generateLlmsTxt(url),
      generateRobotsTxt(url),
    ]);

    const id = nanoid(10);
    const result: ScanResult = {
      id,
      url,
      totalScore,
      maxTotalScore,
      categories,
      generatedFiles: {
        llmsTxt: llmsTxt,
        robotsTxt: robotsTxt,
      },
      scannedAt: new Date().toISOString(),
    };

    results.set(id, result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "スキャンに失敗しました。URLが正しいか確認してください。",
      },
      { status: 500 }
    );
  }
}
