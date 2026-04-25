import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white">
          ▰
        </span>
        ApprovalKit
      </Link>

      <div className="mt-10 text-7xl">🪁</div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Lost the trail.</h1>
      <p className="mt-3 text-slate-600">
        That page doesn&apos;t exist — or your review link expired. If a designer sent it, ask them
        for a fresh one.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          ← Home
        </Link>
        <Link
          href="/demo"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-500"
        >
          Try the demo
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-500"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
