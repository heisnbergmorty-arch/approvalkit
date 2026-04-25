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

  const [stats, perProject] = projectIds.length
    ? await Promise.all([
        getGlobalStats(projectIds, weekAgo),
        getPerProjectStats(projectIds),
      ])
    : [{ pending: 0, approvals: 0, comments: 0 }, new Map<string, ProjectMetric>()];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{agency.name}</h1>
          <p className="text-sm text-slate-600">
            {projectList.length} {projectList.length === 1 ? "project" : "projects"} · brand color
            <span
              className="ml-1 inline-block h-3 w-3 translate-y-0.5 rounded-full ring-1 ring-slate-200"
              style={{ backgroundColor: agency.brandColor ?? "#6366f1" }}
            />
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

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Pending review" value={stats.pending} hint="awaiting client" />
        <StatCard label="Approvals this week" value={stats.approvals} hint="last 7 days" />
        <StatCard label="New comments" value={stats.comments} hint="from clients · 7d" />
      </div>

      {projectList.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold">Create your first project</h2>
          <p className="mt-2 text-sm text-slate-600">
            A project = one chunk of work for one client. Generates a unique branded review link
            you can share — no signup required for your client.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600"
          >
            + Create your first project
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            Tip: also try the{" "}
            <Link href="/demo" className="underline">
              public demo
            </Link>{" "}
            to see what your clients will see.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {projectList.map((p) => {
            const m = perProject.get(p.id) ?? {
              total: 0,
              pending: 0,
              approved: 0,
              commentCount: 0,
              lastActivity: null,
            };
            const progress = m.total === 0 ? 0 : Math.round((m.approved / m.total) * 100);
            return (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="group block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 group-hover:text-brand-600 truncate">
                      {p.name}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">
                      {p.clientName} · {p.clientEmail}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      p.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs text-slate-600">
                  <span>
                    <span className="font-semibold text-slate-900">{m.total}</span> assets
                  </span>
                  <span>
                    <span className="font-semibold text-amber-700">{m.pending}</span> pending
                  </span>
                  <span>
                    <span className="font-semibold text-emerald-700">{m.approved}</span> approved
                  </span>
                  <span>
                    <span className="font-semibold text-slate-900">{m.commentCount}</span> comments
                  </span>
                </div>

                {m.total > 0 && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {m.lastActivity ? `Last activity ${timeAgo(m.lastActivity)}` : "No activity yet"}
                  </span>
                  <span className="text-brand-600 group-hover:underline">Open →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

interface ProjectMetric {
  total: number;
  pending: number;
  approved: number;
  commentCount: number;
  lastActivity: Date | null;
}

async function getGlobalStats(projectIds: string[], since: Date) {
  const [pendingCount, approvals7d, comments7d] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(assets)
      .where(and(inArray(assets.projectId, projectIds), eq(assets.status, "pending"))),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(approvals)
      .innerJoin(assets, eq(assets.id, approvals.assetId))
      .where(and(inArray(assets.projectId, projectIds), gte(approvals.approvedAt, since))),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(comments)
      .innerJoin(assets, eq(assets.id, comments.assetId))
      .where(
        and(
          inArray(assets.projectId, projectIds),
          eq(comments.isFromAgency, false),
          gte(comments.createdAt, since),
        ),
      ),
  ]);
  return {
    pending: pendingCount[0]?.n ?? 0,
    approvals: approvals7d[0]?.n ?? 0,
    comments: comments7d[0]?.n ?? 0,
  };
}

async function getPerProjectStats(projectIds: string[]): Promise<Map<string, ProjectMetric>> {
  const [assetRows, commentRows, approvalRows] = await Promise.all([
    db
      .select({
        projectId: assets.projectId,
        status: assets.status,
        createdAt: assets.createdAt,
      })
      .from(assets)
      .where(inArray(assets.projectId, projectIds)),
    db
      .select({
        projectId: assets.projectId,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .innerJoin(assets, eq(assets.id, comments.assetId))
      .where(inArray(assets.projectId, projectIds)),
    db
      .select({
        projectId: assets.projectId,
        approvedAt: approvals.approvedAt,
      })
      .from(approvals)
      .innerJoin(assets, eq(assets.id, approvals.assetId))
      .where(inArray(assets.projectId, projectIds)),
  ]);

  const map = new Map<string, ProjectMetric>();
  function get(id: string): ProjectMetric {
    let m = map.get(id);
    if (!m) {
      m = { total: 0, pending: 0, approved: 0, commentCount: 0, lastActivity: null };
      map.set(id, m);
    }
    return m;
  }
  function bump(id: string, ts: Date) {
    const m = get(id);
    if (!m.lastActivity || ts > m.lastActivity) m.lastActivity = ts;
  }
  for (const a of assetRows) {
    const m = get(a.projectId);
    m.total += 1;
    if (a.status === "approved") m.approved += 1;
    else m.pending += 1;
    bump(a.projectId, a.createdAt);
  }
  for (const c of commentRows) {
    const m = get(c.projectId);
    m.commentCount += 1;
    bump(c.projectId, c.createdAt);
  }
  for (const ap of approvalRows) {
    bump(ap.projectId, ap.approvedAt);
  }
  return map;
}

function timeAgo(d: Date): string {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
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
