/**
 * Public roadmap. Pulled from a static array for now; v1.1 moves this
 * to a `roadmap_items` table with upvotes + sign-in via magic link.
 */
import Link from "next/link";

interface RoadmapItem {
  title: string;
  status: "shipped" | "next" | "planned" | "wishlist";
  description: string;
  votes?: number;
}

const items: RoadmapItem[] = [
  { title: "One-click approval portal", status: "shipped", description: "Clients open a link, click ✓ Approve. No login." },
  { title: "Pixel-anchored comments", status: "shipped", description: "Click the image to pin feedback to an exact spot." },
  { title: "Asset version history", status: "shipped", description: "Every upload becomes v1, v2, v3 — clients only see current." },
  { title: "Slack / Zapier webhooks", status: "shipped", description: "Get notified the moment a client acts." },
  { title: "Daily digest emails", status: "shipped", description: "One summary per day instead of per-event blasts." },
  { title: "Custom domain per agency", status: "shipped", description: "review.yourstudio.com instead of approvalkit.com." },

  { title: "Figma plugin", status: "next", description: "Push frames straight from Figma into ApprovalKit." },
  { title: "Loom-style video review", status: "next", description: "Clients record a screen+voice review, you get the link.", votes: 0 },
  { title: "Auto-summarize comment threads", status: "next", description: "AI condenses 17 client messages into 'change orange to red, make logo bigger'." },

  { title: "Mobile-native client app", status: "planned", description: "iOS/Android, push notifications.", votes: 0 },
  { title: "Approval workflows (multi-stakeholder)", status: "planned", description: "Require N people to sign off before approval is final.", votes: 0 },
  { title: "Time-tracking integration", status: "planned", description: "Auto-log hours per project (Toggl, Harvest)." },

  { title: "Client-side annotation drawing", status: "wishlist", description: "Let clients draw arrows + circles on the asset." },
  { title: "PDF page-level comments", status: "wishlist", description: "Pin comments to specific pages of a multi-page PDF." },
];

const statusColor: Record<RoadmapItem["status"], string> = {
  shipped: "bg-emerald-100 text-emerald-700",
  next: "bg-indigo-100 text-indigo-700",
  planned: "bg-slate-100 text-slate-600",
  wishlist: "bg-amber-100 text-amber-700",
};

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">← ApprovalKit</Link>
      <h1 className="mt-4 text-3xl font-bold">Roadmap</h1>
      <p className="mt-2 text-slate-600">
        What's shipped, what's next, what's wishlist. Built in public.
      </p>

      <ul className="mt-10 space-y-3">
        {items.map((it) => (
          <li key={it.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{it.title}</div>
                <p className="mt-1 text-sm text-slate-600">{it.description}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[it.status]}`}>
                {it.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-sm text-slate-500">
        Want to vote? Reply to any system email with your suggestion. Voting UI lands in v1.1.
      </p>
    </main>
  );
}
