# Deploying ApprovalKit

ApprovalKit ships as a single Next.js 15 app + Postgres + S3-compatible storage.
The cheapest stable stack costs **$0/mo** at low volume.

## Recommended free stack

| Piece          | Provider           | Free tier               |
| -------------- | ------------------ | ----------------------- |
| Hosting        | Vercel Hobby       | 100 GB bandwidth/mo     |
| Postgres       | Neon Free          | 0.5 GB storage          |
| File storage   | Cloudflare R2      | 10 GB + 0 egress fees   |
| Email          | Resend Free        | 100 emails/day          |
| Cron           | Vercel Cron        | included                |
| Domain         | Cloudflare         | $10/yr (.com)           |

## 5-minute deploy

```bash
# 1. Clone & install
git clone <your-fork> approvalkit && cd approvalkit/app
pnpm install

# 2. Configure
cp .env.example .env.local
# fill in: DATABASE_URL, AUTH_SECRET, RESEND_API_KEY, S3_*

# 3. Push schema
pnpm drizzle-kit push

# 4. Seed demo data (optional)
pnpm tsx scripts/seed.ts

# 5. Run
pnpm dev
```

## Production checklist

- [ ] `AUTH_URL` points to your live domain (e.g. `https://app.acme.com`)
- [ ] `AUTH_SECRET` is a random 32-byte hex string (`openssl rand -hex 32`)
- [ ] `S3_PUBLIC_URL` matches your R2 public bucket URL
- [ ] Verify a sender domain in Resend before going live (or emails go to spam)
- [ ] Add `CRON_SECRET` and pass it as `Authorization: Bearer …` header
- [ ] Set `LICENSE_KEY` from your Gumroad purchase email
- [ ] Custom domain pointed at Vercel via CNAME

## Custom domain per agency (optional)

Set `customDomain` on the agencies table. Add the domain to your Vercel project,
then point the DNS at Vercel. The `host` header is read in middleware to route
clients to their branded portal.

## Self-host (no Vercel)

Any Node 18+ host works:

```bash
pnpm build
pnpm start  # listens on PORT
```

For Docker, see `Dockerfile` (coming in v1.1).
