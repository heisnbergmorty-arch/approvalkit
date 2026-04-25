import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db/client";
import { agencies, projects, assets, comments, approvals } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";

export const metadata = { title: "Activity" };

interface Props {
  searchParams: Promise<{ q?: string; kind?: string; project?: string }>;
}

export default async function ActivityPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const kindFilter = sp.kind === "comment" || sp.kind === "approval" || sp.kind === "upload" ? sp.kind : "";
  const projectFilter = (sp.project ?? "").trim();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, session.user.id),
  });
  if (!agency) redirect("/dashboard/setup");

  const projectRows = await db.query.projects.findMany({
    where: eq(projects.agencyId, agency.id),
  });
  const projectIds = projectRows.map((p) => p.id);
  const projectById = new Map(projectRows.map((p) => [p.id, p]));

  if (projectIds.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Activity</h1>
        <p className="mt-3 text-sm text-slate-500">
          No projects yet —{" "}
          <Link href="/dashboard/projects/new" className="text-brand-600 underline">
            create your first
          </Link>{" "}
          and the feed will fill in.
        </p>
      </main>
    );
  }

  const [commentRows, approvalRows, assetRows] = await Promise.all([
    db
      .select({
        id: comments.id,
        body: comments.body,
        authorName: comments.authorName,
        isFromAgency: comments.isFromAgency,
        createdAt: comments.createdAt,
        assetId: comments.assetId,
        assetLabel: assets.label,
        projectId: assets.projectId,
      })
      .from(comments)
      .innerJoin(assets, eq(assets.id, comments.assetId))
      .where(inArray(assets.projectId, projectIds))
      .orderBy(desc(comments.createdAt))
      .limit(40),
    db
      .select({
        id: approvals.id,
        approvedAt: approvals.approvedAt,
        approverName: approvals.approverName,
        assetId: approvals.assetId,
        assetLabel: assets.label,
        projectId: assets.projectId,
      })
      .from(approvals)
      .innerJoin(assets, eq(assets.id, approvals.assetId))
      .where(inArray(assets.projectId, projectIds))
      .orderBy(desc(approvals.approvedAt))
      .limit(40),
    db
      .select({
        id: assets.id,
        label: assets.label,
        version: assets.version,
        createdAt: assets.createdAt,
        projectId: assets.projectId,
      })
      .from(assets)
      .where(inArray(assets.projectId, projectIds))
      .orderBy(desc(assets.createdAt))
      .limit(40),
  ]);

  type Event = {
    id: string;
    kind: "comment" | "approval" | "upload";
    at: Date;
    projectId: string;
    label: string;
    detail: string;
    actor: string;
  };

  const events: Event[] = [
    ...commentRows.map<Event>((c) => ({
      id: `c-${c.id}`,
      kind: "comment",
      at: c.createdAt,
      projectId: c.projectId,
      label: c.assetLabel,
      detail: c.body.length > 140 ? c.body.slice(0, 140) + "…" : c.body,
      actor: c.isFromAgency ? `${c.authorName} (you)` : c.authorName,
    })),
    ...approvalRows.map<Event>((a) => ({
      id: `a-${a.id}`,
      kind: "approval",
      at: a.approvedAt,
      projectId: a.projectId,
      label: a.assetLabel,
      detail: "Approved",
      actor: a.approverName,
    })),
    ...assetRows.map<Event>((u) => ({
      id: `u-${u.id}`,
      kind: "upload",
      at: u.createdAt,
      projectId: u.projectId,
      label: u.label,
      detail: `Uploaded v${u.version}`,
      actor: "you",
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime());

  const filtered = events.filter((e) => {
    if (kindFilter && e.kind !== kindFilter) return false;
    if (projectFilter && e.projectId !== projectFilter) return false;
    if (q) {
      const p = projectById.get(e.projectId);
      const hay = `${e.actor} ${e.label} ${e.detail} ${p?.name ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).slice(0, 80);

  const hasFilter = Boolean(q || kindFilter || projectFilter);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Activity</h1>
      <p className="mt-1 text-sm text-slate-500">
        Most recent comments, approvals, and uploads across all your projects.
      </p>

      <form className="mt-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search text, actor, asset, project…"
          className="flex-1 min-w-[180px] rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <select
          name="kind"
          defaultValue={kindFilter}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">All events</option>
          <option value="comment">Comments</option>
          <option value="approval">Approvals</option>
          <option value="upload">Uploads</option>
        </select>
        <select
          name="project"
          defaultValue={projectFilter}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">All projects</option>
          {projectRows.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Filter
        </button>
        {hasFilter && (
          <Link
            href="/dashboard/activity"
            className="flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            Clear
          </Link>
        )}
      </form>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          {hasFilter ? "No events match those filters." : "Quiet so far. Send a review link and feedback will land here."}
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {filtered.map((e) => {
            const project = projectById.get(e.projectId);
            return (
              <li
                key={e.id}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="mt-0.5 text-lg">
                  {e.kind === "approval" ? "✓" : e.kind === "comment" ? "💬" : "⬆"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-slate-500">on</span>{" "}
                    <span className="font-medium">{e.label}</span>
                    {project && (
                      <>
                        {" "}
                        <span className="text-slate-400">·</span>{" "}
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-brand-600 hover:underline"
                        >
                          {project.name}
                        </Link>
                      </>
                    )}
                  </div>
                  {e.kind === "comment" ? (
                    <blockquote className="mt-1 border-l-2 border-slate-200 pl-2 text-sm text-slate-600">
                      {e.detail}
                    </blockquote>
                  ) : (
                    <div className="mt-0.5 text-xs text-slate-500">{e.detail}</div>
                  )}
                  <div className="mt-1 text-[11px] text-slate-400">{timeAgo(e.at)}</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
