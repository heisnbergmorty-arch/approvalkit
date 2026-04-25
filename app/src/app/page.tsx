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
    title: "Your brand on every page",
    body: "Your logo, your agency name, your subdomain (review.youragency.com). Clients never see ours.",
  },
  {
    title: "Approval logs for invoicing",
    body: "Timestamped record of every approval. Use as proof for invoices and scope-creep disputes.",
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
  },  {
    q: "What file types can I upload?",
    a: "PNG, JPG, GIF, WebP, and PDF. Up to 25MB per file. Video review (MP4) is on the roadmap.",
  },
  {
    q: "How is this different from Figma comments or Loom?",
    a: "Figma needs your client to have a Figma account. Loom is one-way. ApprovalKit is built for one purpose: get a yes (or precise feedback) from a non-technical client in the fewest clicks possible.",
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
  },];

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
          Send your clients a branded review link. They approve in one click — or
          click the exact pixel they want changed. No login, no Figma, no 47-email
          approval threads.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/demo"
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-brand-600"
          >
            Try the live demo
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-500"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Try the demo as a client · approve or pin a comment · no signup
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
          One payment. Lifetime access.
        </h2>
        <p className="mt-3 text-slate-600">
          We host it. You log in. No servers to manage, no monthly bill.
        </p>
        <div className="mt-10 inline-block rounded-2xl border border-brand-200 bg-white p-8 text-left shadow-sm">
          <div className="text-sm font-medium text-brand-600">Lifetime access</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900">$149</span>
            <span className="text-sm text-slate-500">one-time · no subscription</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>✓ Unlimited projects, clients, and revisions</li>
            <li>✓ Branded review pages with your logo and agency name</li>
            <li>✓ Custom subdomain (review.youragency.com) — included</li>
            <li>✓ Auto-nudge emails when clients go silent</li>
            <li>✓ Approval logs for invoicing and dispute proof</li>
            <li>✓ Magic-link login — no passwords to manage</li>
            <li>✓ All future features included, forever</li>
            <li>✓ 30-day refund, no questions asked</li>
          </ul>
          <a
            href="https://heisnberg4.gumroad.com/l/tneacr"
            className="mt-6 block rounded-lg bg-brand-500 px-5 py-3 text-center font-medium text-white hover:bg-brand-600"
          >
            Get lifetime access →
          </a>
          <p className="mt-3 text-center text-xs text-slate-500">
            Secure checkout via Gumroad
          </p>
        </div>
      </section>

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
      </section>

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

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
          Common questions
        </h2>
        <div className="mt-10 space-y-6">
          {objections.map((o) => (
            <div key={o.q} className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">{o.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        Built for agency owners tired of approval ping-pong.
      </footer>
    </main>
  );
}
