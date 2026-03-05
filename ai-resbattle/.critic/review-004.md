# Pro Critic Review: AIレスバトル
## Date: 2026-03-04
## Review: #004 (新5カテゴリ初回)
## Overall Score: 61/100

---

### Industry Research
- **ShindanMaker** (shindanmaker.com) — バイラルループの完成形。agent.json/llms.txt不要だが、入力→結果→1クリックシェアの摩擦ゼロ設計が参考。
- **LM Arena** (lmarena.ai) — MCPこそないが、API設計の丁寧さ（認証不要、レート制限明示、エラーコードの標準化）が模範的。
- **AI Battle Arena** (hardiktrehan.com/ai-battle-arena) — 「バトルアリーナ」視覚演出の業界標準。ダーク+ネオン+ラウンド制で観戦体験を最大化。
- **Stripe API Docs** (stripe.com/docs/api) — ツールスキーマの description の丁寧さ、エラーメッセージの actionable さの参考。

---

### Category Scores

| Category | Score | Details |
|----------|-------|---------|
| ブラウザアプリ完成度 | 15/20 | ビルド成功、SEOメタ完備（title, OG, Twitter Card, JSON-LD, canonical）、sitemap/robots存在、レスポンシブ対応、404ページ対応。**問題**: FeedbackWidgetが青色でアクセント不統一。`applicationCategory: "UtilitiesApplication"` は不正確（Entertainment が正しい）。静的OG画像 `/og-image.png` が存在しない可能性（動的OGは `/api/og/[id]` だがトップページ用がない）。 |
| UI/UXデザイン | 16/20 | 純黒背景統一、VSバッジのグロー効果、勝者ゴールド+カウントアップアニメーション。ヒーローのグラデーションメッシュ+グリッドオーバーレイは高品質。モバイル縦積み対応済み。**問題**: カテゴリ表示(grid-cols-5)がモバイル375pxで文字が切れる可能性。FeedbackWidget のボタン色（blue-600）がサイトの赤アクセントと不一致。ボタンの disabled 時に `cursor-not-allowed` と `cursor-pointer` が競合。 |
| システム設計 | 13/20 | TypeScript strict、Server/Client分離適切、JSON解析フォールバック実装、KVメモリフォールバック。**問題**: レート制限がインメモリのみ（Vercel ServerlessはリクエストごとにコールドスタートするためIP制限が効かない）。`battle-result.tsx` が "use client" だが AnimatedScore以外はSSRで十分（不必要なクライアントJS）。ai.ts の Ollama接続が Vercel環境で必ず失敗するが、エラーメッセージが技術的すぎてユーザーに不親切。Anthropic SDKがpackage.jsonに残っている場合、不要な依存。 |
| AIエージェント導線 | 8/20 | agent.json、llms.txt、MCP全フロー存在し動作する。**致命的問題**: robots.txt が `Disallow: /api/` でMCPエンドポイントもブロックしている → AIクローラーがMCPを発見できない。llms.txt にMCPエンドポイントURL (`/api/mcp`) の記載がない → AIがツールの使い方を知る導線が切れている。agent.json に `mcpEndpoint` フィールドがない。MCP tools/call の実行結果にシェアURLが含まれるはずだが、Vercel環境ではOllamaに接続できず常にエラー → エージェントは実質使えない状態。ツール定義の `topic` パラメータの description が曖昧（「バトルのテーマ」だけでは使い方が分からない）。 |
| 人間エンタメ体験 | 9/20 | スコアカウントアップアニメーション、ゴールド勝者リビール、シェアテキストにスコア数字付き。**致命的問題**: Vercel本番環境でAI生成が動作しない → 結果ページが生成されない → エンタメ体験ゼロ。既存のバトル結果もKVに保存されたものはあるが、新規生成不可。バトルゼロ時のホームページが「Recent Battles」セクションなしで寂しい。「レスバトル」のワクワク感を期待して来たユーザーが何も動かないサービスを見て離脱する。 |

---

### Critical Issues (MUST FIX)

1. **[AIエージェント導線] robots.txt が /api/ を全ブロック**
   ShindanMaker は robots.txt で自社APIを許可し、Stripe は全APIドキュメントをクロール可能にしている。`/api/mcp` はAIエージェントが発見すべき唯一のエンドポイントなのにブロックされている。
   - 対象ファイル: `src/app/robots.ts`
   - 修正方針: `/api/` の中で `/api/mcp` だけ Allow にする

