# Changelog

## 2026-03-12 (4th pass)

### Maintenance
- Health check: build OK, lint OK, 0 vulnerabilities, 0 TypeScript errors, 0 open issues
- AI public files (robots.txt, llms.txt, agent.json) verified present and correct
- All dependencies at latest patch/minor versions — no updates needed
- Full source code review: no security issues, no dead code, no TODOs
- **DNS Issue Detected**: `ai-url.ezoai.jp` A record points to Xserver (162.43.104.27) instead of Vercel (76.76.21.21) — SSL cert mismatch. Requires manual DNS fix on Xserver panel.

## 2026-03-12 (3rd pass)

### Maintenance
- Health check: build OK, 0 vulnerabilities, 0 TypeScript errors, 0 open issues
- AI public files (robots.txt, llms.txt, agent.json) verified present and correct
- Updated react 19.2.3→19.2.4, react-dom 19.2.3→19.2.4 (patch updates)

## 2026-03-12 (2nd pass)

### Maintenance
- Health check: build OK, 0 vulnerabilities, 0 TypeScript errors, 0 open issues
- AI public files (robots.txt, llms.txt, agent.json) verified present and correct
- Updated @types/node 20.19.35→20.19.37, eslint 9.39.3→9.39.4 (patch updates)

## 2026-03-12

### Security
- Patched express-rate-limit (IPv4-mapped IPv6 bypass vulnerability, high severity)
- Patched hono (prototype pollution via parseBody, moderate severity)

### Maintenance
- Ran full health check: build passes, no TypeScript errors, no open GitHub issues
- Verified AI public files (robots.txt, llms.txt, agent.json) are present and correct
- Redeployed to production
