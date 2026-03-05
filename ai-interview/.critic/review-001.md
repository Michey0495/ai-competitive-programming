# Pro Critic Review: AI模擬面接
## Date: 2026-03-04
## Review: #001 (Initial)
## Overall Score: 58/100

---

### Category Scores

| Category | Score | Details |
|----------|-------|---------|
| ブラウザアプリ完成度 | 13/20 | robots.tsがAPI保護なし（内部APIフルオープン）。JSON-LDはpage.tsxに存在(layout推奨)。OG画像ファイル未参照。keywords・canonical設定済み。Nav未実装 |
| UI/UXデザイン | 15/20 | ヒーローセクション完成度高い。violet系アクセント統一。絵文字違反なし。`<html>`にdark class未付与。gray系カラー残存なし。No Nav導線 |
| システム設計 | 10/20 | **Ollama専用でVercel本番動作不可(CRITICAL)**。レート制限がget→setの競合パターン。MCP routeにレート制限なし。MCP routeにinitializeハンドラなし。API routeとMCP routeでプロンプト重複 |
| AIエージェント導線 | 14/20 | agent.json存在しtools記載済み。llms.txtにMCPドキュメント。ただしllms.txtに3ステップフロー未記載(initialize説明なし)。agent.jsonにmcpセクション形式が古い(protocols.mcp)。robots.tsでAPI保護なし |
| 人間エンタメ体験 | 6/20 | **本番でAI生成不動**。ヒーローは見栄えするが、コア機能が動かなければ体験ゼロ。FeedbackWidget/CrossPromo/ShareButtons等の周辺機能は実装済み |

---

### Critical Issues (P0)

1. **AI Ollama専用**: `api/interview/route.ts`と`api/mcp/route.ts`両方がOllama localhost専用。Vercelでは`ECONNREFUSED`。Anthropicフォールバック必須
2. **MCP initializeハンドラ欠如**: MCP仕様の3ステップフロー(initialize→tools/list→tools/call)でinitializeが未実装。仕様非準拠

### Major Issues (P1)

3. **レート制限競合**: `api/interview/route.ts`のcheckRateLimitが`get→set`パターン。並行リクエストで同じカウントを読み取りオーバーランする
4. **MCPレート制限なし**: `api/mcp/route.ts`にレート制限なし。無制限にAI生成呼び出し可能
5. **コード重複**: 面接プロンプトがapi/interviewとapi/mcpで2箇所に重複定義
6. **`<html>` dark class未付与**: shadcn CSS変数のdarkモードが不完全になる可能性

### Medium Issues (P2)

7. **robots.ts API未保護**: `/api/interview`等の内部APIがクローラーに対しフルオープン
8. **Nav未実装**: ホーム以外のページへの導線なし。サイト回遊性ゼロ
9. **llms.txt不完全**: MCP 3ステップフロー(initialize→tools/list→tools/call)の記載なし
10. **agent.json形式**: `protocols.mcp`形式→`mcp`トップレベル + `constraints`推奨

---

### Score Breakdown

```
ブラウザアプリ完成度:  13/20
UI/UXデザイン:        15/20
システム設計:          10/20
AIエージェント導線:    14/20
人間エンタメ体験:       6/20
──────────────────────
合計:                  58/100
```
