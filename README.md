# ApprovalKit

> **Get design approvals in 1 day, not 1 week.**

A branded review portal you self-host or sell to design agencies. Clients
see their work, approve or comment in one click — no logins, no Slack DMs,
no 12-message email chains.

## Repo layout

```
.
├── site/   ← marketing landing page (static HTML)
└── app/    ← the product (Next.js 15 + Postgres + R2)
```

## Quick start

```bash
cd app
pnpm install
cp .env.example .env.local   # fill in DATABASE_URL etc
pnpm db:push
pnpm db:seed                 # optional demo data
pnpm dev
```

Open <http://localhost:3000>.

See [app/DEPLOY.md](app/DEPLOY.md) for production deployment and
[app/SPRINT.md](app/SPRINT.md) for the 30-day launch plan.

## License

Commercial. See [app/LICENSE.md](app/LICENSE.md).
