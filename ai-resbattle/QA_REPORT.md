# QA Report - AIレスバトル

**Date:** 2026-03-01
**QA Engineer:** Claude (automated)
**Branch:** master

---

## チェックリスト結果

| 項目 | 結果 |
|------|------|
| `npm run build` 成功 | ✅ |
| `npm run lint` エラーなし | ✅ |
| レスポンシブ対応（モバイル・デスクトップ） | ✅ |
| favicon, OGP設定 | ✅ |
| 404ページ | ✅ |
| ローディング状態の表示 | ✅ |
| エラー状態の表示 | ✅ |

---

## 発見した問題と対応状況

### 🔴 Critical (修正済み)

#### 1. APIルートに try/catch なし
- **ファイル:** `src/app/api/battle/route.ts`
- **問題:** `generateBattle()` / `saveBattle()` が例外を投げた場合、レスポンスが JSON でなくなり、クライアント側の `res.json()` が二重エラーを起こす
- **修正:** `try/catch` を追加し、エラー時に適切な JSON エラーレスポンス（500）を返すよう修正

#### 2. AI レスポンスの JSON パースに try/catch なし
- **ファイル:** `src/lib/ai.ts`
- **問題:** `JSON.parse()` が失敗した場合（AI が不正形式で返答した場合）、未処理例外として上位に伝播する
- **修正:** `try/catch` を追加し、パース失敗時は意味のあるエラーメッセージをスローするよう修正

---

### 🟡 Medium (修正済み)

#### 3. フィードバックウィジェットのダークモード非対応
- **ファイル:** `src/components/feedback-widget.tsx`
- **問題:** `bg-white`, `text-gray-800`, `border-gray-200`, `bg-gray-100` など固定カラーを使用しており、ダークモード時に背景・文字が読めない
- **修正:** Tailwind CSS テーマ変数（`bg-background`, `text-foreground`, `border-border`, `bg-muted` 等）に置き換え

---

### 🟢 Low (修正済み)

#### 4. About ページのモデル名が不正確
- **ファイル:** `src/app/about/page.tsx`
- **問題:** `claude-haiku-4-5` と表示していたが実際は `claude-haiku-4-5-20251001`
- **修正:** `Claude Haiku 4.5` と表示するよう変更（エンドユーザー向けに読みやすく）

#### 5. ScoreBar のプログレスバーに ARIA ラベルなし
- **ファイル:** `src/components/score-bar.tsx`
- **問題:** 視覚的なバーグラフにスクリーンリーダー向けの説明がない
- **修正:** `role="img"` + `aria-label` を追加（例: "味・品質: 75点 vs 60点"）

#### 6. フォーム内の装飾アイコンに aria-hidden なし
- **ファイル:** `src/components/battle-form.tsx`
- **問題:** 装飾用の `<Swords>` アイコンがスクリーンリーダーに読まれる可能性がある
- **修正:** `aria-hidden="true"` を追加

---

## SEO / OGP 確認

| 項目 | 状態 |
|------|------|
| `<html lang="ja">` | ✅ |
| title テンプレート (`%s \| AIレスバトル`) | ✅ |
| description メタタグ | ✅ |
| OGP `og:title`, `og:description` | ✅ |
| OGP 画像 (`/api/og/[id]`) - 1200x630 | ✅ |
| Twitter Card `summary_large_image` | ✅ |
| `robots.txt` (API を disallow) | ✅ |
| `sitemap.xml` (/, /history, /about) | ✅ |
| バトル個別ページの動的メタデータ | ✅ |

---

## パフォーマンス確認

- Server Components をデフォルト使用、`"use client"` は必要な箇所のみ（BattleForm, ShareButtons, FeedbackWidget）
- 不要な re-render なし（useState の更新は適切にスコープされている）
- AI 処理は Server-side で実行（クライアントに API キー漏洩なし）
- KV (Vercel KV) による履歴キャッシュで DB 負荷軽減
- Edge Runtime を OGP 生成に使用（高速配信）

---

## エッジケース確認

| ケース | 挙動 |
|--------|------|
| 空入力でフォーム送信 | ボタン disabled のため送信不可 ✅ |
| 50文字超入力 | `maxLength={50}` で入力制限 + API でも検証 ✅ |
| 同一レストラン名 | AI が判定（機能的には問題なし）✅ |
| 存在しない battle ID | `notFound()` で 404 ページへ ✅ |
| AI API 失敗 | エラーメッセージをフォームに表示（修正済み）✅ |
| KV 履歴が空 | 「まだバトルがありません」と表示 ✅ |

---

## 残課題（今後の改善候補）

- `copyLink` での `alert()` → Toast 通知へ改善（UX向上）
- OGP 画像の日本語フォント埋め込み（現在は sans-serif フォールバック）
- バトル履歴ページへのページネーション（現在は最大20件）
- バトルフォームのレート制限（同一 IP からの過剰リクエスト対策）
