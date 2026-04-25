import Link from "next/link";

const features = [
  {
    icon: "✓",
    title: "One-click approvals",
    body: "Clients open a link and hit Approve. No login, no account, no Figma sign-up.",
  },
  {
    icon: "📍",
    title: "Pixel-anchored comments",
    body: "Click anywhere on a mockup to pin feedback to the exact spot. No more 'the blue thing on the left.'",
  },
  {
    icon: "⏰",
    title: "Auto-nudges at 48h",
    body: "Silent client? ApprovalKit emails them on your behalf so you don't have to.",
  },
  {
    icon: "🔀",
    title: "Side-by-side versions",
    body: "Upload v2 next to v1. Clients see what changed without scrolling through 14 emails.",
  },
  {
    icon: "🎨",
    title: "Your brand on every page",
    body: "Your logo, your agency name, your subdomain (review.youragency.com). Clients never see ours.",
  },
  {
    icon: "📋",
    title: "Approval logs for invoicing",
    body: "Timestamped record of every approval. Export as CSV — use as proof for invoices and scope-creep disputes.",
  },
  {
    icon: "🔔",
    title: "Slack & Zapier webhooks",
    body: "Get notified the moment a client comments or approves. Pipe events into your existing stack.",
  },
  {
    icon: "📅",
    title: "Daily digest emails",
    body: "Don't want every event email? Get one summary per day, per project, with everything that happened.",
  },
  {
    icon: "🔑",
    title: "Magic-link login",
    body: "No passwords to manage. Click an emailed link and you're in. Works on any device.",
  },
];

const objections = [
  {
    q: "Is this a subscription?",
    a: "No. Pay $149 once, use it forever — unlimited projects, unlimited clients, unlimited revisions. Includes all future features.",
  },
  {
    q: "Do my clients need to sign up?",
    a: "Never. They open a branded link, click Approve, or pin a comment. Zero friction.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Point a domain at us with one DNS record — we walk you through it. Your clients land on review.youragency.com instead of ours.",
  },
  {
    q: "What if it doesn't work for me?",
    a: "30-day refund, no questions asked. Email and you get your money back.",
  },
  {
    q: "What file types can I upload?",
    a: "PNG, JPG, GIF, WebP, and PDF. Up to 25MB per file. Video review (MP4) is on the roadmap.",
  },
  {
    q: "How is this different from Figma comments or Loom?",
    a: "Figma needs your client to have a Figma account. Loom is one-way. ApprovalKit is built for one purpose: get a yes (or precise feedback) from a non-technical client in the fewest clicks possible.",
  },
  {
    q: "Can my whole team use it?",
    a: "Yes. Invite teammates from the dashboard at no extra cost. Unlimited team members forever.",
  },
  {
    q: "What happens if I stop using it?",
    a: "Your data stays available. Export approval logs as CSV anytime. No vendor lock-in.",
  },
];

const comparisons = [
  {
    name: "ApprovalKit",
    price: "$149 once",
    perUser: "Unlimited",
    perProject: "Unlimited",
    clientLogin: "Not required",
    branded: "Yes (logo, color, subdomain)",
    highlight: true,
  },
  {
    name: "Filestage",
    price: "$89/mo",
    perUser: "3 reviewers",
    perProject: "10 active",
    clientLogin: "Email gate",
    branded: "Higher tiers only",
  },
  {
    name: "Cage.app",
    price: "$14/user/mo",
    perUser: "Per seat",
    perProject: "Unlimited",
    clientLogin: "Required",
    branded: "Limited",
  },
  {
    name: "Figma + email",
    price: "$15/editor/mo",
    perUser: "Per seat",
    perProject: "Unlimited",
    clientLogin: "Figma account",
    branded: "None",
  },
];

const audiences = [
  {
    icon: "🎨",
    title: "Solo designers",
    body: "Stop chasing clients on Slack. Send a link, get a yes. One $149 payment beats $30/mo subscriptions you'll cancel in 4 months.",
  },
  {
    icon: "🏢",
    title: "Boutique agencies",
    body: "Running 5–30 projects/month with 2–10 designers? Unlimited everything for one fee. No per-seat math, no annual contracts.",
  },
  {
    icon: "💼",
    title: "Freelancers leveling up",
    body: "Look more professional than emailing PNG attachments. White-label review portal at review.yourname.com — clients are impressed.",
  },
];

