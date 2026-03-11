# Market Research Agent — MiroFish 式調査エンジン

## 目的
「次に何を作るか」を、多角的調査 → 多ペルソナ評価 → 予測レポートの3段階で決定する。
MiroFish の群体知能パターン（GraphRAG、マルチエージェント、ReACTレポート）を軽量に適用。

---

## 5段階パイプライン

### Stage 1: シグナル収集 (Signal Gathering)

複数ソースから市場シグナルを収集する。**最低5ソース以上**。

**必須調査ソース:**

| ソース | 方法 | 取得情報 |
|--------|------|----------|
| Google Trends | WebSearch `"{keyword} site:trends.google.com"` | 検索ボリューム推移 |
| Product Hunt | WebFetch `producthunt.com/topics/{category}` | 新規プロダクト、票数 |
| 日本 App Store | WebSearch `"{category} アプリ 人気 {year}"` | ランキング、レビュー数 |
| Twitter/X | WebSearch `"{keyword} バズ OR バイラル site:x.com"` | バイラル事例 |
| Reddit | WebSearch `"{keyword} site:reddit.com r/SideProject OR r/webdev"` | 開発者の需要 |
| GitHub Trending | WebFetch `github.com/trending?since=weekly` | 技術トレンド |
| 競合サービス | WebFetch で直接サイトを分析 | 機能、UX、価格 |

**出力: `signals.json`**
```json
{
  "collected_at": "2026-03-11T02:00:00Z",
  "signals": [
    {
      "source": "ProductHunt",
      "title": "...",
      "url": "...",
      "relevance": "high|medium|low",
      "insight": "...",
      "metrics": { "upvotes": 500, "comments": 120 }
    }
  ]
}
```

---

### Stage 2: ナレッジグラフ構築 (Knowledge Graph)

収集したシグナルを構造化し、市場マップを構築する。MiroFish の GraphRAG パターン。

**エンティティ抽出:**
- **Market**: カテゴリ（例: 画像生成, 要約, 翻訳）
- **Product**: 既存サービス（名前, URL, MAU推定, 収益モデル）
- **Technology**: 使用技術（例: GPT-4, Stable Diffusion, Whisper）
- **Audience**: ターゲットユーザー層
- **Gap**: 未充足ニーズ / 市場の空白

**リレーション:**
- Product → uses → Technology
- Product → targets → Audience
- Market → contains → Product
- Gap → exists_in → Market
- Audience → needs → Gap

**出力: `knowledge_graph.md`**
```markdown
## Market Map

### カテゴリ: {category}
- 市場規模推定: {大/中/小}
- 成長段階: {黎明期/成長期/成熟期/衰退期}
- 主要プレイヤー: [{name, url, strength}]

### 空白領域 (Gaps)
1. {gap_description} — 根拠: {evidence}
2. ...

### 技術トレンド
- {tech}: {adoption_status}, {relevance_to_ezoai}
```

---

### Stage 3: 多ペルソナ評価 (Multi-Persona Evaluation)

MiroFish の「独立した性格を持つ数千のエージェント」パターンの軽量版。
6つの固定ペルソナが各候補を独立評価する。

**ペルソナ定義:**

| # | ペルソナ | 視点 | 重視する指標 |
|---|---------|------|-------------|
| 1 | バイラルハンター | SNSバズの可能性 | シェア衝動、スクショ映え、議論誘発性 |
| 2 | テックリード | 技術実現性 | 実装難度、既存技術との適合、保守性 |
| 3 | グロースハッカー | 成長エンジン設計 | CAC、LTV、リテンション、オーガニック流入 |
| 4 | エンドユーザー（日本20代） | 使いたいか | 直感的理解、楽しさ、再利用欲求 |
| 5 | AIエージェント設計者 | MCP/自動利用の設計性 | ツール定義の明確さ、自律利用可能性 |
| 6 | 投資家/ビジネス | 収益性・スケーラビリティ | 課金ポイント、市場規模、差別化 |

**評価プロセス（各ペルソナ × 各候補）:**

```
ペルソナ視点で以下を10点満点で採点:

1. 市場需要 (Demand): この問題を解決したい人は多いか?
2. 差別化 (Differentiation): 既存競合と何が違うか?
3. バイラル性 (Virality): 人に教えたくなるか?
4. 実現性 (Feasibility): ezoai.jp の技術スタック(Next.js+Ollama)で作れるか?
5. MCP適性 (Agent-ready): AIエージェントのツールとして機能するか?

→ 合計50点 × 6ペルソナ = 300点満点
```

