# Changelog

## 2026-03-10
### Security
- Patched 3 high-severity vulnerabilities via `npm audit fix`
  - express-rate-limit: IPv4-mapped IPv6 addresses bypass per-client rate limiting
  - hono: cookie attribute injection, SSE control field injection, arbitrary file access

### Maintenance
- Build: OK
- TypeScript: No errors
- AI public files (robots.txt, llms.txt, agent.json): All present and valid
- GitHub Issues: None open
- Deployed to production: https://ai-resbattle.ezoai.jp
