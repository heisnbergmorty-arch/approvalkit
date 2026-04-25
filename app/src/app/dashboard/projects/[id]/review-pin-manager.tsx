"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReviewPin } from "./actions";

export function ReviewPinManager({
  projectId,
  defaultPin,
}: {
  projectId: string;
  defaultPin: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(defaultPin ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const router = useRouter();
  const hasPin = Boolean(defaultPin);

  function save(value: string | null) {
    setError(null);
    start(async () => {
      try {
        await updateReviewPin(projectId, value);
        setSavedAt(Date.now());
        setTimeout(() => setSavedAt(null), 2500);
        if (value === null) {
          setPin("");
          setOpen(false);
        }
        router.refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not save";
        setError(msg === "PIN_LENGTH" ? "PIN must be 4–8 digits." : msg);
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">Review-link PIN</div>
          <p className="mt-0.5 text-xs text-slate-500">
            {hasPin
              ? "PIN is required before clients can view this project. Share it separately from the link."
              : "By default, anyone with the review link can view it. Set a 4–8 digit PIN to require an extra step."}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            hasPin
              ? "bg-emerald-100 text-emerald-700"
              : "border border-slate-200 text-slate-500"
          }`}
        >
          {hasPin ? "PIN ON" : "open"}
        </span>
      </div>

      {!open && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:border-slate-500"
          >
            {hasPin ? "Change PIN" : "+ Add PIN protection"}
          </button>
          {hasPin && (
            <button
              type="button"
              onClick={() => save(null)}
              disabled={pending}
              className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove PIN
            </button>
          )}
          {savedAt && (
            <span className="self-center text-[11px] text-emerald-600">✓ saved</span>
          )}
        </div>
      )}

      {open && (
        <div className="mt-3 space-y-2">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="4–8 digit PIN"
            className="w-40 rounded-md border border-slate-300 px-3 py-1.5 text-base tracking-widest"
          />
          {error && <p className="text-[11px] text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => save(pin)}
              disabled={pending || pin.length < 4}
              className="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save PIN"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setPin(defaultPin ?? "");
                setError(null);
              }}
              className="text-xs text-slate-500"
            >
              Cancel
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Send the PIN to your client by chat or a separate email — never in the same message
            as the link.
          </p>
        </div>
      )}
    </div>
  );
}
