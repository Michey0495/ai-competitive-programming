# Changelog

## 2026-03-17

### Fix
- Corrected fallback `siteUrl` from `ai.ezoai.jp` to `ai-marshmallow.ezoai.jp` in `layout.tsx` and `q/[id]/page.tsx`
- Fixed share text domain in Q&A detail page
- Resolved 4 high-severity npm vulnerabilities (`hono`, `flatted`, `express-rate-limit`, `@hono/node-server`) via `npm audit fix`

### Maintenance
- Build: OK (Next.js 16.1.6)
- TypeScript: No errors
- Vulnerabilities: 0 (all resolved)
- AI public files: All present and valid (`robots.txt`, `llms.txt`, `.well-known/agent.json`)
- GitHub Issues: None open
