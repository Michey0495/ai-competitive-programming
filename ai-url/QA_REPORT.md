# QA Report - AEO Checker

Date: 2026-03-05 (QA Pass 4)

## Build & Lint

| Check | Status |
|-------|--------|
| `npm run build` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| TypeScript strict mode | PASS |

## Fixes Applied (Pass 4)

1. **BUG: ScanForm `type="url"` ブロック** (ScanForm.tsx) - `type="url"` のブラウザネイティブ検証が `https://` 自動付与ロジックより先に動作し、プロトコルなしURL(例: `example.com`)の入力を拒否。`type="text" inputMode="url"` に変更。
2. **SEO: 虚偽のaggregateRating削除** (page.tsx) - WebApplication JSON-LDに実データに基づかない `aggregateRating` (4.8/5, 12件) が含まれていた。Googleガイドライン違反のため削除。
3. **A11y: FileBlockクリップボードエラーハンドリング** (ResultDetail.tsx) - `navigator.clipboard.writeText()` のPromiseが未ハンドリング。`.then()` でエラーケースを処理。

## Fixes Applied (Pass 3)

1. **Lint error: setState in useEffect** (ScanHistory.tsx) - Replaced with lazy state initializer.
2. **Lint warning: unused variable** (ScanHistory.tsx) - Changed to `const [history] = useState(...)`.
3. **Navigation: full page reload** (ResultDetail.tsx) - Changed to `router.push("/")`.
4. **UX: alert() instead of toast** (ResultDetail.tsx) - Replaced with `toast.success()`/`toast.error()`.
5. **a11y: ScoreCircle missing label** (ScoreCircle.tsx) - Added `role="img"` + `aria-label`.
6. **a11y: CategoryBar missing aria-expanded** (CategoryBar.tsx) - Added `aria-expanded` attribute.

## Previous Fixes (Pass 1-2)

1. Unescaped `'` in "Let's Encrypt" (guides/technical)
2. Unused variable `externalCount` removed (scanner.ts)
3. Custom 404, loading, error pages created
4. ScanForm input changed to `type="url"` with `aria-label`
5. FeedbackWidget textarea `aria-label` added
6. Feedback API JSON parse error handling

## SEO & Metadata

| Item | Status |
|------|--------|
| `<title>` | OK - "AEO Checker - AI検索対策チェッカー" |
| `<meta description>` | OK - Detailed Japanese description |
| Open Graph tags | OK (type, siteName, url, title, description, image) |
| Twitter Card | OK (summary_large_image) |
| `<html lang="ja">` | OK |
| `robots.txt` | OK - All AI crawlers allowed |
| `llms.txt` | OK - Service description with API docs |
| `/.well-known/agent.json` | OK - A2A Agent Card |
| `/sitemap.xml` | OK - Dynamic, all pages listed |
| favicon.ico | OK |
| OGP image | OK - Dynamic `/api/og` endpoint (Edge runtime) |
| JSON-LD | OK - WebApplication + FAQPage + HowTo |
| keywords | OK - 10 relevant keywords |
| canonical URL | OK |
| Guide page metadata | OK - All 7 guides have individual metadata |

## UI Review

| Area | Status |
|------|--------|
| Design System (black bg, emerald accent) | OK |
| Card styling (bg-white/5 border-white/10) | OK |
| Hover/transition effects | OK |
| Typography (16px+, 1.5-1.75 line-height) | OK |
| Responsive (md: breakpoints) | OK |
| Guide navigation | OK |
| Header/Footer | OK |
| FAQ expandable sections | OK |
| No emojis/icon illustrations | OK |

## Edge Cases

| Scenario | Status |
|----------|--------|
| Empty URL input | OK - Button disabled |
| Invalid URL | OK - Toast error |
| No http prefix | OK - Auto-prefixes https:// |
| Scan API failure | OK - Error toast |
| Result not found | OK - Fallback UI with re-scan prompt |
| Empty feedback | OK - Early return |
| Malformed JSON body | OK - Returns 400 |
| Fetch timeout | OK - 15s page, 10s auxiliary |

## Accessibility

| Item | Status |
|------|--------|
| Semantic HTML (header, main, nav, article) | OK |
| Form labels (aria-label) | OK |
| URL input type | OK |
| Color contrast (white on black) | OK |
| Score circle accessible label | OK |
| Category toggle aria-expanded | OK |
| Keyboard navigation | OK |
| Focus styles | OK |

## Checklist

- [x] `npm run build` 成功
- [x] `npm run lint` エラーなし
- [x] レスポンシブ対応
- [x] favicon 設定済み
- [x] OGP画像設定済み
- [x] 404ページ
- [x] ローディング状態
- [x] エラー状態

## Known Limitations (Not Bugs)

1. **In-memory storage** - Results lost on restart (MVP, planned Vercel KV migration)
2. **No rate limiting** - API endpoints have no rate limits (acceptable for MVP)
