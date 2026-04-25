"use client";

import { useState, useTransition } from "react";
import { sendTestEmail } from "./actions";

export function TestEmailButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function onClick() {
    setResult(null);
    start(async () => {
      const r = await sendTestEmail();
      setResult(
        r.ok
          ? `✓ Sent to ${r.to}`
          : `✗ ${r.error ?? "Failed"}`,
      );
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:border-slate-500 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send a test email to myself"}
      </button>
      {result && (
        <span className={result.startsWith("✓") ? "text-emerald-600" : "text-red-600"}>
          {result}
        </span>
      )}
    </div>
  );
}
