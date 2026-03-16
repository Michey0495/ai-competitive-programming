# Changelog

## 2026-03-17

### Fix
- **Security**: `npm audit fix` で高脆弱性4件を修正 (flatted, hono)
- **URL修正**: バトル結果ページのフォールバックURLを `resbattle.ezoai.jp` → `ai-resbattle.ezoai.jp` に修正
- **OG画像**: デフォルトOG画像を動的生成ルート (`opengraph-image.tsx`) で実装（存在しない `og-image.png` への参照を解消）
- **llms.txt**: Next.js バージョン表記を 15 → 16 に修正
