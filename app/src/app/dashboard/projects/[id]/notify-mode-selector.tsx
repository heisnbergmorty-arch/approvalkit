"use client";

import { useState, useTransition } from "react";
import { updateProjectNotifyMode } from "./actions";

type Mode = "instant" | "digest" | "off";

const labels: Record<Mode, string> = {
  instant: "Instant",
  digest: "Daily digest",
  off: "Off",
};

const hints: Record<Mode, string> = {
  instant: "Email me the moment a client comments or approves.",
  digest: "Roll up to one daily summary email.",
  off: "Don't email me about this project. (Webhooks still fire.)",
};

export function NotifyModeSelector({
  projectId,
  defaultMode,
}: {
  projectId: string;
  defaultMode: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function pick(m: Mode) {
    if (m === mode) return;
    const prev = mode;
    setMode(m);
    start(async () => {
      const r = await updateProjectNotifyMode(projectId, m);
      if (r.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
      } else {
        setMode(prev);
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900">Notifications for this project</div>
        {saved && <span className="text-xs text-emerald-600">✓ saved</span>}
      </div>
      <div className="mt-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        {(Object.keys(labels) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => pick(m)}
            disabled={pending}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              mode === m
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {labels[m]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">{hints[mode]}</p>
    </div>
  );
}
