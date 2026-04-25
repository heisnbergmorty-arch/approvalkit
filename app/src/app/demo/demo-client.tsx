"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const DEFAULT_BRAND = "#4f46e5";
const AGENCY_DEFAULT = "Pixel & Pine Studio";
const PROJECT = "Lumen — Brand Identity & Web Launch";
const CLIENT_NAME = "Maya Patel";

const BRAND_PRESETS = [
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Slate", hex: "#0f172a" },
  { name: "Sky", hex: "#0284c7" },
];

type AssetStatus = "pending" | "approved";
type FilterMode = "all" | "pending" | "approved";

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

function LogoConceptA({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <g transform="translate(300 180)">
        <circle r="62" fill={brand} />
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

function ColorPalette({ brand }: { brand: string }) {
  const swatches = [
    { hex: "#0f172a", name: "Ink" },
    { hex: brand, name: "Brand" },
    { hex: "#f59e0b", name: "Amber" },
    { hex: "#fafafa", name: "Snow" },
    { hex: "#94a3b8", name: "Slate" },
  ];
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#ffffff" />
      {swatches.map((s, i) => (
        <g key={i} transform={`translate(${40 + i * 110} 100)`}>
          <rect width="90" height="160" rx="10" fill={s.hex} stroke="#e2e8f0" />
          <text x="45" y="200" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0f172a">{s.name}</text>
          <text x="45" y="218" textAnchor="middle" fontSize="11" fill="#64748b">{s.hex.toUpperCase()}</text>
        </g>
      ))}
      <text x="300" y="60" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">Lumen — Brand Palette</text>
      <text x="300" y="78" textAnchor="middle" fontSize="12" fill="#64748b">5-color system · web + print ready</text>
    </svg>
  );
}

function HomepageHero({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#0f172a" />
      <rect x="0" y="0" width="600" height="40" fill="#1e293b" />
      <text x="20" y="26" fill="#fff" fontSize="13" fontWeight="700">Lumen</text>
      <text x="480" y="26" fill="#94a3b8" fontSize="11">Product · Pricing · About</text>
      <text x="40" y="180" fill="#fff" fontSize="36" fontWeight="700">Light up your</text>
      <text x="40" y="220" fill="#f59e0b" fontSize="36" fontWeight="700">workspace.</text>
      <text x="40" y="260" fill="#cbd5e1" fontSize="13">Smart desk lamps that follow your circadian rhythm.</text>
      <rect x="40" y="284" width="140" height="44" rx="8" fill={brand} />
      <text x="110" y="312" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">Shop now →</text>
      <rect x="380" y="120" width="180" height="220" rx="14" fill="#1e293b" stroke="#334155" />
      <circle cx="470" cy="200" r="40" fill="#f59e0b" opacity="0.8" />
      <rect x="430" y="240" width="80" height="80" rx="6" fill="#0f172a" />
    </svg>
  );
}

function NewsletterTemplate({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 600 400" className="block w-full h-full">
      <rect width="600" height="400" fill="#fafafa" />
      <rect x="100" y="20" width="400" height="360" fill="#fff" stroke="#e2e8f0" />
      <rect x="100" y="20" width="400" height="48" fill={brand} />
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

function buildInitialAssets(brand: string): Asset[] {
  return [
    {
      id: "logo-a",
      label: "Logo Concept A — Geometric",
      versions: [{ v: 1, svg: <LogoConceptA brand={brand} /> }],
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
      versions: [{ v: 1, svg: <ColorPalette brand={brand} /> }],
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
      versions: [{ v: 1, svg: <HomepageHero brand={brand} /> }],
      currentV: 1,
      status: "pending",
      comments: [],
    },
    {
      id: "newsletter",
      label: "Email Newsletter Template",
      versions: [{ v: 1, svg: <NewsletterTemplate brand={brand} /> }],
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
}

export default function DemoClient() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [agency, setAgency] = useState(AGENCY_DEFAULT);
  const [name, setName] = useState(CLIENT_NAME);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [pinDraft, setPinDraft] = useState<{ assetId: string; xPct: number; yPct: number } | null>(null);
  const [pinBody, setPinBody] = useState("");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showFlow, setShowFlow] = useState(true);
  const [shared, setShared] = useState(false);

  // Rebuild assets whenever brand changes (so SVGs use the new color), preserving status/comments
  const [assetState, setAssetState] = useState(() => buildInitialAssets(DEFAULT_BRAND));

  // Derive brand-aware assets: keep the user's status/comments/version but swap the SVG via brand
  const assets = useMemo(() => {
    const fresh = buildInitialAssets(brand);
    return fresh.map((f) => {
      const existing = assetState.find((a) => a.id === f.id);
      if (!existing) return f;
      return {
        ...f,
        currentV: existing.currentV,
        status: existing.status,
        approvedBy: existing.approvedBy,
        approvedAt: existing.approvedAt,
        comments: existing.comments,
      };
    });
  }, [brand, assetState]);

  const counts = {
    all: assets.length,
    pending: assets.filter((a) => a.status === "pending").length,
    approved: assets.filter((a) => a.status === "approved").length,
  };

  const visibleAssets = assets.filter((a) =>
    filter === "all" ? true : a.status === filter,
  );

  function approve(assetId: string) {
    setAssetState((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, status: "approved", approvedBy: name || "You", approvedAt: NOW }
          : a,
      ),
    );
  }

  function unapprove(assetId: string) {
    setAssetState((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: "pending", approvedBy: undefined, approvedAt: undefined } : a,
      ),
    );
  }

  function approveAll() {
    setAssetState((prev) =>
      prev.map((a) =>
        a.status === "pending"
          ? { ...a, status: "approved", approvedBy: name || "You", approvedAt: NOW }
          : a,
      ),
    );
  }

  function setVersion(assetId: string, v: number) {
    setAssetState((prev) => prev.map((a) => (a.id === assetId ? { ...a, currentV: v } : a)));
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
    setAssetState((prev) =>
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

  function resetDemo() {
    setAssetState(buildInitialAssets(DEFAULT_BRAND));
    setBrand(DEFAULT_BRAND);
    setAgency(AGENCY_DEFAULT);
    setName(CLIENT_NAME);
    setFilter("all");
    setPinDraft(null);
    setPinBody("");
  }

  function shareDemo() {
    const url = "https://approvalkit-topaz.vercel.app/demo";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => {
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        },
        () => {
          window.prompt("Copy this link:", url);
        },
      );
    } else {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="bg-slate-900 px-4 py-2 text-center text-xs text-white">
        <span className="font-semibold">▰ ApprovalKit live demo</span> · You are{" "}
        <span className="font-semibold text-amber-300">{name || "the client"}</span>. This is
        what your designer&apos;s clients see in their inbox.{" "}
        <Link href="/" className="underline font-semibold">← Back to homepage</Link>
      </div>

      {/* Flow explainer (collapsible) */}
      <div className="border-b border-slate-200 bg-amber-50">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <button
            onClick={() => setShowFlow((s) => !s)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <span className="text-sm font-semibold text-amber-900">
              🧭 How did {name || "the client"} get to this page? {showFlow ? "Hide" : "Show"} the 4-step flow
            </span>
            <span className="text-amber-700">{showFlow ? "▴" : "▾"}</span>
          </button>
          {showFlow && (
            <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <FlowStep
                n={1}
                title={`${agency} uploads work`}
                body="Agency drags 4 logo concepts into their dashboard. ApprovalKit auto-versions them so v1, v2, v3 group together."
              />
              <FlowStep
                n={2}
                title="One click sends a branded email"
                body={`${agency} clicks "Email link to client". The client (you) gets a clean branded email — no signup, no app to install.`}
              />
              <FlowStep
                n={3}
                title="You land HERE"
                body="No login. Click Approve, leave general feedback, or click anywhere on an image to pin a precise comment to that exact pixel."
              />
              <FlowStep
                n={4}
                title="Agency hears back instantly"
                body={`Every action triggers a Slack ping + email + audit-log entry. ${agency} sees your name on every approval — receipts for invoicing.`}
              />
            </ol>
          )}
        </div>
      </div>

      {/* Branded header (uses agency brand color) */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 font-semibold" style={{ color: brand }}>
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded text-white text-sm font-bold"
              style={{ backgroundColor: brand }}
            >
              {agency.charAt(0)}
            </span>
            {agency}
          </div>
          <div className="text-sm text-slate-500">{PROJECT}</div>
        </div>
      </header>

      {/* Customizer toolbar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <button
            onClick={() => setShowCustomizer((s) => !s)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <span
              className="inline-block h-3 w-3 rounded-full ring-2 ring-white shadow"
              style={{ backgroundColor: brand }}
            />
            White-label preview · {showCustomizer ? "hide" : "show"} customizer
            <span className="text-slate-400">{showCustomizer ? "▴" : "▾"}</span>
          </button>
          {showCustomizer && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                In production, agencies set this once in the dashboard. Try it live:
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="text-xs">
                  <span className="font-semibold text-slate-700">Agency name</span>
                  <input
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </label>
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">Brand color</span>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-300"
                    />
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-mono uppercase focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {BRAND_PRESETS.map((p) => (
                      <button
                        key={p.hex}
                        onClick={() => setBrand(p.hex)}
                        title={p.name}
                        className={`h-6 w-6 rounded-full border-2 ${
                          brand.toLowerCase() === p.hex.toLowerCase()
                            ? "border-slate-900"
                            : "border-white shadow"
                        }`}
                        style={{ backgroundColor: p.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                Notice how the buttons, header, palette swatch, and mockup CTAs all recolor live.
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Hi {name || "there"} 👋</h1>
            <p className="mt-2 text-slate-600">
              {counts.pending > 0
                ? `${counts.pending} ${counts.pending === 1 ? "item needs" : "items need"} your review.`
                : "All caught up — every item is approved! 🎉"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Your name:</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Things to try */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="font-semibold text-slate-900">Things to try in this demo</div>
          <ul className="mt-2 grid gap-1 text-slate-600 sm:grid-cols-2">
            <li>✓ Click <b>✓ Approve</b> on any logo concept</li>
            <li>✓ Click anywhere on an image to <b>pin a comment</b> at that pixel</li>
            <li>✓ Open the <b>Customizer</b> (just above) and change the brand color</li>
            <li>✓ Switch between <b>v1 / v2</b> on Concept B to see versioning</li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            Nothing you do here is saved. Refresh to reset.
          </p>
        </div>

        {/* Filter tabs + actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex gap-1">
            {(["all", "pending", "approved"] as FilterMode[]).map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                    active
                      ? "text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  style={active ? { backgroundColor: brand } : undefined}
                >
                  {f}
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? "bg-white/20" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {counts[f]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {counts.pending > 0 && (
              <button
                onClick={approveAll}
                className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                ✓ Approve all pending
              </button>
            )}
            <button
              onClick={shareDemo}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-600 hover:border-slate-400"
            >
              {shared ? "✓ Link copied!" : "🔗 Share demo"}
            </button>
            <button
              onClick={resetDemo}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-600 hover:border-slate-400"
            >
              ↺ Reset demo
            </button>
          </div>
        </div>

        {visibleAssets.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">No items in this filter.</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-sm font-semibold underline"
              style={{ color: brand }}
            >
              Show all
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {visibleAssets.map((asset) => {
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
                          className="flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-bold ring-2 ring-white shadow-md"
                          style={{ backgroundColor: brand }}
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
                        {asset.comments.length > 0 && ` · ${asset.comments.length} comment${asset.comments.length === 1 ? "" : "s"}`}
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
                      {asset.versions.map((v) => {
                        const active = asset.currentV === v.v;
                        return (
                          <button
                            key={v.v}
                            onClick={() => setVersion(asset.id, v.v)}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                              active
                                ? "text-white"
                                : "border-slate-300 text-slate-600 hover:border-slate-400"
                            }`}
                            style={active ? { backgroundColor: brand, borderColor: brand } : undefined}
                          >
                            v{v.v}
                          </button>
                        );
                      })}
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
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                              style={{
                                backgroundColor: c.isFromAgency ? "#e2e8f0" : brand,
                                color: c.isFromAgency ? "#334155" : "#fff",
                              }}
                            >
                              {pinIdx >= 0 ? pinIdx + 1 : c.isFromAgency ? "🎨" : i + 1}
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
                className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
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
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: brand }}
                >
                  Post comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* What happens next */}
        <section className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            🎯 What happens after {name || "the client"} clicks Approve?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            In this demo nothing real fires — but on a live ApprovalKit account, every approval triggers:
          </p>
          <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <NextStep icon="📧" title="Instant email to the agency" body="With the approver's name, asset version, and a one-click 'Open in dashboard' link." />
            <NextStep icon="🔔" title="Slack / Discord / Zapier ping" body="Webhook payload includes asset, project, actor — wire it into your project-management board." />
            <NextStep icon="📜" title="Timestamped audit-log entry" body="Stored permanently. Download the project's CSV any time as proof for invoicing or scope-creep disputes." />
            <NextStep icon="🟢" title="Asset switches to 'approved'" body="Visible on the agency dashboard, the public review page, and the daily-digest email if enabled." />
          </ol>
          <p className="mt-4 text-xs text-slate-400">
            Comments fire the same way — agencies hear about feedback in seconds, not the next morning.
          </p>
        </section>

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl border bg-gradient-to-br from-white to-white p-8 text-center"
          style={{ borderColor: `${brand}40`, backgroundImage: `linear-gradient(135deg, ${brand}10, #ffffff)` }}
        >
          <h2 className="text-2xl font-bold">Ready to send links like this to your own clients?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Set up your agency in under 2 minutes. Your logo, your brand color, your subdomain.
            One payment, lifetime access — no monthly fees.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://heisnberg4.gumroad.com/l/tneacr"
              className="rounded-lg px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: brand }}
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
          <p className="mt-3 text-xs text-slate-500">14-day refund · no subscription · unlimited projects</p>
        </section>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-12 pt-4 text-center text-xs text-slate-400">
        Powered by ApprovalKit
      </footer>
    </main>
  );
}

function FlowStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-3 rounded-lg border border-amber-200 bg-white p-3">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
        {n}
      </span>
      <div>
        <div className="font-semibold text-amber-950">{title}</div>
        <div className="mt-0.5 text-xs text-amber-900/70">{body}</div>
      </div>
    </li>
  );
}


function NextStep({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 text-xs text-slate-600">{body}</div>
      </div>
    </li>
  );
}

