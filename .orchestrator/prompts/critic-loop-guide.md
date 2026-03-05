# Pro Critic Self-Repair Loop Guide

## Overview
開発・機能追加・修正後に起動する自己修繕ループ。
「AIエージェントが使い、人間が楽しむ」という ezoai.jp の二重目的に照らし、
プロの視点で批評→修正を80点到達まで繰り返す。

## 5 Evaluation Categories (各20点 = 100点満点)

| # | Category | 問い |
|---|----------|------|
| 1 | ブラウザアプリ完成度 | プロダクション品質のWebアプリか? |
| 2 | UI/UXデザイン | プロが作ったように見えるか?使いたくなるか? |
| 3 | システム設計・堅牢性 | エンジニアが見て恥ずかしくないコードか? |
| 4 | AIエージェント導線 | 自律型AIエージェントが人間の介入ゼロで使えるか? |
| 5 | 人間エンタメ体験 | AIの生成結果を人間が見て楽しいか?シェアしたいか? |

## Loop Process

```
Step 1: 業界事例調査
  - Agent(subagent_type=general-purpose) で競合3+を調査
  - URL・成功理由・差分を構造化して記録

Step 2: Verification Checklist 実行
  - npm run build（ビルドエラーゼロ確認）
  - curl で robots.txt, llms.txt, agent.json, /api/mcp 確認
  - MCPフロー (initialize → tools/list) テスト
  - OGP画像・メタデータ確認

Step 3: 批評ドキュメント作成
  - 保存先: {project}/.critic/review-{NNN}.md
  - 5カテゴリ × 20点で採点
  - Critical (MUST FIX) / Improvement (SHOULD FIX) / Strengths (KEEP)
  - Actionable Fix List (P0/P1/P2、ファイルパス付き)

Step 4: 修正実装
  - P0 → P1 の優先順で実装
  - 修正後 npm run build で確認

Step 5: 再批評
  - 前回スコアとの差分を記録
  - 80点未満 → Step 2 に戻る
  - 80点以上 → ループ完了、デプロイ

Step 6: デプロイ
  - vercel --prod --yes
```

## AIエージェント導線の具体的チェック項目

### 必須ファイル
| ファイル | 目的 | 場所 |
|---------|------|------|
| agent.json | A2A Agent Card。エージェントがサービスを発見する | `/.well-known/agent.json` |
| llms.txt | AI向けサイト説明。LLMが読んで理解する | `/llms.txt` |
| robots.txt | AIクローラー許可 | `/robots.txt` |
| MCP GET | サービス概要をJSON取得 | `GET /api/mcp` |

### MCPフロー
```
1. POST /api/mcp  {"method":"initialize"}  → protocolVersion, serverInfo, capabilities
2. POST /api/mcp  {"method":"tools/list"}  → ツール定義一覧
3. POST /api/mcp  {"method":"tools/call", "params":{"name":"...", "arguments":{...}}}  → 結果 + URL
```

### ツールスキーマの品質基準
- name: 動詞_名詞（例: create_battle）
- description: 1文で「何をするか」が分かる
- inputSchema: JSON Schema valid、requiredが最小限
- プロパティ description: 具体例を含む（「カテゴリ」→「家電, 食品, ファッション等」）
- レスポンス: 結果データ + シェア可能URL を含む

## 人間エンタメ体験の設計原則

1. **結果ページ = 製品**: 入力ページではなく結果ページが最も重要
2. **3秒ルール**: 結果を見て3秒で「面白い/すごい」と感じるか
3. **スクショ映え**: スクリーンショット1枚で内容が伝わるか
4. **バイラルループ**: シェア → 着地 → 自分もやる → シェア が回るか
5. **再プレイ欲求**: 違う入力で試したくなる設計

## Score History

```
{project}/.critic/
├── review-001.md   # Initial review
├── review-002.md   # Post-fix #1
├── review-003.md   # Post-fix #2
└── ...             # Loop until score >= 80
```

## Prompt Location
→ /Users/lily/dev/02dev/.orchestrator/prompts/pro-critic.md
