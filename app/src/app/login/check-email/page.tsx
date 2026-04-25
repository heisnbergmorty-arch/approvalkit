import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white">
            ▰
          </span>
          ApprovalKit
        </Link>

        <div className="mt-10 w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">📬</div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="mt-3 text-slate-600">
            We&apos;ve sent a magic link to your inbox. Click it to sign in — link expires in 24 hours.
          </p>
          <ul className="mt-6 space-y-1 text-left text-xs text-slate-500">
            <li>• If nothing arrives in 1 minute, check spam.</li>
            <li>• Some inboxes hide it under &ldquo;Promotions&rdquo;.</li>
            <li>• Resend the link by going back to <Link href="/login" className="underline">sign in</Link> again.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
