# Changelog

## 2026-03-10

### Security
- Fixed 3 high severity vulnerabilities (hono, express-rate-limit) via npm audit fix

### Fixed
- Feedback widget now shows inline error message instead of browser `alert()`
- Feedback API checks GitHub response status and returns 502 on failure (was silently succeeding)
- MCP `tools/call` validates tool name existence and required parameters before execution

### Checked (No Issues)
- `npm run build` passes
- TypeScript compilation clean
- AI public files verified: `robots.txt`, `llms.txt`, `.well-known/agent.json`
- No open GitHub Issues
- All routes functional
