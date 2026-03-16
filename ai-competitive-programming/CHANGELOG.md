# Changelog

## 2026-03-17

### Security
- Fixed 2 vulnerabilities: high-severity DoS in flatted (<3.4.0), moderate prototype pollution in hono (<4.12.7) via npm audit fix

### Checked (No Issues)
- `npm run build` passes (TypeScript clean, 0 errors)
- ESLint: 0 warnings, 0 errors
- AI public files verified: `robots.txt`, `llms.txt`, `.well-known/agent.json`
- No open GitHub Issues
- All 14 routes functional
- Design system compliant (pure black bg, cyan accents, no emojis/icons)
- All dependencies stable and properly used

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
