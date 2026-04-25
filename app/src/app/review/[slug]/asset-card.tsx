"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Asset {
  id: string;
  label: string;
  version: number;
  fileUrl: string;
  mimeType: string;
  status: "pending" | "approved" | "changes_requested";
}

interface Comment {
  id: string;
  authorName: string;
  isFromAgency: boolean;
  body: string;
  xPct: number | null;
  yPct: number | null;
  createdAt: string | Date;
}

interface Props {
  reviewSlug: string;
  asset: Asset;
  comments: Comment[];
  brandColor: string;
  defaultName: string;
}

function timeAgo(d: string | Date): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function AssetReviewCard({ reviewSlug, asset, comments, brandColor, defaultName }: Props) {
  const [name, setName] = useState(defaultName);
  const [body, setBody] = useState("");
  const [pinDraft, setPinDraft] = useState<{ xPct: number; yPct: number } | null>(null);
  const [pinBody, setPinBody] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isImage = asset.mimeType.startsWith("image/");
  const isApproved = asset.status === "approved";

  const pins = comments.filter((c) => c.xPct != null && c.yPct != null);

  function approve() {
    if (!name.trim()) {
      setError("Please add your name first.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await fetch("/api/review/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewSlug, assetId: asset.id, approverName: name.trim() }),
      });
      if (!res.ok) {
        setError("Could not approve. Try again.");
        return;
      }
      router.refresh();
    });
  }

  function comment() {
    if (!name.trim() || !body.trim()) {
      setError("Name and feedback required.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await fetch("/api/review/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reviewSlug,
          assetId: asset.id,
          authorName: name.trim(),
          body: body.trim(),
        }),
      });
      if (!res.ok) {
        setError("Could not send. Try again.");
        return;
      }
      setBody("");
      router.refresh();
    });
  }

  function startPin(e: React.MouseEvent<HTMLDivElement>) {
    if (isApproved) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPinDraft({ xPct, yPct });
    setPinBody("");
  }

  function submitPin() {
    if (!pinDraft || !pinBody.trim()) return;
    if (!name.trim()) {
      setError("Please add your name first.");
      return;
    }
    setError(null);
    const xBp = Math.round(pinDraft.xPct * 100);
    const yBp = Math.round(pinDraft.yPct * 100);
    start(async () => {
      const res = await fetch("/api/review/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reviewSlug,
          assetId: asset.id,
          authorName: name.trim(),
          body: pinBody.trim(),
          xPct: xBp,
          yPct: yBp,
        }),
      });
      if (!res.ok) {
        setError("Could not pin. Try again.");
        return;
      }
      setPinDraft(null);
      setPinBody("");
      router.refresh();
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        {isImage ? (
          <div
            className={`relative aspect-[3/2] w-full bg-slate-100 ${isApproved ? "" : "cursor-crosshair"}`}
            onClick={startPin}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.fileUrl}
              alt={asset.label}
              className="h-full w-full object-contain pointer-events-none"
            />
            {pins.map((c, i) => (
              <span
                key={c.id}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${c.xPct! / 100}%`, top: `${c.yPct! / 100}%` }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-bold ring-2 ring-white shadow-md"
                  style={{ backgroundColor: brandColor }}
                  title={`${c.authorName}: ${c.body}`}
                >
                  {i + 1}
                </span>
              </span>
            ))}
            {pinDraft && (
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
        ) : (
          <a
            href={asset.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex aspect-[3/2] w-full items-center justify-center bg-slate-100 text-sm text-slate-600 hover:bg-slate-200"
          >
            📄 Open {asset.label}
          </a>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{asset.label}</div>
            <div className="text-xs text-slate-500">
              v{asset.version}
              {comments.length > 0 && ` · ${comments.length} comment${comments.length === 1 ? "" : "s"}`}
            </div>
          </div>
          <StatusBadge status={asset.status} />
        </div>

        {!isApproved && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ outlineColor: brandColor }}
            />
            <button
              onClick={approve}
              disabled={pending}
              className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              ✓ Approve
            </button>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Or leave general feedback…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ outlineColor: brandColor }}
            />
            <button
              onClick={comment}
              disabled={pending || !body.trim()}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-500 disabled:opacity-60"
            >
              💬 Send feedback
            </button>
            {isImage && (
              <p className="text-center text-[11px] text-slate-400">
                💡 Click anywhere on the image above to pin a comment to that exact spot
              </p>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}

        {comments.length > 0 && (
          <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            {comments.map((c, i) => {
              const pinIdx = pins.findIndex((p) => p.id === c.id);
              return (
                <li key={c.id} className="flex gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{
                      backgroundColor: c.isFromAgency ? "#e2e8f0" : brandColor,
                      color: c.isFromAgency ? "#334155" : "#fff",
                    }}
                  >
                    {pinIdx >= 0 ? pinIdx + 1 : c.isFromAgency ? "🎨" : i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-900">{c.authorName}</span>
                      {c.isFromAgency && <span className="ml-1 text-slate-500">· team</span>}
                      <span className="ml-2 text-slate-400">{timeAgo(c.createdAt)}</span>
                    </div>
                    <div className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">{c.body}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {pinDraft && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-semibold">Pin a comment to this spot</h3>
            <p className="mt-1 text-xs text-slate-500">
              {asset.label} · pinned at {Math.round(pinDraft.xPct)}%, {Math.round(pinDraft.yPct)}%
            </p>
            {!name.trim() && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (required)"
                className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            )}
            <textarea
              autoFocus
              value={pinBody}
              onChange={(e) => setPinBody(e.target.value)}
              rows={4}
              placeholder="e.g. Can we try a slightly bolder weight here?"
              className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ outlineColor: brandColor }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setPinDraft(null);
                  setPinBody("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={submitPin}
                disabled={!pinBody.trim() || pending || !name.trim()}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                Post comment
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-600",
    approved: "bg-emerald-100 text-emerald-700",
    changes_requested: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
