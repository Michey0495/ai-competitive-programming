# Changelog

## 2026-03-12

### Security
- Patched express-rate-limit (IPv4-mapped IPv6 bypass vulnerability, high severity)
- Patched hono (prototype pollution via parseBody, moderate severity)

### Maintenance
- Ran full health check: build passes, no TypeScript errors, no open GitHub issues
- Verified AI public files (robots.txt, llms.txt, agent.json) are present and correct
- Redeployed to production
