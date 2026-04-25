# Changelog

## v0.3.0 — Polish & Distribution (Day 8–14)

**Added**
- Pixel-anchored comments on the client review portal
- Custom domain routing (`review.yourstudio.com` → branded `/portal/[host]`)
- Outbound webhooks (Slack, Zapier, n8n) on approve + comment
- Daily digest emails (one summary instead of per-event blasts)
- Asset version comparison page (`/dashboard/projects/[id]/compare/[group]`)
- Project archive + delete flow
- Asset delete with R2/S3 cleanup
- Settings page (custom domain, webhook URL)
- Public roadmap page
- Privacy + Terms pages
- Health check endpoint (`/api/health`)
- Custom 404 + error pages
- OG image generator
- Figma plugin scaffold (`figma-plugin/`)
- Vitest test suite (ids, email templates)
- GitHub Action cron alternative

## v0.2.0 — Core Product (Day 1–7)

**Added**
- Auth (magic link via Resend)
- Agency setup flow
- Project create + dashboard
- Asset upload to R2/S3 (presigned URLs)
- Client review portal (no login required)
- Approve / comment server actions
- Email notifications (review link, approved, comment)
- 48h reminder cron
- Gumroad license verification proxy
- Seed script with demo data
- Deploy docs + Dockerfile

## v0.1.0 — Foundation

**Added**
- Marketing landing page
- Next.js 15 + TypeScript scaffold
- Drizzle + Postgres schema (5 domain tables + Auth.js)
- Tailwind CSS + brand color system