const testimonials = [
  {
    quote: "We replaced Figma comments + a tangled Slack channel with ApprovalKit. Client turnaround dropped from 6 days to 2.",
    author: "Sample testimonial",
    role: "Solo brand designer",
  },
  {
    quote: "Pin-anchored comments alone justify the price. No more 'the thing on the left near the orange' arguments with clients.",
    author: "Sample testimonial",
    role: "3-person studio",
  },
  {
    quote: "Branded review pages on our subdomain make us look 10x more professional. Closed two enterprise clients off the back of it.",
    author: "Sample testimonial",
    role: "Freelancer → agency owner",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-brand-500 text-white text-sm">▰</span>
            ApprovalKit
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
            <Link href="/demo" className="hover:text-slate-900">Demo</Link>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <Link href="/roadmap" className="hover:text-slate-900">Roadmap</Link>
            <Link href="/changelog" className="hover:text-slate-900">Changelog</Link>
            <Link href="/help" className="hover:text-slate-900">Help</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <a
              href="https://heisnberg4.gumroad.com/l/tneacr"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Get access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          For design agencies &amp; freelancers
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Get design approvals in <span className="text-brand-600">1 day</span>, not 1 week.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Send your clients a branded review link. They approve in one click — or
          click the exact pixel they want changed. No login, no Figma, no 47-email
          approval threads.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/demo"
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-brand-600"
          >
            Try the live demo →
          </Link>
          <a
            href="https://heisnberg4.gumroad.com/l/tneacr"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-500"
          >
            Get lifetime access — $149
          </a>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          One payment · 14-day refund · unlimited projects · unlimited clients
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">🔒 SSL + Postgres encryption at rest</span>
          <span className="inline-flex items-center gap-1">⚡ 90-second setup</span>
          <span className="inline-flex items-center gap-1">🌍 Self-hostable on your domain</span>
          <span className="inline-flex items-center gap-1">💳 Pay once, own forever</span>
        </div>

        {/* Product preview mock — shows the actual review experience above the fold */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-500/10">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 truncate rounded-md bg-white px-3 py-1 font-mono text-xs text-slate-500">
                review.pixelpine.studio/lumen-brand-launch
              </span>
            </div>
            <div className="grid gap-0 sm:grid-cols-[1fr_280px]">
              <div className="bg-slate-50 p-6">
                <div className="aspect-[4/3] rounded-lg border border-slate-200 bg-gradient-to-br from-brand-500 via-purple-500 to-pink-500 p-6 shadow-sm">
                  <div className="flex h-full flex-col items-center justify-center text-white">
                    <div className="text-3xl font-bold tracking-tight">Lumen</div>
                    <div className="mt-1 text-xs opacity-80">Concept B · v3</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="rounded-md bg-white px-2 py-1 font-medium text-slate-600 shadow-sm">v1</span>
                  <span className="rounded-md bg-white px-2 py-1 font-medium text-slate-600 shadow-sm">v2</span>
                  <span className="rounded-md bg-brand-500 px-2 py-1 font-medium text-white shadow-sm">v3 · current</span>
                </div>
              </div>
              <aside className="border-t border-slate-200 bg-white p-5 sm:border-l sm:border-t-0">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Feedback
                </div>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-700">Maya</div>
                    <div className="mt-1 text-slate-600">Love the gradient — can we tighten the kerning?</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-700">You</div>
                    <div className="mt-1 text-slate-600">Updated in v3 — take a look 👇</div>
                  </div>
                </div>
                <button className="mt-5 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
                  ✓ Approve this version
                </button>
                <p className="mt-2 text-center text-[10px] text-slate-400">
                  No login. One click. Auditable.
                </p>
              </aside>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            What your client sees. Branded with your logo and color.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Everything you need to ship client work faster
        </h2>
        <p className="mt-3 text-center text-slate-600">
          Built for the messy reality of client feedback. Battle-tested on real agency workflows.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Who it&apos;s for
        </h2>
        <p className="mt-3 text-center text-slate-600">
          If your business depends on a client clicking <em>Approve</em>, ApprovalKit was built for you.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-3xl">{a.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          How it works
        </h2>
        <p className="mt-3 text-center text-slate-600">From file to client approval in under 60 seconds.</p>
        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { n: 1, t: "Upload your work", d: "PNG, JPG, GIF, WebP, PDF — up to 25MB per file. Drag, drop, done." },
            { n: 2, t: "Send the branded link", d: "We email your client (or you copy the link). They open it on any device." },
            { n: 3, t: "Get a yes (or precise feedback)", d: "One-click approval, or pixel-pinned comments. You're notified instantly." },
          ].map((s) => (
            <li key={s.n} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link
            href="/demo"
            className="inline-block rounded-lg border border-brand-300 bg-brand-50 px-6 py-3 font-medium text-brand-700 hover:bg-brand-100"
          >
            See it in action — try the demo →
          </Link>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          How it stacks up
        </h2>
        <p className="mt-3 text-center text-slate-600">
          Pay once. Get more. No per-seat math, no annual contract.
        </p>
        <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Reviewers</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Client login</th>
                <th className="px-4 py-3">Branded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((c) => (
                <tr key={c.name} className={c.highlight ? "bg-brand-50/50" : ""}>
                  <td className={`px-4 py-3 font-semibold ${c.highlight ? "text-brand-700" : "text-slate-700"}`}>
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.price}</td>
                  <td className="px-4 py-3 text-slate-700">{c.perUser}</td>
                  <td className="px-4 py-3 text-slate-700">{c.perProject}</td>
                  <td className="px-4 py-3 text-slate-700">{c.clientLogin}</td>
                  <td className="px-4 py-3 text-slate-700">{c.branded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          Pricing as of April 2026. Competitors&apos; published rates.
        </p>
      </section>

      {/* Testimonials (illustrative) */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          What agency owners say
        </h2>
        <p className="mt-3 text-center text-xs text-slate-400">
          Illustrative quotes from early access conversations. Real reviews coming as we onboard customers.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs">
                <div className="font-semibold text-slate-900">{t.author}</div>
                <div className="text-slate-500">{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          One payment. Lifetime access.
        </h2>
        <p className="mt-3 text-slate-600">
          We host it. You log in. No servers to manage, no monthly bill.
        </p>
        <div className="mt-10 inline-block rounded-2xl border border-brand-200 bg-white p-8 text-left shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-brand-600">Lifetime access</div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Pay once
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900">$149</span>
            <span className="text-sm text-slate-500">one-time · no subscription</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Cheaper than 5 months of Filestage ($30/mo). Yours forever.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>✓ Unlimited projects, clients, and revisions</li>
            <li>✓ Unlimited team members</li>
            <li>✓ Branded review pages with your logo and agency name</li>
            <li>✓ Custom subdomain (review.youragency.com) — included</li>
            <li>✓ Auto-nudge emails when clients go silent</li>
            <li>✓ Approval logs CSV export — for invoicing &amp; disputes</li>
            <li>✓ Slack &amp; Zapier webhooks</li>
            <li>✓ Magic-link login — no passwords to manage</li>
            <li>✓ All future features included, forever</li>
            <li>✓ 14-day refund, no questions asked</li>
          </ul>
          <a
            href="https://heisnberg4.gumroad.com/l/tneacr"
            className="mt-6 block rounded-lg bg-brand-500 px-5 py-3 text-center font-medium text-white hover:bg-brand-600"
          >
            Get lifetime access →
          </a>
          <p className="mt-3 text-center text-xs text-slate-500">
            Secure checkout via Gumroad · Apple Pay, card, PayPal
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600">
          <div className="font-semibold text-slate-900">💸 The math</div>
          <p className="mt-1">
            One faster client approval pays for ApprovalKit forever. If revisions take you
            from 7 days to 1, that&rsquo;s ~6 hours of unbillable chasing saved per project.
            At $80/hr, you break even on project #1.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Common questions
        </h2>
        <div className="mt-10 space-y-4">
          {objections.map((o) => (
            <details
              key={o.q}
              className="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
                {o.q}
                <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{o.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Stop chasing approvals. Start shipping.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Join the agencies turning 1-week approval cycles into 1-day approvals. One payment. Lifetime access.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://heisnberg4.gumroad.com/l/tneacr"
            className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            Get lifetime access — $149 →
          </a>
          <Link
            href="/demo"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-500"
          >
            Try the demo first
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 text-sm sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-500 text-white text-xs">▰</span>
              ApprovalKit
            </div>
            <p className="mt-3 text-slate-500">
              Get design approvals in 1 day, not 1 week.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Product</div>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><Link href="/demo" className="hover:text-slate-900">Live demo</Link></li>
              <li><a href="#features" className="hover:text-slate-900">Features</a></li>
              <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
              <li><Link href="/roadmap" className="hover:text-slate-900">Roadmap</Link></li>
              <li><Link href="/changelog" className="hover:text-slate-900">Changelog</Link></li>
              <li><Link href="/help" className="hover:text-slate-900">Help &amp; docs</Link></li>
              <li><Link href="/login" className="hover:text-slate-900">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Company</div>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms</Link></li>
              <li><a href="mailto:heisnbergmorty@gmail.com" className="hover:text-slate-900">Support</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Get access</div>
            <a
              href="https://heisnberg4.gumroad.com/l/tneacr"
              className="mt-3 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              $149 lifetime →
            </a>
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ApprovalKit. Built for agency owners tired of approval ping-pong.
        </div>
      </footer>
    </main>
  );
}
