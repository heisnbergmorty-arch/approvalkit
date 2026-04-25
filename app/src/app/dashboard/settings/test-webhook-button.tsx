"use client";

import { useState, useTransition } from "react";
import { testWebhook } from "./actions";

export function TestWebhookButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { kind: "idle" }
    | { kind: "ok"; status?: number }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => {
          setResult({ kind: "idle" });
          startTransition(async () => {
            const r = await testWebhook();
            if (r.ok) setResult({ kind: "ok", status: r.status });
            else setResult({ kind: "err", message: r.error ?? `HTTP ${r.status}` });
          });
        }}
        disabled={pending}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:border-slate-500 disabled:opacity-50"
      >
        {pending ? "Sending test ping…" : "Send test ping"}
      </button>
      {result.kind === "ok" && (
        <span className="ml-3 text-xs text-emerald-700">
          ✓ Delivered (HTTP {result.status ?? 200})
        </span>
      )}
      {result.kind === "err" && (
        <span className="ml-3 text-xs text-red-600">✗ {result.message}</span>
      )}
    </div>
  );
}
