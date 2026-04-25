"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl">😬</div>
      <h1 className="mt-4 text-2xl font-semibold">Something broke.</h1>
      <p className="mt-2 text-slate-600">
        We logged it. Try again, or head back to the dashboard.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-slate-400">ref: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Try again
        </button>
        <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-slate-500">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
