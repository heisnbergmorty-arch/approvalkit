import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & docs",
  description: "How to set up ApprovalKit, send review links, and integrate with Slack/Zapier.",
};

interface QA {
  q: string;
  a: React.ReactNode;
}

const sections: { title: string; items: QA[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I create my first review link?",
        a: (
          <>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Sign up using your work email.</li>
              <li>Set your agency name + brand color in <Link href="/dashboard/settings" className="text-brand-600 underline">Settings</Link>.</li>
              <li>Click <b>+ New project</b>, fill in the client name + email.</li>
              <li>Upload a PNG/JPG/PDF, then click <b>✉ Email link to client</b>.</li>
            </ol>
            <p className="mt-2">
              Total time: about 90 seconds. Try the{" "}
              <Link href="/demo" className="text-brand-600 underline">
                live demo
              </Link>{" "}
              to see what your client will see.
            </p>
          </>
        ),
      },
      {
        q: "Do my clients need an account?",
        a: (
          <>
            No. Clients open the unique review link you send them — that&rsquo;s it. We collect
            their name on first comment so attribution sticks; no password, no signup,
            ever.
          </>
        ),
      },
      {
        q: "What file types can I upload?",
        a: (
          <>
            PNG, JPG, GIF, WebP, and PDF, up to 25 MB per file. Video review (MP4) is on
            the <Link href="/roadmap" className="text-brand-600 underline">roadmap</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: "Versioning & feedback",
    items: [
      {
        q: "How do versions work?",
        a: (
          <>
            Re-upload a file under the same group key (e.g. <code className="text-xs">logo-concepts</code>)
            and ApprovalKit auto-bumps it to v2, v3, v4… Clients always see the current
            version on their review page; you can compare every version side-by-side from{" "}
            <b>Project → Compare versions</b>.
          </>
        ),
      },
      {
        q: "How do pixel-anchored comments work?",
        a: (
          <>
            Clients click anywhere on an asset → a pin drops at that exact spot →
            modal opens for the comment text. The pin stays anchored even if the image
            rescales (positions are stored as basis-point percentages, not absolute
            pixels).
          </>
        ),
      },
      {
        q: "Can I export the approval log for invoicing?",
        a: (
          <>
            Yes — every project page has an <b>⬇ Export approval log (CSV)</b> button, and
            <b> Settings → Your data</b> has a <b>full account export</b> covering every project
            in one file. Includes timestamps, actors, asset versions, and comment bodies. Settles
            scope-creep arguments instantly.
          </>
        ),
      },
      {
        q: "Too many notification emails — can I throttle them?",
        a: (
          <>
            Yes. Open any project and use the <b>Notifications</b> selector to switch between{" "}
            <b>Instant</b> (email per event), <b>Daily digest</b> (one summary email per day),
            or <b>Off</b> (webhooks still fire). Setting is per-project, so you can keep noisy
            old projects silent while staying instant on the new launch.
          </>
        ),
      },
    ],
  },
  {
    title: "Sharing & security",
    items: [
      {
        q: "What if my client forwards the review link to someone else?",
        a: (
          <>
            By default, the review link is the credential — anyone who has it can view, comment,
            and approve. The slug is long and unguessable, and we send <code>noindex</code>{" "}
            headers so search engines won&apos;t cache it. For high-stakes work (legal docs,
            unreleased branding), open the project page and turn on <b>Review-link PIN</b> — a
            4–8 digit code your client must enter before they see anything. Send the PIN by chat
            or a separate email, never in the same message as the link.
          </>
        ),
      },
      {
        q: "Will my review pages show up in Google search?",
        a: (
          <>
            No. Every <code>/review/[slug]</code> page sends <code>X-Robots-Tag: noindex,
            nofollow</code> via metadata. Even if a link leaks publicly, it won&apos;t be
            indexed. (We can&apos;t prevent screenshots — for that, use the PIN.)
          </>
        ),
      },
      {
        q: "Who can see internal asset notes?",
        a: (
          <>
            Only you (and any signed-in agency owner). Internal notes never appear on the client
            review page, in webhooks, in client emails, or in any CSV export — they live solely
            on your dashboard.
          </>
        ),
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        q: "How do I set up a Slack notification?",
        a: (
          <ol className="list-decimal space-y-1 pl-5">
            <li>In Slack, create an <b>Incoming Webhook</b> for the channel you want pings in.</li>
            <li>Copy the webhook URL.</li>
            <li>Paste it into <b>Settings → Integrations → Webhook URL</b> and save.</li>
            <li>Click <b>Send test ping</b> to verify.</li>
          </ol>
        ),
      },
      {
        q: "What events fire the webhook?",
        a: (
          <>
            <code className="text-xs">asset.approved</code> and{" "}
            <code className="text-xs">comment.created</code>. Payload is JSON: see{" "}
            <Link href="/dashboard/settings" className="text-brand-600 underline">
              Settings
            </Link>{" "}
            for the example body.
          </>
        ),
      },
      {
        q: "Can I use a custom domain?",
        a: (
          <>
            Yes. Add your domain in Settings (e.g. <code>review.yourstudio.com</code>) and
            point a CNAME at <code>cname.vercel-dns.com</code>. Clients see your branded URL
            instead of ours.
          </>
        ),
      },
    ],
  },
  {
    title: "Billing & account",
    items: [
      {
        q: "How does pricing work?",
        a: (
          <>
            $149 one-time via Gumroad. Lifetime access to every future feature. No
            recurring charges, no per-seat costs. See{" "}
            <Link href="/dashboard/billing" className="text-brand-600 underline">
              Billing
            </Link>{" "}
            for your license status.
          </>
        ),
      },
      {
        q: "Can I get a refund?",
        a: (
          <>
            Yes — within 14 days, no questions asked. Email{" "}
            <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
              heisnbergmorty@gmail.com
            </a>
            .
          </>
        ),
      },
      {
        q: "Can I self-host?",
        a: (
          <>
            The codebase is open. Set <code>PAYMENT_GATING_ENABLED=false</code> and you can
            run your own instance for non-commercial use. Commercial self-hosting still
            requires a license.
          </>
        ),
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Back home</Link>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Help &amp; docs</h1>
        <p className="mt-2 text-slate-600">
          Quick answers to the questions agencies ask most. Stuck? Email{" "}
          <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
            heisnbergmorty@gmail.com
          </a>
          .
        </p>
      </header>

      {sections.map((s) => (
        <section key={s.title} className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {s.title}
          </h2>
          <div className="space-y-3">
            {s.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-white p-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-medium text-slate-900 group-open:text-brand-700">
                  {item.q}
                </summary>
                <div className="mt-3 text-sm text-slate-600">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-brand-50 p-6 text-center">
        <h3 className="text-lg font-semibold">Still stuck?</h3>
        <p className="mt-1 text-sm text-slate-600">
          Real human support, usually replies within a few hours.
        </p>
        <a
          href="mailto:heisnbergmorty@gmail.com"
          className="mt-4 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Email support
        </a>
      </div>
    </main>
  );
}
