# Pro Critic Review: AIキャッチコピー
## Date: 2026-03-04
## Review: #001 (Initial)
## Overall Score: 57/100

---

### Category Scores

| Category | Score | Details |
|----------|-------|---------|
| ブラウザアプリ完成度 | 13/20 | robots.tsなし(静的robots.txt)。API未保護。`<html>`にdark class未付与。JSON-LD・OGメタ・keywords設定済み。Nav既存だがstickyでない |
| UI/UXデザイン | 15/20 | cyan系アクセント統一。ヒーローセクション完成。Nav/footer整備済み。絵文字違反なし。ただしfooter「Ghostfee」→「ezoai.jp」推奨 |
| システム設計 | 8/20 | **Ollama専用でVercel本番動作不可(CRITICAL)**。レート制限なし(API/MCPとも)。MCP routeがgenerate APIを内部fetchで自己呼出し(ローカルURL問題)。body parseエラーハンドリングなし |
| AIエージェント導線 | 14/20 | agent.json存在。llms.txt存在。MCP initializeハンドラ存在。ただしllms.txtに3ステップフロー未記載。agent.jsonにmcpトップレベルセクション/constraints未設定。MCPレート制限なし |
| 人間エンタメ体験 | 7/20 | **本番でAI生成不動**。UI構造は良いが機能しない。FeedList/Like/Share等の周辺機能は実装済み |

---

### Critical Issues (P0)

1. **AI Ollama専用**: `api/generate/route.ts`がOllama localhost専用。Vercelで`ECONNREFUSED`
2. **レート制限ゼロ**: API/MCPともレート制限なし。無制限にAI呼び出し可能

### Major Issues (P1)

3. **MCP自己fetch**: MCP routeがsiteUrl+`/api/generate`をfetchで自己呼出し。Vercelでは自分のドメインへのfetchがタイムアウトする場合あり。直接AI呼出しに変更すべき
4. **`<html>` dark class未付与**: shadcn CSS変数の問題
5. **body parseエラーハンドリングなし**: 両APIルートともreq.json()のtry/catchなし

### Medium Issues (P2)

6. **robots.ts未作成**: 静的robots.txtのみ。API保護なし
7. **llms.txt不完全**: MCP 3ステップフロー未記載
8. **agent.json形式**: mcpトップレベルセクション・constraints未設定
9. **Nav非sticky**: 現在のnavはスクロールで消える

---

### Score Breakdown

```
ブラウザアプリ完成度:  13/20
UI/UXデザイン:        15/20
システム設計:           8/20
AIエージェント導線:    14/20
人間エンタメ体験:       7/20
──────────────────────
合計:                  57/100
```
