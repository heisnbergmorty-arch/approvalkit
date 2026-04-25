import Link from "next/link";

export const metadata = {
  title: "Get access — ApprovalKit",
  description: "ApprovalKit is paid access. Get lifetime access to log in.",
};

export default function NotPaidPage() {
  const gumroadUrl = process.env.NEXT_PUBLIC_GUMROAD_URL || "https://gumroad.com/l/approvalkit";

  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">This email isn&apos;t on the access list yet</h1>
      <p className="mt-3 text-slate-600">
        ApprovalKit is paid access. Once you complete checkout on Gumroad, the email
        you used will be auto-allowed within a few seconds. Then come back here and
        request another magic link.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href={gumroadUrl}
          className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
        >
          Get access on Gumroad →
        </a>
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
          Already paid? Try logging in again
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Used a different email at Gumroad? Forward your receipt to
        heisnbergmorty@gmail.com and we&apos;ll allowlist it manually.
      </p>
    </main>
  );
}