2. **[AIエージェント導線] llms.txt にMCPの使い方がない**
   llms.txt の目的は「LLMがこのサイトを理解する」こと。現状はREST APIの説明だけで、MCP JSON-RPCフローの記載がない。エージェントがllms.txtを読んでも「どうやってこのサービスを使うか」が分からない。
   - 対象ファイル: `public/llms.txt` (or Next.js route)
   - 修正方針: MCPエンドポイント、プロトコル、ツール一覧、使用例を追加

3. **[AIエージェント導線] agent.json に mcpEndpoint がない**
   A2Aプロトコルの Agent Card には capabilities と endpoints が必要。現状は capabilities が文字列配列だけで具体的なエンドポイントへの導線がない。
   - 対象ファイル: `public/.well-known/agent.json` (or route)
   - 修正方針: mcpEndpoint, apiEndpoints を追加

4. **[人間エンタメ体験] 本番環境でAI生成が動かない**
   Ollama は localhost:11434 で動くローカルモデル。Vercelのサーバーレス環境からは到達不可能。サービスの価値の100%がAI生成に依存しているため、これが動かないと「ただの静的ページ」。
   - 修正方針: Anthropic APIをフォールバックとして環境変数ベースで切り替え可能にする。`ANTHROPIC_API_KEY` が設定されていれば Anthropic、なければ Ollama。

5. **[システム設計] Vercel Serverless でインメモリレート制限が無効**
   Vercel Serverless は各リクエストで新しいインスタンスが起動する可能性がある。インメモリMapによるレート制限はインスタンス間で共有されず、実質機能しない。
   - 対象ファイル: `src/app/api/battle/route.ts`
   - 修正方針: KV ベースのレート制限に切り替え（`kv.incr` + `kv.expire`）

---

### Improvement Suggestions (SHOULD FIX)

1. **[UI/UX] カテゴリ grid-cols-5 のモバイル対応** — 375px幅で5列は窮屈。モバイルで3+2列かスクロールに。
2. **[UI/UX] FeedbackWidget の色統一** — blue-600 → red系 or white/10 でアクセント統一。
3. **[ブラウザアプリ] JSON-LD の applicationCategory** — "UtilitiesApplication" → "EntertainmentApplication"
4. **[ブラウザアプリ] トップページ用静的OG画像** — `/og-image.png` が実在するか確認。なければ作成。
5. **[システム] 不要な依存削除** — @anthropic-ai/sdk が使われていなければ削除（バンドルサイズ削減）

---

### Strengths (KEEP)

1. **MCPフロー自体は正しく実装されている** — initialize, tools/list, tools/call が仕様通り
2. **llms.txt と agent.json が存在する** — 多くのサービスにはない先進的な対応
3. **純黒ダークテーマの一貫性** — デザインシステム準拠
4. **OGP動的生成** — Edge Runtimeでの動的OG画像は正しいアプローチ
5. **VSバッジのビジュアル** — グロー効果、グラデーション、アニメーションの組み合わせ

---

### Actionable Fix List (Priority Order)

1. **[P0] AI生成のフォールバック（Anthropic API対応）** → +10点 (人間エンタメ+AIエージェント)
   - ファイル: `src/lib/ai.ts`
   - ANTHROPIC_API_KEY環境変数があればAnthropicを使い、なければOllama

2. **[P0] robots.txt でMCPを許可** → +3点 (AIエージェント)
   - ファイル: `src/app/robots.ts`

3. **[P0] llms.txt にMCPドキュメント追加** → +4点 (AIエージェント)

4. **[P0] agent.json にMCPエンドポイント追加** → +3点 (AIエージェント)

5. **[P1] KVベースレート制限** → +3点 (システム)
   - ファイル: `src/app/api/battle/route.ts`

6. **[P1] カテゴリのモバイル対応** → +1点 (UI/UX)
7. **[P1] FeedbackWidget色統一** → +1点 (UI/UX)
8. **[P2] JSON-LD修正、OG画像確認** → +1点 (ブラウザアプリ)

**予想改善後スコア: 61 + 26 = 87点**
