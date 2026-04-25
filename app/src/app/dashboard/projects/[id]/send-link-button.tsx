"use client";

import { useState, useTransition } from "react";
import { sendReviewLinkToClient } from "./actions";

export function SendLinkButton({ projectId, clientEmail }: { projectId: string; clientEmail: string }) {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function send() {
    if (!confirm(`Email the review link to ${clientEmail}?`)) return;
    setError(null);
    start(async () => {
      try {
        await sendReviewLinkToClient(projectId);
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      } catch (e) {
        setError("Send failed. Try again or copy the link manually.");
        console.error(e);
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={send}
        disabled={pending || sent}
        className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-60"
      >
        {sent ? "✓ Sent!" : pending ? "Sending…" : "✉ Email link to client"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
