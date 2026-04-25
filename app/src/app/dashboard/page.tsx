import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { agencies, projects, assets, approvals, comments } from "@/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, session.user.id),
  });

  if (!agency) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Welcome to ApprovalKit 👋</h1>
        <p className="mt-3 text-slate-600">
          Set up your agency profile to start sending review links.
        </p>
        <Link
          href="/dashboard/setup"
          className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600"
        >
          Set up agency
        </Link>
      </main>
    );
  }

  const projectList = await db.query.projects.findMany({
    where: eq(projects.agencyId, agency.id),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit: 50,
  });

  const projectIds = projectList.map((p) => p.id);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const stats = projectIds.length
    ? await getStats(projectIds, weekAgo)
    : { pending: 0, approvals: 0, comments: 0 };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{agency.name}</h1>
          <p className="text-sm text-slate-600">
            {projectList.length} active {projectList.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/settings"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-slate-500"
          >
            Settings
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600"
          >
            + New project
          </Link>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="Pending review" value={stats.pending} hint="awaiting client" />
        <StatCard label="Approvals this week" value={stats.approvals} hint="last 7 days" />
        <StatCard label="New comments" value={stats.comments} hint="from clients · 7d" />
      </div>

      <ul className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {projectList.length === 0 && (
          <li className="px-6 py-12 text-center text-slate-500">
            No projects yet. Create your first one to send a review link.
          </li>
        )}
        {projectList.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:text-brand-600">
                {p.name}
              </Link>
              <div className="text-sm text-slate-500">{p.clientName} · {p.clientEmail}</div>
            </div>
            <Link
              href={`/review/${p.reviewSlug}`}
              target="_blank"
              className="text-sm text-brand-600 hover:underline"
            >
              Open review link →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

async function getStats(projectIds: string[], since: Date) {
  const [pendingCount, approvals7d, comments7d] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(assets)
      .where(and(inArray(assets.projectId, projectIds), eq(assets.status, "pending"))),
    db.select({ n: sql<number>`count(*)::int` }).from(approvals)
      .innerJoin(assets, eq(assets.id, approvals.assetId))
      .where(and(inArray(assets.projectId, projectIds), gte(approvals.approvedAt, since))),
    db.select({ n: sql<number>`count(*)::int` }).from(comments)
      .innerJoin(assets, eq(assets.id, comments.assetId))
      .where(and(
        inArray(assets.projectId, projectIds),
        eq(comments.isFromAgency, false),
        gte(comments.createdAt, since),
      )),
  ]);
  return {
    pending: pendingCount[0]?.n ?? 0,
    approvals: approvals7d[0]?.n ?? 0,
    comments: comments7d[0]?.n ?? 0,
  };
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-400">{hint}</div>
    </div>
  );
}
