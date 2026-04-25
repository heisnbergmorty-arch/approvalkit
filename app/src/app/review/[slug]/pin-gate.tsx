"use client";

import { useState, useTransition } from "react";

export function ReviewPinGate({
  slug,
  brandColor,
  agencyName,
}: {
  slug: string;
  brandColor: string;
  agencyName: string;
}) {
  const [pin, setPin] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      setError("Enter your access PIN.");
      return;
    }
    setError(null);
    start(async () => {
      try {
        const r = await fetch(`/api/review/${slug}/unlock`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        if (r.status === 200) {
          window.location.reload();
          return;
        }
        setError("That PIN doesn't match. Ask the sender to confirm.");
      } catch {
        setError("Something failed. Try again.");
      }
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div
          className="mx-auto flex h-10 w-10 items-center justify-center rounded text-white text-lg"
          style={{ backgroundColor: brandColor }}
        >
          🔒
        </div>
        <h1 className="mt-4 text-xl font-semibold">Access required</h1>
        <p className="mt-2 text-sm text-slate-600">
          {agencyName} protected this review with a PIN. They&apos;ll have shared it with you in
          a separate message.
        </p>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="Access PIN"
          className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest"
        />
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending || pin.length < 4}
          className="mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: brandColor }}
        >
          {pending ? "Checking…" : "Unlock review"}
        </button>
      </form>
    </main>
  );
}
