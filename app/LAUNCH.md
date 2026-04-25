# Launch Posts — copy/paste templates

> Tone: builder-in-public, specific, no hype. Lead with the pain, never the tech.

---

## 1. Reddit — r/web_design / r/freelance / r/graphic_design

**Title:** I built a tool to kill the design approval email chain. Looking for 5 agencies to test it free.

**Body:**

I freelance / run a small studio. Last month I counted 47 emails on a single
project just to get sign-off on a logo. Half the feedback was "the orange
needs to be more red" with no indication of *which* orange.

I built **ApprovalKit** for myself: clients open one link (no login, no
account), see all the work, click ✓ Approve, or pin a comment to the exact
spot they're talking about. No more "see attached v7-final-FINAL-v2.pdf."

How it works:
- Upload mocks → app generates a branded review link
- Client opens link, approves or comments
- You get email/Slack the moment they act
- 48h auto-nudge if they go silent
- Self-host (it's $0/month on Vercel + Neon + R2)

I'm looking for **5 design agencies** to install it free in exchange for a
testimonial + brutal feedback. Comment "in" if you're interested or DM me.

(Not selling anything yet — just want to know if it solves a real pain for
people who aren't me.)

---

## 2. Indie Hackers — Milestone post

**Title:** Day 30 — I built and shipped ApprovalKit on $0 budget. Here's what worked and what flopped.

**Body:**

30 days ago I had:
- $0 cash
- A pile of LLM API credits expiring soon
- A specific pain (design approvals taking 1-2 weeks)

I shipped ApprovalKit: a self-hosted review portal for design agencies.

**What worked:**
- Picking ONE buyer (small design agencies, 1-5 people) and ONE pain (the
  approval cycle). I almost shipped a generic "agency portal" — the LLM I
  brainstormed with rated it 3/10 because ManyRequests + SuperOkay already
  own that space. Narrowing the wedge was everything.
- Lifetime pricing on Gumroad ($149) instead of MRR. Lower friction, easier
  to write about, feels more like indie shareware than yet-another-SaaS.
- Distribution = writing only. As an introvert no Twitter shouting, no
  cold calling. Reddit + IH + 30 cold emails to studios I admire.

**What flopped:**
- First landing page led with "AI-powered." Tested it on 5 designers — every
  single one of them squinted. Rewrote it as "Get design approvals in 1 day,
  not 1 week" and replies tripled.
- I tried building a "boilerplate" first. Killed it after one day — the
  market is flooded with free Next.js + Auth.js starters. There's no wedge.

**Numbers (Day 1–30):**
- Landing page visitors: ___
- Waitlist signups: ___
- Free installs: ___
- Paid: ___ × $149 = $___

Repo + landing: <link>

Happy to answer anything.

---

## 3. Twitter / X — Thread (5 tweets)

**Tweet 1**
I counted the emails on my last freelance design project.

47 messages. 11 days. To approve a logo.

So I built ApprovalKit ↓

**Tweet 2**
Clients open ONE link. No login. No "create account." 

They see the work, click ✓ Approve, or pin a comment to the exact pixel
they're talking about.

[screenshot of pinned comments on a logo]

**Tweet 3**
The thing I underestimated: 80% of approval delay isn't indecision. It's
that nobody knows what to do.

Open inbox → "see attached v7-final.pdf" → wait, do I reply-all? Forward
to my partner? Where's v6?

ApprovalKit removes that decision. There's one button. It's green.

**Tweet 4**
Tech, for the curious:
- Next.js 15 + Drizzle + Neon Postgres
- R2 for files (10GB free, no egress)
- Resend for email
- $0/mo to run for the first ~50 projects
- Self-hostable, MIT-style license + paid Pro

**Tweet 5**
Opening it up to 5 design agencies for free in exchange for a testimonial.

Reply or DM if you want one.

(Or just bookmark and rage-DM me when your client says "make the logo bigger"
for the third time today.)

[link to landing]

---

## 4. Cold Email — to design agencies

**Subject:** quick question about your approval process

Hi [name],

Saw your work on [specific project — e.g. "the rebrand for Northstar"] —
loved the type system on the secondary lockup.

Quick question: what does your client review process look like? Email
attachments? Figma comments? Loom recordings?

I built a tool that lets clients approve work with one click + pin
comments to the exact pixel they're talking about. No login required.

I'd love to set it up free for you for one project, in exchange for 15
min of brutal feedback when you're done. No catch — I'm trying to figure
out if it's actually useful or just useful for me.

Worth a 5-min look?

[name]
[link]

---

## 5. Product Hunt launch

**Tagline:** Get design approvals in 1 day, not 1 week.

**Description (260 chars):**
Branded review portal for design agencies. Clients click one link (no login),
approve or pin pixel-anchored comments. Auto-nudges them at 48h. Self-host on
$0/month or run hosted. Built by a freelancer tired of 47-email approval threads.

**First comment (founder reply):**

Hey PH! 👋

I freelance and built this after counting the emails on my last project: 47
to approve a single logo.

ApprovalKit gives every project a branded URL. Clients see the work, click
Approve or pin a comment exactly where they want changes. You get notified
the moment they do.

**Why it might be different from [ManyRequests / SuperOkay]:**
- They're full agency CRMs. ApprovalKit does ONE thing — kill the approval
  loop — and does it well.
- Self-hostable, $149 lifetime instead of $99/mo recurring.
- Pixel-anchored comments (most "review tools" still make you write
  paragraph descriptions).

Free for the first 5 PH agencies that DM me — I'll personally migrate your
next project onto it.

Roadmap: client-side video review (record their feedback), auto-summarize
threads with AI, and a Figma plugin to push frames straight in.

Thanks for taking a look 🙏
