# 30-Day Sprint — ApprovalKit Launch Tracker

> **Goal:** Ship a paid v1 of ApprovalKit on Gumroad and land first 5 buyers.
> **Constraint:** $0 cash. Solo, introvert. Distribution via written posts only.

---

## Week 1 — Foundation (Day 1–7)

- [x] Lock product: **ApprovalKit** for design agencies
- [x] Landing page deployed (site/index.html)
- [x] Next.js 15 + Drizzle + Auth.js scaffold
- [x] Schema: agencies / projects / assets / comments / approvals
- [x] Magic-link login
- [x] Dashboard (projects list)
- [x] Create project + setup agency
- [x] Asset upload to S3/R2
- [x] Client review portal (approve / comment, no login)
- [x] Email notifications (review link, approved, comment)
- [x] Cron reminders (48h pending nudge)
- [x] Gumroad license verification
- [x] Seed script with demo data
- [ ] First end-to-end test (local)
- [ ] Deploy demo to demo.approvalkit.com

## Week 2 — Polish (Day 8–14)

- [x] Pixel-anchored comments (click image → pin)
- [x] PDF preview (`<embed>` for application/pdf)
- [x] Custom-domain support (middleware + `/portal/[host]`)
- [x] Outbound webhooks (Slack/Zapier on approve + comment)
- [x] Settings page (custom domain + webhook URL)
- [x] Dockerfile (standalone Next.js build)
- [x] OG image generator (`opengraph-image.tsx`)
- [x] GitHub Action cron (alternative to Vercel Cron)
- [x] LAUNCH.md — 5 launch post templates
- [x] Asset version comparison page
- [x] Email digest mode (one daily summary)
- [x] Project archive + delete
- [x] Asset delete with R2 cleanup
- [x] Public roadmap page
- [x] Privacy + Terms pages
- [x] Health check endpoint
- [x] Custom 404 + error pages
- [x] Sitemap + robots.txt
- [x] Dashboard stats (pending / approvals / comments)
- [x] Vitest test suite
- [x] Cloud waitlist API
- [x] Figma plugin scaffold
- [x] CONTRIBUTING + CHANGELOG + SELF-HOST docs
- [ ] First 3 screenshots for landing page (see site/SCREENSHOTS.md)
- [ ] Record 90s demo video (Loom)
- [ ] Set up Gumroad product ($149 + $299)

## Week 3 — Distribution (Day 15–21)

- [ ] Write launch post: "I built a tool to kill the design approval email chain"
- [ ] Post on r/web_design (text only, no link)
- [ ] Post on r/freelance
- [ ] Indie Hackers post
- [ ] Twitter thread (5 tweets, before/after screenshots)
- [ ] Submit to BetaList
- [ ] DM 20 freelance designers I follow → ask for feedback (NOT pitch)
- [ ] Cold email 30 small design agencies → free install in exchange for testimonial

## Week 4 — Sales (Day 22–30)

- [ ] Open Gumroad checkout publicly
- [ ] Hunt on Product Hunt (Tuesday launch)
- [ ] Convert 5 testers → first 5 buyers
- [ ] Write follow-up post: "30 days, $X revenue, here's what I learned"
- [ ] Capture every objection + email → use for v1.1 roadmap

---

## Daily metrics to track (in a spreadsheet)

- Landing page visitors
- Waitlist signups
- Demo installs
- Conversations started
- Buyers
- MRR

## Definition of done for v1

- [ ] One real agency uses it for a real client project, end-to-end
- [ ] First $149 sale on Gumroad
- [ ] Public roadmap with 5 voted-up requests
