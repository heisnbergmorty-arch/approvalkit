import Link from "next/link";

const features = [
  {
    title: "One-click approvals",
    body: "Clients open a link and hit Approve. No login, no account, no Figma sign-up.",
  },
  {
    title: "Pixel-anchored comments",
    body: "Click anywhere on a mockup to pin feedback to the exact spot. No more 'the blue thing on the left.'",
  },
  {
    title: "Auto-nudges at 48h",
    body: "Silent client? ApprovalKit emails them on your behalf so you don't have to.",
  },
  {
    title: "Side-by-side versions",
    body: "Upload v2 next to v1. Clients see what changed without scrolling through 14 emails.",
  },
  {
    title: "Self-hosted, $0/month",
    body: "Runs on Vercel + Neon + Supabase free tiers. Your clients, your domain, your database.",
  },
  {
    title: "Lifetime license",
    body: "One payment. Modify, white-label, ship to your clients as part of agency packages.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          For design agencies &amp; freelancers
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Get design approvals in <span className="text-brand-600">1 day</span>, not 1 week.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          A branded review portal where clients approve work in one click or pin
          comments to the exact pixel. Stop chasing 47-email approval threads.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/review/W4gXxMfM3Nx7442C"
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-brand-600"
          >
            See live demo
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-500"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Demo project · approve or comment · no signup required
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          One-time payment. Lifetime updates.
        </h2>
        <div className="mt-10 inline-block rounded-2xl border border-brand-200 bg-white p-8 text-left shadow-sm">
          <div className="text-sm font-medium text-brand-600">Lifetime license</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900">$149</span>
            <span className="text-sm text-slate-500">one-time</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>✓ Full source code (Next.js 15 + Drizzle + Postgres)</li>
            <li>✓ Self-host on $0/month free tiers</li>
            <li>✓ Magic-link auth, file uploads, auto-nudges</li>
            <li>✓ MIT-style license — white-label, resell to clients</li>
            <li>✓ All future updates included</li>
          </ul>
          <a
            href="https://gumroad.com/l/approvalkit"
            className="mt-6 block rounded-lg bg-brand-500 px-5 py-3 text-center font-medium text-white hover:bg-brand-600"
          >
            Buy on Gumroad →
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        Built for agency owners tired of approval ping-pong.
      </footer>
    </main>
  );
}
