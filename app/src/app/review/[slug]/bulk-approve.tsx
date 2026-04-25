"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  reviewSlug: string;
  pendingAssetIds: string[];
  defaultName: string;
  brandColor: string;
}

export function BulkApproveButton({ reviewSlug, pendingAssetIds, defaultName, brandColor }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  if (pendingAssetIds.length < 2) return null;

  function approveAll() {
    setError(null);
    setProgress(0);
    start(async () => {
      try {
        for (let i = 0; i < pendingAssetIds.length; i++) {
          const r = await fetch("/api/review/approve", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              reviewSlug,
              assetId: pendingAssetIds[i],
              approverName: name.trim(),
              approverEmail: email.trim(),
            }),
          });
          if (!r.ok) throw new Error(await r.text());
          setProgress(i + 1);
        }
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          setDone(false);
          router.refresh();
        }, 800);
      } catch (e) {
        setError("Something failed. Refresh and approve the rest individually.");
        console.error(e);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        style={{ backgroundColor: brandColor }}
      >
        ✓ Approve all {pendingAssetIds.length} pending
      </button>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border-2 border-slate-200 bg-white p-4 shadow-md">
      <div className="text-sm font-semibold text-slate-900">
        Approve all {pendingAssetIds.length} pending items?
      </div>
      <p className="mt-1 text-xs text-slate-500">
        We&apos;ll record your name on each approval as proof.
      </p>
      <div className="mt-3 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional)"
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      {pending && (
        <div className="mt-3 text-xs text-slate-500">
          Approving {progress}/{pendingAssetIds.length}…
        </div>
      )}
      {done && <div className="mt-3 text-sm font-medium text-green-600">✓ All approved!</div>}
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={approveAll}
          disabled={pending || done || !name.trim()}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: brandColor }}
        >
          {pending ? "Approving…" : `Approve all ${pendingAssetIds.length}`}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={pending}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