---

### Stage 4: 予測レポート生成 (Prediction Report)

MiroFish の ReACT ReportAgent パターン。ツール呼び出し + 推論で最終レポートを生成。

**レポート構造:**

```markdown
# 市場調査レポート: {テーマ}
## 生成日: {date}

## Executive Summary
- 推奨アプリ: {top_candidate}
- 確信度: {high/medium/low}
- 想定開発期間: {X日}
- 期待月間ユーザー: {estimate}

## 1. 市場環境分析
### 1.1 マクロトレンド
### 1.2 競合マップ
### 1.3 空白領域

## 2. 候補アプリ評価
### 候補A: {name}
- コンセプト: {1文}
- ペルソナ評価スコア: {X}/300
- 強み: ...
- リスク: ...

### 候補B: {name}
...

## 3. 多ペルソナ評価詳細
| ペルソナ | 候補A | 候補B | 候補C | コメント |
|---------|-------|-------|-------|---------|
| バイラルハンター | X/50 | X/50 | X/50 | ... |
| ... | | | | |

## 4. 推奨と根拠
### 4.1 推奨: {candidate}
### 4.2 根拠（3つ以上）
### 4.3 リスクと緩和策

## 5. 実装ロードマップ
### Day 1: ...
### Day 2: ...
### Day 3: ...

## 6. 成功指標 (KPI)
- ローンチ1週間: {metric}
- 1ヶ月: {metric}
- 3ヶ月: {metric}

## Appendix
### A. 調査ソース一覧
### B. 生データ (signals.json)
```

---

### Stage 5: 意思決定 (Decision)

レポートに基づき、以下のいずれかを出力:

1. **GO**: 開発開始 → `01plan/` にプロジェクト提案書を生成、`projects.json` に登録
2. **PIVOT**: 候補を変更して Stage 3 から再実行
3. **WAIT**: 市場が未熟。再調査日をスケジュール
4. **KILL**: この方向性は棄却。理由を記録

---

## ezoai.jp 固有の評価基準

### MUST HAVE (満たさなければ候補にならない)
- [ ] Next.js + Tailwind で1-3日で開発可能
- [ ] ローカルLLM (Ollama qwen2.5) で動作可能
- [ ] MCP Server エンドポイント (`/api/mcp`) が設計可能
- [ ] 1入力 → AI生成 → 結果ページ → シェア のフロー
- [ ] 日本語ネイティブ対応

### STRONG PLUS (スコアを大幅に上げる)
- SNSバイラルの実績がある類似ジャンル
- 結果の視覚的インパクト (OGP映え)
- 既存7サービスとのクロスプロモ相乗効果
- 季節性/時事性のフック
- 英語圏にも展開可能

### RED FLAGS (減点要因)
- 既存7サービスとの機能重複
- 大量データが必要（ローカルLLMでは処理不可）
- リアルタイム通信が必須（WebSocket等）
- 規制/法的リスク（医療、金融アドバイス等）
- 1回使って終わり（再訪理由がない）

---

## 調査トリガー

以下のタイミングで自動的に市場調査を起動:

1. **定期**: 月1回（毎月1日深夜）
2. **トレンド検知**: Google Trends で急上昇キーワードを発見時
3. **手動**: `claude -p "market-research {topic}"` で任意テーマ
4. **既存サービス飽和時**: 全7サービスの成長が鈍化した兆候

---

## 出力先

```
01plan/
├── research/
│   ├── {date}-{topic}/
│   │   ├── signals.json          # Stage 1: 生データ
│   │   ├── knowledge_graph.md    # Stage 2: 構造化マップ
│   │   ├── persona_eval.md       # Stage 3: 多ペルソナ評価
│   │   ├── report.md             # Stage 4: 最終レポート
│   │   └── decision.json         # Stage 5: GO/PIVOT/WAIT/KILL
│   └── ...
```

---

## 実行例

```bash
# テーマ指定で調査実行
claude -p "$(cat .orchestrator/prompts/market-research.md)

テーマ: AI×教育
制約: ezoai.jp の技術スタック、ローカルLLM対応
候補数: 3つ以上提案して評価
"

# 結果
# → 01plan/research/2026-03-11-ai-education/report.md に出力
```
