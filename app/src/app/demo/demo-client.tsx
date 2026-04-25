"use client";

import { useState } from "react";
import Link from "next/link";

const BRAND = "#4f46e5";
const AGENCY = "Pixel & Pine Studio";
const PROJECT = "Lumen — Brand Identity & Web Launch";
const CLIENT_NAME = "Maya Patel";

type AssetStatus = "pending" | "approved";

interface Comment {
  id: string;
  authorName: string;
  isFromAgency: boolean;
  body: string;
  xPct?: number;
  yPct?: number;
  createdAt: string;
}

interface Asset {
  id: string;
  label: string;
  versions: { v: number; svg: React.ReactNode }[];
  currentV: number;
  status: AssetStatus;
  comments: Comment[];
  approvedBy?: string;
  approvedAt?: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// === SVG mockups (no external assets) ===

function LogoConceptA() {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <g transform="translate(300 180)">
        <circle r="62" fill="#4f46e5" />
        <circle r="62" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="4 8" />
        <text textAnchor="middle" y="14" fontSize="44" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif,system-ui">L</text>
      </g>
      <text x="300" y="290" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0f172a" fontFamily="ui-sans-serif,system-ui">LUMEN</text>
      <text x="300" y="316" textAnchor="middle" fontSize="11" letterSpacing="6" fill="#64748b" fontFamily="ui-sans-serif,system-ui">CLEAR · WARM · MODERN</text>
    </svg>
  );
}

function LogoConceptB_v1() {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <g transform="translate(300 180)">
        <path d="M -50 30 L 0 -50 L 50 30 Z" fill="#0f172a" />
        <circle cx="0" cy="-10" r="10" fill="#facc15" />
      </g>
      <text x="300" y="290" textAnchor="middle" fontSize="28" fontWeight="500" fill="#0f172a" fontFamily="ui-serif,Georgia">Lumen</text>
    </svg>
  );
}

function LogoConceptB_v2() {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <g transform="translate(300 180)">
        <path d="M -54 32 L 0 -54 L 54 32 Z" fill="#0f172a" />
        <circle cx="0" cy="-12" r="12" fill="#f59e0b" />
      </g>
      <text x="300" y="292" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0f172a" fontFamily="ui-serif,Georgia">Lumen</text>
    </svg>
  );
}

function ColorPalette() {
  const swatches = [
    { hex: "#0f172a", name: "Ink" },
    { hex: "#4f46e5", name: "Indigo" },
    { hex: "#f59e0b", name: "Amber" },
    { hex: "#fafafa", name: "Snow" },
    { hex: "#94a3b8", name: "Slate" },
  ];
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#ffffff" />
      {swatches.map((s, i) => (
        <g key={s.hex} transform={`translate(${40 + i * 110} 100)`}>
          <rect width="90" height="160" rx="10" fill={s.hex} stroke="#e2e8f0" />
          <text x="45" y="200" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0f172a">{s.name}</text>
          <text x="45" y="218" textAnchor="middle" fontSize="11" fill="#64748b">{s.hex}</text>
        </g>
      ))}
      <text x="300" y="60" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">Lumen — Brand Palette</text>
      <text x="300" y="78" textAnchor="middle" fontSize="12" fill="#64748b">5-color system · web + print ready</text>
    </svg>
  );
}

function HomepageHero() {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#0f172a" />
      <rect x="0" y="0" width="600" height="40" fill="#1e293b" />
      <text x="20" y="26" fill="#fff" fontSize="13" fontWeight="700">Lumen</text>
      <text x="480" y="26" fill="#94a3b8" fontSize="11">Product · Pricing · About</text>
      <text x="40" y="180" fill="#fff" fontSize="36" fontWeight="700">Light up your</text>
      <text x="40" y="220" fill="#f59e0b" fontSize="36" fontWeight="700">workspace.</text>
      <text x="40" y="260" fill="#cbd5e1" fontSize="13">Smart desk lamps that follow your circadian rhythm.</text>
      <rect x="40" y="284" width="140" height="44" rx="8" fill="#4f46e5" />
      <text x="110" y="312" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">Shop now →</text>
      <rect x="380" y="120" width="180" height="220" rx="14" fill="#1e293b" stroke="#334155" />
      <circle cx="470" cy="200" r="40" fill="#f59e0b" opacity="0.8" />
      <rect x="430" y="240" width="80" height="80" rx="6" fill="#0f172a" />
    </svg>
  );
}

