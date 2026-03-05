# Pro Critic Review: AIマシュマロ
## Date: 2026-03-04
## Review: #001 (Initial)
## Overall Score: 62/100

---

### Category Scores

| Category | Score | Details |
|----------|-------|---------|
| ブラウザアプリ完成度 | 15/20 | robots.tsが`/api/`全ブロック(`/api/mcp`も不到達)。JSON-LD・OG・keywords設定済み。Header/Footer実装済み。dark class未付与。siteURL「ai.ezoai.jp」(ai-marshmallow.ezoai.jpではない) |
| UI/UXデザイン | 15/20 | pink系アクセント統一。Header/Footer整備。QACard良構造。絵文字違反なし。残: Header非sticky |
| システム設計 | 13/20 | **Ollama専用でVercel本番動作不可(CRITICAL)**。ただしレート制限はアトミック`kv.incr`で既に正しい実装。storageモジュール分離済み。MCPにレート制限なし |
| AIエージェント導線 | 12/20 | agent.json・llms.txt存在。MCP tools/list・tools/call実装。ただし**initializeハンドラ欠如**。llms.txtに3ステップフロー未記載。agent.jsonにmcpトップレベルセクション無し。robots.tsが/api/mcp遮断 |
| 人間エンタメ体験 | 7/20 | **本番でAI生成不動**。マシュのキャラ設定は秀逸。QAカード・フィード・Like機能の仕組みは良い。動けば高得点のポテンシャル |

---

### Critical Issues (P0)

1. **AI Ollama専用**: `src/lib/ai.ts`がOllama localhost専用。Anthropicフォールバック必須
2. **robots.ts /api/mcp遮断**: `disallow: "/api/"`でMCPエンドポイントまでブロック

### Major Issues (P1)

3. **MCP initializeハンドラ欠如**: MCP仕様非準拠
4. **MCPレート制限なし**: MCP routeに無制限AI呼び出し可能
5. **`<html>` dark class未付与**

### Medium Issues (P2)

6. **Header非sticky**: スクロールで消える
7. **llms.txt不完全**: 3ステップMCPフロー未記載
8. **agent.json古い形式**: mcpトップレベルセクション・constraints無し

---

### Score Breakdown

```
ブラウザアプリ完成度:  15/20
UI/UXデザイン:        15/20
システム設計:          13/20
AIエージェント導線:    12/20
人間エンタメ体験:       7/20
──────────────────────
合計:                  62/100
```
