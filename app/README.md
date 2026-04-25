# ApprovalKit

A self-hosted, white-label review portal for design agencies. Get design approvals in 1 day, not 1 week.

> Built once. Pay once. Own forever.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Auth.js v5** (magic-link via Resend, no passwords)
- **Drizzle ORM** + **Postgres** (Neon, Supabase, Railway, or self-hosted)
- **Tailwind CSS** with per-agency CSS-variable theming
- **S3-compatible storage** for asset files (Cloudflare R2 recommended for cost)
- **Resend** for transactional email

## What's in Session 1 (this commit)

- ✅ Project scaffold + Tailwind + TypeScript
- ✅ Drizzle schema for `agencies`, `projects`, `assets`, `comments`, `approvals` + Auth.js tables
- ✅ Magic-link auth flow (`/login` → email → `/dashboard`)
- ✅ Empty agency dashboard with project list
- ✅ Public client review page (`/review/[slug]`) with branded header
- ✅ Theming wired to per-agency `brandColor` via CSS variables

## What's coming

- Session 2: agency setup wizard + create-project flow + file upload
- Session 3: client-side approve / request-changes / pixel-anchored comments
- Session 4: email notifications (you uploaded work / client approved / client commented)
- Session 5: multi-version history + auto-reminder emails
- Session 6: Stripe checkout for self-hosted licensing
- Session 7: deployment guides (Vercel, Cloudflare Workers, Docker)
- Session 8: polish + landing-page integration + demo data seed
- Session 9: docs site (built with the same stack)
- Session 10: launch posts (HN / Indie Hackers / r/agency / Twitter)

## Quick start (when you're ready to run it)

```bash
cd app
npm install
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, RESEND_API_KEY
npm run db:generate
npm run db:migrate
npm run dev
# → http://localhost:3000
```

## Free-tier infra (so you can run it on $0)

- **DB:** Neon free tier (500MB, plenty)
- **Hosting:** Vercel free tier or Cloudflare Pages
- **Storage:** Cloudflare R2 (10GB free, no egress fees) — recommended
- **Email:** Resend free tier (3K/mo, 100/day)

Total ongoing cost to run a self-hosted ApprovalKit: **$0/month** until you outgrow free tiers.

## License (for the eventual product sale)

When packaged for Gumroad sale, each license = one agency, unlimited internal projects/clients. No reselling the source code.
