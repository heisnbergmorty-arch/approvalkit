"use client";

import { useState, useTransition } from "react";
import { sendReviewLinkToClient } from "./actions";

export function SendLinkButton({ projectId, clientEmail }: { projectId: string; clientEmail: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function send() {
    setError(null);
    start(async () => {
      try {
        await sendReviewLinkToClient(projectId, message || undefined);
        setSent(true);
        setOpen(false);
        setMessage("");
        setTimeout(() => setSent(false), 4000);
      } catch (e) {
        setError("Send failed. Try again or copy the link manually.");
        console.error(e);
      }
    });
  }

  if (!open) {
    return (
      <div className="inline-flex flex-col items-end">
        <button
          onClick={() => setOpen(true)}
          disabled={pending || sent}
          className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-60"
        >
          {sent ? "✓ Sent!" : "✉ Email link to client"}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-3 text-left">
      <div className="text-xs font-medium text-slate-700">
        Send review link to <span className="font-semibold">{clientEmail}</span>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Optional message — overrides your default email intro for this send. e.g. 'Round 2 is ready — focused on the homepage hero you flagged.'"
        className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
      />
      <p className="mt-1 text-[11px] text-slate-400">
        {message.length}/500 · leave blank to use your default opener.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={send}
          disabled={pending}
          className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send email"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setMessage("");
            setError(null);
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
