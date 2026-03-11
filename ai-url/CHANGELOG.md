# Changelog

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
