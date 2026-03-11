#!/bin/bash
# ScreenForge Market Research Engine
# MiroFish 式5段階パイプラインによる市場調査
# Usage: ./research.sh [topic] [--candidates N]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEV_ROOT="$(dirname "$SCRIPT_DIR")"
PROMPT_FILE="$SCRIPT_DIR/prompts/market-research.md"
OUTPUT_BASE="$DEV_ROOT/01plan/research"
DATE=$(date +%Y-%m-%d)
TOPIC="${1:-auto}"
CANDIDATES="${2:-3}"
SLACK_WEBHOOK=$(cat "$SCRIPT_DIR/config.json" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('slack_webhook',''))" 2>/dev/null || echo "")

# Auto-detect topic if not specified
if [ "$TOPIC" = "auto" ]; then
    TOPIC="trending-$(date +%Y%m)"
fi

# Sanitize topic for directory name
SAFE_TOPIC=$(echo "$TOPIC" | tr ' ' '-' | tr -cd '[:alnum:]-_')
OUTPUT_DIR="$OUTPUT_BASE/${DATE}-${SAFE_TOPIC}"
mkdir -p "$OUTPUT_DIR"

echo "=== MiroFish Research Engine ==="
echo "Topic: $TOPIC"
echo "Output: $OUTPUT_DIR"
echo "Candidates: $CANDIDATES"
echo ""

# Slack notification
notify() {
    local msg="$1"
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -s -X POST "$SLACK_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"🔬 Research: $msg\"}" > /dev/null 2>&1 || true
    fi
    echo "[$(date +%H:%M:%S)] $msg"
}

notify "市場調査開始: $TOPIC"

# Read the research prompt
RESEARCH_PROMPT=$(cat "$PROMPT_FILE")

# Read existing services info for context
EXISTING_SERVICES=""
if [ -f "$DEV_ROOT/02dev/projects.json" ]; then
    EXISTING_SERVICES=$(cat "$DEV_ROOT/02dev/projects.json" 2>/dev/null || echo "{}")
fi

# Compose the full prompt
FULL_PROMPT="$RESEARCH_PROMPT

---

## 今回の調査指示

テーマ: $TOPIC
候補アプリ数: ${CANDIDATES}つ以上提案して評価
日付: $DATE

### 既存サービス (重複回避のため参照)
ai-resbattle (AIレスバトル), ai-marshmallow (AIマシュマロ), ai-shindan (AI性格診断),
ai-roast (AIロースト), ai-competitive-programming (AI競プロ),
ai-catchcopy (AIキャッチコピー), ai-interview (AI面接練習)

### 制約
- Next.js 15 + Tailwind + shadcn/ui
- ローカルLLM (Ollama qwen2.5:1.5b) で動作必須
- Vercel + ezoai.jp サブドメインでデプロイ
- MCP Server 必須
- 開発期間: 1-3日

### 出力指示
以下のファイルを順番に生成してください:

1. まず **signals.json** の内容を \`\`\`json ブロックで出力
2. 次に **knowledge_graph.md** の内容を出力
3. 次に **persona_eval.md** の内容を出力
4. 最後に **report.md** (最終レポート) を出力
5. 最後の最後に **decision.json** を \`\`\`json ブロックで出力

各ファイルの開始を === FILENAME: {name} === で明示してください。
WebSearch と WebFetch を積極的に使い、実データに基づいた調査をしてください。
"

# Run Claude with the research prompt
echo "Claude に調査を依頼中..."
claude -p "$FULL_PROMPT" --output-format text 2>/dev/null > "$OUTPUT_DIR/raw_output.md" || {
    notify "調査エラー: Claude 実行失敗"
    exit 1
}

notify "調査完了: $OUTPUT_DIR/raw_output.md"

# Extract individual files from the output
python3 << 'PYEOF' "$OUTPUT_DIR/raw_output.md" "$OUTPUT_DIR"
import sys, re, json

input_file = sys.argv[1]
output_dir = sys.argv[2]

with open(input_file, 'r') as f:
    content = f.read()

# Extract files by marker
files = {
    'signals.json': None,
    'knowledge_graph.md': None,
    'persona_eval.md': None,
    'report.md': None,
    'decision.json': None,
}

for filename in files:
    # Try marker-based extraction
    marker = f"=== FILENAME: {filename} ==="
    if marker in content:
        start = content.index(marker) + len(marker)
        # Find next marker or end
        next_markers = [content.index(f"=== FILENAME: {f} ===") for f in files if f != filename and f"=== FILENAME: {f} ===" in content and content.index(f"=== FILENAME: {f} ===") > start]
        end = min(next_markers) if next_markers else len(content)
        files[filename] = content[start:end].strip()

# Write extracted files
for filename, data in files.items():
    if data:
        # Clean up code blocks for JSON files
        if filename.endswith('.json'):
            json_match = re.search(r'```json?\s*\n(.*?)\n```', data, re.DOTALL)
            if json_match:
                data = json_match.group(1).strip()

        filepath = f"{output_dir}/{filename}"
        with open(filepath, 'w') as f:
            f.write(data)
        print(f"  Extracted: {filename} ({len(data)} bytes)")
    else:
        print(f"  Missing: {filename}")

# If report.md wasn't extracted by markers, save the whole output as report
if not files.get('report.md'):
    with open(f"{output_dir}/report.md", 'w') as f:
        f.write(content)
    print(f"  Fallback: saved full output as report.md")

print("Done.")
PYEOF

notify "ファイル分割完了: $OUTPUT_DIR"

# Print summary
echo ""
echo "=== 調査結果 ==="
ls -la "$OUTPUT_DIR/"
echo ""

# Check decision
if [ -f "$OUTPUT_DIR/decision.json" ]; then
    DECISION=$(python3 -c "import json; d=json.load(open('$OUTPUT_DIR/decision.json')); print(d.get('decision', 'UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
    notify "調査結果: $DECISION — $OUTPUT_DIR/report.md"
    echo "Decision: $DECISION"
else
    notify "調査完了 (decision未抽出) — $OUTPUT_DIR/report.md"
fi

echo ""
echo "レポート: $OUTPUT_DIR/report.md"
