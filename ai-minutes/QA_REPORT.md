# QA Report - AI議事録

**Date**: 2026-03-03
**Project**: ai-minutes (minutes.ezoai.jp)
**Tester**: Claude QA Agent

---

## Build & Lint

| Check | Status |
|-------|--------|
| `npm run build` | PASS |
| `npm run lint` | PASS (4 errors fixed) |
| TypeScript strict | PASS |

### Lint Fixes
- `src/app/error.tsx`: `<a href="/">` → `<Link href="/">`
- `src/app/not-found.tsx`: `<a href="/">` → `<Link href="/">`
- `src/app/result/[id]/page.tsx` (2箇所): `<a href="/">` → `<Link href="/">`

---

## Security

| Issue | Severity | Status |
|-------|----------|--------|
| JSON-LD XSS via `dangerouslySetInnerHTML` | HIGH | FIXED |
| API `/api/generate` malformed JSON crash | MEDIUM | FIXED |
| API `/api/mcp` malformed JSON crash | MEDIUM | FIXED |
| Notes input無制限 (API cost/timeout risk) | MEDIUM | FIXED |

### Details
- **JSON-LD XSS**: `page.tsx` と `result/[id]/page.tsx` で `JSON.stringify(jsonLd)` を `dangerouslySetInnerHTML` に渡していた。ユーザー入力の `title` に `</script>` を含めるとスクリプトインジェクション可能。`.replace(/</g, "\\u003c")` でエスケープ処理を追加。
- **Malformed JSON**: `/api/generate` と `/api/mcp` で `request.json()` を try/catch なしで呼び出していた。不正なリクエストボディで500エラーになる問題を修正。
- **Input Length**: notes フィールドにフロントエンド (maxLength=20000) とバックエンド (20,000文字制限) の両方で上限を追加。

---

## UI/UX

| Check | Status |
|-------|--------|
| レスポンシブ (モバイル/デスクトップ) | OK |
| ダークテーマ (#000000 背景) | OK |
| アクセントカラー (#10b981 のみ) | OK |
| カードスタイル (bg-white/5 border-white/10) | OK |
| ホバー/トランジション | OK |
| フォントサイズ 16px+ | OK |
| favicon | OK |
| 404ページ | OK |
| エラーページ | OK |
| ローディング状態 | OK |

### UI Fixes
- **フィードバックボタン**: "Feedback" (英語) → "ご意見" (日本語) に修正。CLAUDE.md の "UI: 日本語" 規約に準拠。

---

## Accessibility

| Check | Status |
|-------|--------|
| フォーム label ↔ input 紐づけ | FIXED |
| フィードバック評価ボタン aria-label | FIXED |
| フィードバック閉じるボタン aria-label | FIXED |
| html lang="ja" | OK |
| テキストコントラスト (白 on 黒) | OK |

### Details
- `minutes-form.tsx`: 全4フィールドに `htmlFor`/`id` を追加
- `feedback-widget.tsx`: 評価ボタン (1-5) に `aria-label="N点"` 追加、閉じるボタンに `aria-label="閉じる"` 追加

---

## SEO & AI Discovery

| Check | Status |
|-------|--------|
| title / description | OK |
| OpenGraph metadata | OK |
| Twitter Card | OK |
| JSON-LD (WebApplication) | OK |
| JSON-LD (Article on result page) | OK |
| robots.txt (AI crawler許可) | OK |
| sitemap.xml | OK |
| llms.txt | FIXED (version) |
| /.well-known/agent.json | OK |
| /api/mcp (MCP Server) | OK |
| OGP画像生成 (/api/og/[id]) | OK |

### SEO Fixes
- `llms.txt`: "Next.js 15" → "Next.js 16" に修正 (実際のバージョンと一致)

---

## Edge Cases

| Scenario | Status |
|----------|--------|
| 空入力 | OK (10文字未満でバリデーション) |
| 長文入力 | FIXED (20,000文字制限追加) |
| 特殊文字 (`</script>`, HTML) | FIXED (JSON-LD エスケープ) |
| 不正なJSONリクエスト | FIXED (try/catch追加) |
| レート制限 (5回/10分) | OK |
| KV未設定時のフォールバック | OK |

---

## Performance

| Check | Status |
|-------|--------|
| 不要な依存パッケージ | FIXED |
| Server Components活用 | OK |
| 静的ページプリレンダリング | OK (/, /_not-found, /sitemap.xml) |
| Turbopack build | OK (6.9s) |
| gzip圧縮 (next.config) | OK |

### Performance Fixes
- **lucide-react 削除**: package.json に含まれていたが、src/ 内で一切 import されていなかった。CLAUDE.md の「イラストアイコン一切禁止」規約にも違反していたため削除。

---

## Checklist Summary

- [x] `npm run build` 成功
- [x] `npm run lint` エラーなし
- [x] レスポンシブ対応（モバイル・デスクトップ）
- [x] favicon, OGP設定
- [x] 404ページ
- [x] ローディング状態の表示
- [x] エラー状態の表示

---

## Files Modified

1. `src/app/error.tsx` - `<a>` → `<Link>`, import追加
2. `src/app/not-found.tsx` - `<a>` → `<Link>`, import追加
3. `src/app/result/[id]/page.tsx` - `<a>` → `<Link>`, JSON-LD XSSエスケープ, import追加
4. `src/app/page.tsx` - JSON-LD XSSエスケープ
5. `src/components/minutes-form.tsx` - label htmlFor/id, maxLength追加
6. `src/components/feedback-widget.tsx` - "Feedback"→"ご意見", aria-label追加
7. `src/app/api/generate/route.ts` - JSON parse try/catch, notes length制限
8. `src/app/api/mcp/route.ts` - JSON parse try/catch
9. `public/llms.txt` - Next.jsバージョン修正
10. `package.json` - lucide-react削除
