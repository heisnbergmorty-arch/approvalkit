"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { postAgencyReply } from "./actions";

export function AgencyReplyForm({
  assetId,
  projectId,
  assetLabel,
}: {
  assetId: string;
  projectId: string;
  assetLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function send() {
    if (!body.trim()) return;
    setError(null);
    start(async () => {
      try {
        await postAgencyReply(assetId, projectId, body);
        setBody("");
        setOpen(false);
        router.refresh();
      } catch {
        setError("Could not post.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] text-slate-400 hover:text-brand-600"
      >
        ↩ Reply
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">
      <textarea
        autoFocus
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder={`Reply to feedback on ${assetLabel} — your client will see this on the review page.`}
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
      />
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={pending || !body.trim()}
          className="rounded bg-brand-500 px-2 py-1 text-[11px] font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "Posting…" : "Post reply"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setBody("");
          }}
          className="text-[11px] text-slate-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
