export interface ScanFinding {
  status: "pass" | "warn" | "fail";
  message: string;
  detail?: string;
}

export interface ScanRecommendation {
  priority: "high" | "medium" | "low";
  message: string;
  code?: string;
}

export interface CategoryResult {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  findings: ScanFinding[];
  recommendations: ScanRecommendation[];
}

export interface ScanResult {
  id: string;
  url: string;
  totalScore: number;
  maxTotalScore: number;
  categories: CategoryResult[];
  generatedFiles: {
    llmsTxt: string | null;
    robotsTxt: string | null;
  };
  scannedAt: string;
}

export const CATEGORY_CONFIG = [
  { key: "llms_txt", label: "llms.txt", maxScore: 15 },
  { key: "robots_txt", label: "robots.txt AI対応", maxScore: 15 },
  { key: "structured_data", label: "構造化データ", maxScore: 15 },
  { key: "meta_tags", label: "メタタグ", maxScore: 15 },
  { key: "content_structure", label: "コンテンツ構造", maxScore: 15 },
  { key: "internal_links", label: "内部リンク", maxScore: 15 },
  { key: "technical", label: "技術的要素", maxScore: 10 },
] as const;

export const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "cohere-ai",
] as const;
