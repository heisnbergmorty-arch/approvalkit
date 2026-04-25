import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent shipped improvements to ApprovalKit.",
};

interface Entry {
  date: string;
  version: string;
  title: string;
  bullets: string[];
}

const entries: Entry[] = [
  {
    date: "2025-01",
    version: "1.5",
    title: "Frictionless uploads & a public face",
    bullets: [
      "Drag-and-drop multi-file upload — drop a folder of versions, labels and group keys are auto-derived from filenames.",
      "Editable client email opener and sign-off, per agency. No more generic “has work ready for your review”.",
      "Setup wizard now drops you straight into creating your first project — first review link in under 60 seconds.",
      "Public agency profile at /a/{slug} — share-able landing page with your stats and recent work, fully cached.",
      "Landing page now shows a real product preview above the fold so prospects see the experience before clicking.",
    ],
  },
  {
    date: "2025-01",
    version: "1.4",
    title: "Dashboard productization",
    bullets: [
      "New top navigation across the dashboard with quick links to projects, settings, demo, and roadmap.",
      "Polished settings page — edit agency name, brand color, logo, custom domain and webhook in one form.",
      "“Email link to client” button on every project — resend the review URL with one click.",
      "Branded login, check-email, 404 and project setup pages.",
    ],
  },
  {
    date: "2025-01",
    version: "1.3",
    title: "Real pixel-anchored review experience",
    bullets: [
      "Production /review/[slug] now supports click-to-pin comments (was previously only in the demo).",
      "Per-project metric cards on the dashboard — pending vs approved counts, comment count, last activity.",
      "Filter the client review page by status: All / Pending / Approved.",
      "“All caught up” celebration state when every asset is approved.",
    ],
  },
  {
    date: "2025-01",
    version: "1.2",
    title: "SEO + share polish",
    bullets: [
      "Open Graph and Twitter card metadata across every page.",
      "JSON-LD SoftwareApplication schema with $149 lifetime offer.",
      "Sitemap and robots.txt.",
    ],
  },
  {
    date: "2025-01",
    version: "1.1",
    title: "Conversion-focused landing + demo customizer",
    bullets: [
      "Full landing rewrite with comparison table vs Filestage / Cage / Figma.",
      "9-feature grid, who-it’s-for personas, FAQ accordions.",
      "Standalone /demo page with brand-color picker and shareable state.",
      "CSV export of the full approval log per project.",
    ],
  },
  {
    date: "2024-12",
    version: "1.0",
    title: "Public launch",
    bullets: [
      "One-click client approval portal — no login required.",
      "Asset versioning (v1, v2, v3) with automatic comment threading.",
      "Slack / Zapier webhooks and daily digest emails.",
      "Custom domain support per agency (review.yourstudio.com).",
      "Lifetime pricing at $149 via Gumroad.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Back home</Link>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Changelog</h1>
        <p className="mt-2 text-slate-600">
          Every meaningful shipped improvement. Want to see what’s next?{" "}
          <Link href="/roadmap" className="text-brand-600 underline">Public roadmap →</Link>
        </p>
      </header>

      <ol className="space-y-10">
        {entries.map((e) => (
          <li key={e.version} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                v{e.version}
              </span>
              <span className="text-xs text-slate-500">{e.date}</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold">{e.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-center text-sm text-slate-500">
        Have an idea? Email{" "}
        <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
          heisnbergmorty@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
