# Changelog

## 2026-03-10 - 保守メンテナンス

### Fixed
- サイトURL fallback を `ai.ezoai.jp` から正しい `ai-marshmallow.ezoai.jp` に修正（layout, sitemap, シェアテキスト）
- セキュリティ脆弱性3件を修正（express-rate-limit, hono）via `npm audit fix`

### Verified
- `npm run build` 正常
- TypeScript エラーなし
- AI公開ファイル（robots.txt, llms.txt, agent.json）正常
- GitHub Issues: なし
- Vercel デプロイ完了
