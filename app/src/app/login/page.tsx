"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await signIn("resend", { email, redirectTo: "/dashboard" });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white">
            ▰
          </span>
          ApprovalKit
        </Link>

        <div className="mt-10 w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            We&apos;ll email you a magic link. No password, nothing to remember.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              autoFocus
              placeholder="you@youragency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-700">
              terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="underline hover:text-slate-700">
              privacy
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have access yet?{" "}
          <a
            href="https://heisnberg4.gumroad.com/l/tneacr"
            className="font-semibold text-brand-600 hover:underline"
          >
            Get lifetime access — $149 →
          </a>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Want to see it first?{" "}
          <Link href="/demo" className="underline hover:text-slate-600">
            Try the live demo
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
