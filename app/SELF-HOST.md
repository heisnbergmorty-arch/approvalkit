# Self-hosting checklist

Step-by-step for a designer who has never deployed a Next.js app.

## Prerequisites (one-time, ~10 min)

- [ ] Create a free [Vercel](https://vercel.com) account (sign in with GitHub)
- [ ] Create a free [Neon](https://neon.tech) Postgres database
- [ ] Create a free [Cloudflare](https://cloudflare.com) account → R2 bucket
- [ ] Create a free [Resend](https://resend.com) account, verify your domain
- [ ] (Optional) Buy a domain on Cloudflare (~$10/yr)

## Deploy (5 min)

1. Fork this repo on GitHub
2. In Vercel, click "New Project" → import your fork → root = `app/`
3. Set environment variables (copy from `app/.env.example`):
   - `DATABASE_URL` — from Neon dashboard → Connection string
   - `AUTH_SECRET` — run `openssl rand -hex 32` in any terminal
   - `AUTH_URL` — your Vercel URL (e.g. `https://my-approvalkit.vercel.app`)
   - `RESEND_API_KEY` — from Resend → API Keys
   - `EMAIL_FROM` — `ApprovalKit <noreply@yourdomain.com>`
   - `S3_ENDPOINT` — `https://<account-id>.r2.cloudflarestorage.com`
   - `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` — R2 → Manage API Tokens
   - `S3_BUCKET` — bucket name (e.g. `approvalkit`)
   - `S3_PUBLIC_URL` — public R2 URL (enable Public Access on bucket)
   - `CRON_SECRET` — `openssl rand -hex 32` (different from AUTH_SECRET)
   - `LICENSE_KEY` — from your Gumroad purchase email
4. Hit Deploy
5. After first deploy: in Vercel → Storage tab → run `pnpm db:push` via CLI:
   ```
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   cd app && npm install && npm run db:push
   ```

## Verify

- Open your Vercel URL → click "Sign in" → use your email
- Check inbox → click the magic link
- Set up your agency
- Create a test project
- Upload an image
- Open the review URL in incognito → confirm you can approve

If anything breaks, check `/api/health` first — it tells you if DB is reachable.

## Custom domain (optional, 5 min)

In Vercel → Project → Settings → Domains → add your domain. Cloudflare DNS:
add a CNAME pointing to `cname.vercel-dns.com`.

For per-agency custom domains (your clients see `review.theiragency.com`):
in your agency settings page, paste the host. Then in Vercel, add the same
host as a domain on your project. Vercel issues SSL automatically.

## Updating

```bash
cd app
git pull origin main
npm install
npm run db:push  # if schema changed
# Vercel auto-redeploys on push
```