function NewsletterTemplate() {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <rect x="100" y="20" width="400" height="360" fill="#fff" stroke="#e2e8f0" />
      <rect x="100" y="20" width="400" height="48" fill="#4f46e5" />
      <text x="120" y="50" fill="#fff" fontSize="14" fontWeight="700">Lumen Weekly</text>
      <text x="480" y="50" textAnchor="end" fill="#fff" fontSize="11" opacity="0.8">Issue #14</text>
      <text x="120" y="100" fill="#0f172a" fontSize="18" fontWeight="700">5 ways to fix afternoon glare</text>
      <text x="120" y="124" fill="#64748b" fontSize="11">By Maya · 4 min read</text>
      <rect x="120" y="140" width="360" height="120" rx="6" fill="#fef3c7" />
      <circle cx="200" cy="200" r="28" fill="#f59e0b" />
      <rect x="120" y="280" width="360" height="8" rx="4" fill="#cbd5e1" />
      <rect x="120" y="296" width="280" height="8" rx="4" fill="#cbd5e1" />
      <rect x="120" y="312" width="320" height="8" rx="4" fill="#cbd5e1" />
      <rect x="220" y="340" width="160" height="36" rx="6" fill="#0f172a" />
      <text x="300" y="362" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Read full article →</text>
    </svg>
  );
}

const NOW = new Date().toISOString();
const HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

const initialAssets: Asset[] = [
  {
    id: "logo-a",
    label: "Logo Concept A — Geometric",
    versions: [{ v: 1, svg: <LogoConceptA /> }],
    currentV: 1,
    status: "pending",
    comments: [],
  },
  {
    id: "logo-b",
    label: "Logo Concept B — Mountain mark",
    versions: [
      { v: 1, svg: <LogoConceptB_v1 /> },
      { v: 2, svg: <LogoConceptB_v2 /> },
    ],
    currentV: 2,
    status: "pending",
    comments: [
      {
        id: "c1",
        authorName: "Maya Patel",
        isFromAgency: false,
        body: "Loving the direction! Can we make the icon a touch bolder and the wordmark a touch heavier?",
        xPct: 50,
        yPct: 42,
        createdAt: DAY_AGO,
      },
      {
        id: "c2",
        authorName: "Pixel & Pine Studio",
        isFromAgency: true,
        body: "Updated! v2 is live above with bolder icon + heavier wordmark. Take a look!",
        createdAt: HOUR_AGO,
      },
    ],
  },
  {
    id: "palette",
    label: "Color Palette — Brand System",
    versions: [{ v: 1, svg: <ColorPalette /> }],
    currentV: 1,
    status: "approved",
    comments: [
      {
        id: "c3",
        authorName: "Maya Patel",
        isFromAgency: false,
        body: "Perfect — exactly the warmth we wanted. Approved!",
        createdAt: DAY_AGO,
      },
    ],
    approvedBy: "Maya Patel",
    approvedAt: DAY_AGO,
  },
  {
    id: "hero",
    label: "Homepage Hero Section",
    versions: [{ v: 1, svg: <HomepageHero /> }],
    currentV: 1,
    status: "pending",
    comments: [],
  },
  {
    id: "newsletter",
    label: "Email Newsletter Template",
    versions: [{ v: 1, svg: <NewsletterTemplate /> }],
    currentV: 1,
    status: "pending",
    comments: [
      {
        id: "c4",
        authorName: "Pixel & Pine Studio",
        isFromAgency: true,
        body: "First pass on the weekly newsletter — let me know if you'd like a different hero treatment.",
        createdAt: HOUR_AGO,
      },
    ],
  },
];

