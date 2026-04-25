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
  createdAt: string | Date;
}

interface Props {
  reviewSlug: string;
  asset: Asset;
  comments: Comment[];
  brandColor: string;
  defaultName: string;
}

export function AssetReviewCard({ reviewSlug, asset, comments, brandColor, defaultName }: Props) {
  const [name, setName] = useState(defaultName);
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isImage = asset.mimeType.startsWith("image/");

  function approve() {
    if (!name.trim()) { setError("Please add your name first."); return; }
    setError(null);
    start(async () => {
      const res = await fetch("/api/review/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewSlug, assetId: asset.id, approverName: name.trim() }),
      });
      if (!res.ok) { setError("Could not approve. Try again."); return; }
      router.refresh();
    });
  }

  function comment() {
    if (!name.trim() || !body.trim()) { setError("Name and feedback required."); return; }
    setError(null);
    start(async () => {
      const res = await fetch("/api/review/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewSlug, assetId: asset.id, authorName: name.trim(), body: body.trim() }),
      });
      if (!res.ok) { setError("Could not send. Try again."); return; }
      setBody("");
      router.refresh();
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.fileUrl} alt={asset.label} className="aspect-video w-full bg-slate-100 object-contain" />
      ) : (
        <a
          href={asset.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-video w-full items-center justify-center bg-slate-100 text-sm text-slate-600 hover:bg-slate-200"
        >
          📄 Open {asset.label}
        </a>
      )}

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{asset.label}</div>
            <div className="text-xs text-slate-500">v{asset.version}</div>
          </div>
          <StatusBadge status={asset.status} />
        </div>

        {asset.status !== "approved" && (
          <div className="mt-4 space-y-2">
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={approve}
                disabled={pending}
                style={{ background: brandColor }}
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                ✓ Approve
              </button>
            </div>
            <textarea
              rows={3} value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Or leave specific feedback…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              onClick={comment}
              disabled={pending || !body.trim()}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-500 disabled:opacity-60"
            >
              💬 Send feedback
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}

        {comments.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg p-3 text-sm ${c.isFromAgency ? "bg-indigo-50" : "bg-slate-50"}`}
              >
                <div className="text-xs font-semibold">
                  {c.authorName} {c.isFromAgency && <span className="text-indigo-600">· team</span>}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{c.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
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
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
