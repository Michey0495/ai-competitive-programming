"use client";

import { useState } from "react";
import type { ScanResult } from "@/types";
import { ScoreCircle } from "./ScoreCircle";
import { CategoryBar } from "./CategoryBar";

interface ResultDetailProps {
  result: ScanResult;
}

export function ResultDetail({ result }: ResultDetailProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const selected = result.categories.find((c) => c.key === selectedCategory);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">診断結果</h1>
        <p className="text-white/50 text-sm break-all">{result.url}</p>
        <ScoreCircle
          score={result.totalScore}
          maxScore={result.maxTotalScore}
        />
        <p className="text-white/60 text-sm">
          {result.totalScore >= 80
            ? "AI検索エンジンへの対応が十分です"
            : result.totalScore >= 50
              ? "改善の余地があります"
              : "AI検索対策が不足しています"}
        </p>
      </div>

      {/* Category bars */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">カテゴリ別スコア</h2>
        {result.categories.map((cat) => (
          <CategoryBar
            key={cat.key}
            category={cat}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.key ? null : cat.key
              )
            }
          />
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">{selected.label}</h3>

          {/* Findings */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/70">チェック結果</h4>
            {selected.findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    f.status === "pass"
                      ? "bg-emerald-400"
                      : f.status === "warn"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                />
                <span className="text-white/80 text-sm">{f.message}</span>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {selected.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/70">改善提案</h4>
              {selected.recommendations.map((r, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        r.priority === "high"
                          ? "bg-red-400/20 text-red-300"
                          : r.priority === "medium"
                            ? "bg-yellow-400/20 text-yellow-300"
                            : "bg-white/10 text-white/60"
                      }`}
                    >
                      {r.priority === "high"
                        ? "重要"
                        : r.priority === "medium"
                          ? "推奨"
                          : "任意"}
                    </span>
                    <span className="text-white/80 text-sm">{r.message}</span>
                  </div>
                  {r.code && (
                    <pre className="bg-black/50 border border-white/10 rounded p-3 text-xs text-emerald-300 overflow-x-auto">
                      {r.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg cursor-pointer transition-all duration-200 text-sm"
        >
          別のURLを診断
        </button>
        <button
          onClick={() => {
            const text = `${result.url} のAEOスコア: ${result.totalScore}/${result.maxTotalScore}点`;
            if (navigator.share) {
              navigator.share({ title: "AEO Checker", text, url: window.location.href });
            } else {
              navigator.clipboard.writeText(`${text}\n${window.location.href}`);
              alert("結果をコピーしました");
            }
          }}
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg cursor-pointer transition-all duration-200 text-sm"
        >
          結果を共有
        </button>
      </div>

      {/* Generated files */}
      {(result.generatedFiles.llmsTxt || result.generatedFiles.robotsTxt) && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">自動生成ファイル</h2>

          {result.generatedFiles.llmsTxt && (
            <FileBlock
              title="llms.txt"
              content={result.generatedFiles.llmsTxt}
            />
          )}

          {result.generatedFiles.robotsTxt && (
            <FileBlock
              title="robots.txt"
              content={result.generatedFiles.robotsTxt}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FileBlock({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white font-medium text-sm">{title}</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs text-white/50 hover:text-white px-3 py-1 bg-white/5 rounded cursor-pointer transition-all duration-200"
          >
            {copied ? "コピーしました" : "コピー"}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1 bg-emerald-400/10 rounded cursor-pointer transition-all duration-200"
          >
            ダウンロード
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs text-white/70 overflow-x-auto max-h-64">
        {content}
      </pre>
    </div>
  );
}
