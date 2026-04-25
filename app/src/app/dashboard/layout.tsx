import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-brand-500 text-white text-sm">
              ▰
            </span>
            ApprovalKit
          </Link>
          <div className="hidden items-center gap-5 text-sm text-slate-600 sm:flex">
            <Link href="/dashboard" className="hover:text-slate-900">
              Projects
            </Link>
            <Link href="/dashboard/activity" className="hover:text-slate-900">
              Activity
            </Link>
            <Link href="/dashboard/settings" className="hover:text-slate-900">
              Settings
            </Link>
            <Link href="/dashboard/billing" className="hover:text-slate-900">
              Billing
            </Link>
            <Link href="/demo" target="_blank" className="hover:text-slate-900">
              View demo ↗
            </Link>
            <Link href="/roadmap" className="hover:text-slate-900">
              Roadmap
            </Link>
            <Link href="/changelog" className="hover:text-slate-900">
              Changelog
            </Link>
            <Link href="/help" className="hover:text-slate-900">
              Help
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
