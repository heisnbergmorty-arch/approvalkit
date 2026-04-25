import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">ApprovalKit</h1>
      <p className="mt-4 text-lg text-slate-600">
        Get design approvals in 1 day, not 1 week.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:border-slate-500"
        >
          Dashboard
        </Link>
      </div>
      <p className="mt-12 text-sm text-slate-500">
        Self-hosted ApprovalKit instance. See <code>/site/index.html</code> for the marketing landing page.
      </p>
    </main>
  );
}