export default function DemoClient() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [name, setName] = useState(CLIENT_NAME);
  const [pinDraft, setPinDraft] = useState<{ assetId: string; xPct: number; yPct: number } | null>(null);
  const [pinBody, setPinBody] = useState("");

  const pending = assets.filter((a) => a.status !== "approved").length;

  function approve(assetId: string) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "approved", approvedBy: name || "You", approvedAt: NOW }
          : a,
      ),
    );
  }

  function unapprove(assetId: string) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: "pending", approvedBy: undefined, approvedAt: undefined } : a,
      ),
    );
  }

  function setVersion(assetId: string, v: number) {
    setAssets((prev) => prev.map((a) => (a.id === assetId ? { ...a, currentV: v } : a)));
  }

  function startPin(assetId: string, e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPinDraft({ assetId, xPct, yPct });
    setPinBody("");
  }

  function submitPin() {
    if (!pinDraft || !pinBody.trim()) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === pinDraft.assetId
          ? {
              ...a,
              comments: [
                ...a.comments,
                {
                  id: uid(),
                  authorName: name || "You",
                  isFromAgency: false,
                  body: pinBody.trim(),
                  xPct: pinDraft.xPct,
                  yPct: pinDraft.yPct,
                  createdAt: NOW,
                },
              ],
            }
          : a,
      ),
    );
    setPinDraft(null);
    setPinBody("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 text-center text-xs text-indigo-900">
        <span className="font-semibold">Live demo</span> · This is what your clients see.
        Click Approve, pin a comment, switch versions — nothing is saved.{" "}
        <Link href="/" className="underline font-semibold">← Back to ApprovalKit</Link>
      </div>

      {/* Branded header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 font-semibold" style={{ color: BRAND }}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white text-sm">P</span>
            {AGENCY}
          </div>
          <div className="text-sm text-slate-500">{PROJECT}</div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Hi {name || "there"} 👋</h1>
            <p className="mt-2 text-slate-600">
              {pending > 0
                ? `${pending} ${pending === 1 ? "item needs" : "items need"} your review.`
                : "All caught up — every item is approved! 🎉"}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Your name:</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {assets.map((asset) => {
            const currentSvg = asset.versions.find((v) => v.v === asset.currentV)?.svg;
            const pinsHere = asset.comments.filter((c) => c.xPct != null && c.yPct != null);
            const isApproved = asset.status === "approved";
            return (
              <article
                key={asset.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative">
                  <div
                    className="relative aspect-[3/2] cursor-crosshair bg-slate-50"
                    onClick={(e) => !isApproved && startPin(asset.id, e)}
                  >
                    {currentSvg}
                    {pinsHere.map((c, i) => (
                      <span
                        key={c.id}
                        className="absolute -translate-x-1/2 -translate-y-full"
                        style={{ left: `${c.xPct}%`, top: `${c.yPct}%` }}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-[11px] font-bold ring-2 ring-white shadow-md"
                          title={`${c.authorName}: ${c.body}`}
                        >
                          {i + 1}
                        </span>
                      </span>
                    ))}
                    {pinDraft?.assetId === asset.id && (
                      <span
                        className="absolute -translate-x-1/2 -translate-y-full"
                        style={{ left: `${pinDraft.xPct}%`, top: `${pinDraft.yPct}%` }}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white text-[11px] font-bold ring-2 ring-white shadow-md animate-pulse">
                          ✎
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{asset.label}</div>
                      <div className="text-xs text-slate-500">
                        v{asset.currentV}
                        {asset.versions.length > 1 && ` of ${asset.versions.length}`}
                      </div>
                    </div>
                    {isApproved ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>

                  {asset.versions.length > 1 && (
                    <div className="mt-3 flex gap-1.5">
                      {asset.versions.map((v) => (
                        <button
                          key={v.v}
                          onClick={() => setVersion(asset.id, v.v)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                            asset.currentV === v.v
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-slate-300 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          v{v.v}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {isApproved ? (
                      <button
                        onClick={() => unapprove(asset.id)}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
                      >
                        Un-approve
                      </button>
                    ) : (
                      <button
                        onClick={() => approve(asset.id)}
                        className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                      >
                        ✓ Approve
                      </button>
                    )}
                  </div>

                  {!isApproved && (
                    <p className="mt-2 text-center text-[11px] text-slate-400">
                      💡 Click anywhere on the mockup above to pin a comment to that spot
                    </p>
                  )}

                  {asset.approvedBy && (
                    <p className="mt-2 text-xs text-emerald-700">
                      Approved by {asset.approvedBy} · {timeAgo(asset.approvedAt!)}
                    </p>
                  )}

                  {asset.comments.length > 0 && (
                    <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      {asset.comments.map((c, i) => {
                        const pinIdx = pinsHere.findIndex((p) => p.id === c.id);
                        return (
                          <li key={c.id} className="flex gap-3">
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                c.isFromAgency
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-indigo-600 text-white"
                              }`}
                            >
                              {pinIdx >= 0 ? pinIdx + 1 : c.isFromAgency ? "🎨" : (i + 1)}
                            </span>
                            <div className="flex-1">
                              <div className="text-xs">
                                <span className="font-semibold text-slate-900">{c.authorName}</span>
                                <span className="ml-2 text-slate-400">{timeAgo(c.createdAt)}</span>
                              </div>
                              <div className="mt-0.5 text-sm text-slate-700">{c.body}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pin comment composer modal */}
        {pinDraft && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-semibold">Pin a comment to this spot</h3>
              <p className="mt-1 text-xs text-slate-500">
                {assets.find((a) => a.id === pinDraft.assetId)?.label} · pinned at{" "}
                {Math.round(pinDraft.xPct)}%, {Math.round(pinDraft.yPct)}%
              </p>
              <textarea
                autoFocus
                value={pinBody}
                onChange={(e) => setPinBody(e.target.value)}
                rows={4}
                placeholder="e.g. Can we try a slightly bolder weight here?"
                className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setPinDraft(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPin}
                  disabled={!pinBody.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Post comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8 text-center">
          <h2 className="text-2xl font-bold">Ready to send links like this to your own clients?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Set up your agency in under 2 minutes. Your logo, your brand color, your subdomain.
            One payment, lifetime access — no monthly fees.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://heisnberg4.gumroad.com/l/tneacr"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Get lifetime access — $149 →
            </a>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-500"
            >
              See full feature list
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">30-day refund · no subscription · unlimited projects</p>
        </section>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-12 pt-4 text-center text-xs text-slate-400">
        Powered by ApprovalKit
      </footer>
    </main>
  );
}
