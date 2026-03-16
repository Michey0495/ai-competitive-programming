# Changelog

## 2026-03-17

### Fixed
- 2 npm audit vulnerabilities patched (flatted DoS, hono prototype pollution)
- Feed API pagination: now correctly fetches limit+1 items to detect next page
- LikeButton: liked state now shows "OK" instead of duplicate "+"

### Removed
- Unused `ApiKeyInput` component (dead code, never imported)

### Verified
- `npm run build` passes
- All AI public files present and valid (robots.txt, llms.txt, agent.json)
- No open GitHub Issues
- Deployed to production: https://ai-interview.ezoai.jp
