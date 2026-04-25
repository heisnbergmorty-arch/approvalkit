import { requireAgency, appUrl } from "@/lib/session";
import { db } from "@/db/client";
import { projects, assets, comments, approvals } from "@/db/schema";
import { and, eq, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UploadAssetForm } from "./upload-form";
import { CopyButton } from "./copy-button";
import { ProjectActions } from "./project-actions";
import { SendLinkButton } from "./send-link-button";
import { AssetNote } from "./asset-note";
import { DeleteAssetButton } from "./delete-asset-button";
import { NotifyModeSelector } from "./notify-mode-selector";
import { EditableProjectHeader } from "./editable-project-header";
import { ResolveToggle } from "./resolve-toggle";
import { AgencyReplyForm } from "./agency-reply-form";
import { ReviewPinManager } from "./review-pin-manager";

interface Props { params: Promise<{ id: string }> }

export default async function ProjectDetail({ params }: Props) {
  const { id } = await params;
  const { agency } = await requireAgency();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.agencyId, agency.id)),
  });
  if (!project) notFound();

  const assetList = await db.query.assets.findMany({
    where: eq(assets.projectId, project.id),
    orderBy: [desc(assets.createdAt)],
  });

  const assetIds = assetList.map((a) => a.id);
  const [commentRows, approvalRows] = assetIds.length
    ? await Promise.all([
        db
          .select({
            id: comments.id,
            assetId: comments.assetId,
            isFromAgency: comments.isFromAgency,
            authorName: comments.authorName,
            body: comments.body,
            resolved: comments.resolved,
            createdAt: comments.createdAt,
          })
          .from(comments)
          .where(inArray(comments.assetId, assetIds)),
        db
          .select({
            id: approvals.id,
            assetId: approvals.assetId,
            approverName: approvals.approverName,
            approvedAt: approvals.approvedAt,
          })
          .from(approvals)
          .where(inArray(approvals.assetId, assetIds)),
      ])
    : [[], []];

  const insights = computeInsights(
    assetList,
    commentRows.map((c) => ({ id: c.id, assetId: c.assetId, isFromAgency: c.isFromAgency, createdAt: c.createdAt })),
    approvalRows.map((a) => ({ id: a.id, assetId: a.assetId, approvedAt: a.approvedAt })),
  );

  const assetById = new Map(assetList.map((a) => [a.id, a]));
  type TimelineEntry =
    | { kind: "upload"; at: Date; assetId: string; label: string; version: number }
    | { kind: "comment"; at: Date; assetId: string; commentId: string; resolved: boolean; label: string; version: number; author: string; isFromAgency: boolean; body: string }
    | { kind: "approval"; at: Date; assetId: string; label: string; version: number; approver: string };
  const timeline: TimelineEntry[] = [
    ...assetList.map<TimelineEntry>((a) => ({
      kind: "upload" as const,
      at: a.createdAt,
      assetId: a.id,
      label: a.label,
      version: a.version,
    })),
    ...commentRows.map<TimelineEntry | null>((c) => {
      const a = assetById.get(c.assetId);
      if (!a) return null;
      return {
        kind: "comment" as const,
        at: c.createdAt,
        assetId: c.assetId,
        commentId: c.id,
        resolved: c.resolved,
        label: a.label,
        version: a.version,
        author: c.authorName,
        isFromAgency: c.isFromAgency,
        body: c.body,
      };
    }).filter((x): x is TimelineEntry => x !== null),
    ...approvalRows.map<TimelineEntry | null>((ap) => {
      const a = assetById.get(ap.assetId);
      if (!a) return null;
      return {
        kind: "approval" as const,
        at: ap.approvedAt,
        assetId: ap.assetId,
        label: a.label,
        version: a.version,
        approver: ap.approverName,
      };
    }).filter((x): x is TimelineEntry => x !== null),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const reviewUrl = appUrl(`/review/${project.reviewSlug}`);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">← Dashboard</Link>

      <header className="mt-4 flex items-start justify-between gap-4">
        <EditableProjectHeader
          projectId={project.id}
          name={project.name}
          clientName={project.clientName}
          clientEmail={project.clientEmail}
          description={project.description}
        />
        <ProjectActions projectId={project.id} status={project.status} />
      </header>

      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Client review link</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="flex-1 break-all rounded-lg bg-white px-3 py-2 text-sm">{reviewUrl}</code>
          <CopyButton text={reviewUrl} />
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-slate-500"
          >
            Open ↗
          </a>
          <a
            href={`/api/projects/${project.id}/export.csv`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-slate-500"
            title="Download timestamped log of every comment and approval — useful for invoicing and scope-creep disputes."
          >
            ⬇ Export approval log (CSV)
          </a>
        </div>
        <div className="mt-3">
          <SendLinkButton projectId={project.id} clientEmail={project.clientEmail} />
        </div>
      </section>

      {assetList.length > 0 && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Insight label="Assets" value={String(insights.totalAssets)} hint={`${insights.approvedAssets} approved`} />
          <Insight label="Comments" value={String(insights.commentCount)} hint={`${insights.clientComments} from client`} />
          <Insight
            label="Avg approval time"
            value={insights.avgApprovalDays === null ? "—" : `${insights.avgApprovalDays.toFixed(1)}d`}
            hint="upload → approval"
          />
          <Insight
            label="Most discussed"
            value={insights.mostDiscussedLabel ?? "—"}
            hint={
              insights.mostDiscussedCount
                ? `${insights.mostDiscussedCount} comment${insights.mostDiscussedCount === 1 ? "" : "s"}`
                : "no comments yet"
            }
            small
          />
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Upload work for review</h2>
        <UploadAssetForm projectId={project.id} />
      </section>

      <section className="mt-8">
        <NotifyModeSelector
          projectId={project.id}
          defaultMode={project.notifyMode}
        />
      </section>

      <section className="mt-4">
        <ReviewPinManager projectId={project.id} defaultPin={project.reviewPin} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Assets ({assetList.length})</h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {assetList.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-slate-500">
              No assets yet. Upload your first file above.
            </li>
          )}
          {assetList.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-6 py-4">
              {a.mimeType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.fileUrl}
                  alt={a.label}
                  className="h-14 w-14 flex-none rounded-md border border-slate-200 bg-slate-50 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-2xl">
                  📄
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {a.label}{" "}
                  <Link
                    href={`/dashboard/projects/${project.id}/compare/${encodeURIComponent(a.groupKey)}`}
                    className="ml-1 text-xs text-slate-400 hover:text-brand-600 hover:underline"
                  >
                    v{a.version} →
                  </Link>
                </div>
                <div className="truncate text-xs text-slate-500">
                  {a.groupKey} · {a.mimeType}
                </div>
                <AssetNote
                  assetId={a.id}
                  projectId={project.id}
                  defaultNote={a.internalNote}
                />
              </div>
              <a
                href={a.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden text-xs text-slate-400 hover:text-brand-600 hover:underline sm:inline"
              >
                Open ↗
              </a>
              <StatusBadge status={a.status} />
              <DeleteAssetButton
                assetId={a.id}
                projectId={project.id}
                label={a.label}
              />
            </li>
          ))}
        </ul>
      </section>

      {timeline.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Project changelog</h2>
          <p className="mt-1 text-xs text-slate-500">
            Every upload, comment, and approval in chronological order. Share-friendly proof of the
            full conversation.
          </p>
          <ol className="mt-4 space-y-2">
            {timeline.slice(0, 30).map((e, i) => (
              <li
                key={`${e.kind}-${e.assetId}-${i}`}
                className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
              >
                <span className="mt-0.5 text-base">
                  {e.kind === "approval" ? "✅" : e.kind === "comment" ? "💬" : "⬆"}
                </span>
                <div className="min-w-0 flex-1">
                  {e.kind === "upload" && (
                    <div>
                      <span className="font-medium">{e.label}</span>{" "}
                      <span className="text-slate-500">v{e.version} uploaded</span>
                    </div>
                  )}
                  {e.kind === "comment" && (
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span>
                          <span className="font-medium">{e.author}</span>
                          {e.isFromAgency && (
                            <span className="ml-1 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium uppercase text-brand-700">
                              you
                            </span>
                          )}{" "}
                          <span className="text-slate-500">on</span>{" "}
                          <span className="font-medium">{e.label}</span>{" "}
                          <span className="text-xs text-slate-400">v{e.version}</span>
                        </span>
                        {!e.isFromAgency && (
                          <ResolveToggle
                            commentId={e.commentId}
                            projectId={project.id}
                            resolved={e.resolved}
                          />
                        )}
                      </div>
                      <blockquote
                        className={`mt-1 border-l-2 pl-2 ${e.resolved ? "border-emerald-200 text-slate-400 line-through" : "border-slate-200 text-slate-600"}`}
                      >
                        {e.body.length > 200 ? e.body.slice(0, 200) + "…" : e.body}
                      </blockquote>
                      {!e.isFromAgency && (
                        <AgencyReplyForm
                          assetId={e.assetId}
                          projectId={project.id}
                          assetLabel={e.label}
                        />
                      )}
                    </div>
                  )}
                  {e.kind === "approval" && (
                    <div>
                      <span className="font-medium">{e.approver}</span>{" "}
                      <span className="text-slate-500">approved</span>{" "}
                      <span className="font-medium">{e.label}</span>{" "}
                      <span className="text-xs text-slate-400">v{e.version}</span>
                    </div>
                  )}
                  <div className="mt-1 text-[11px] text-slate-400">
                    {e.at.toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {timeline.length > 30 && (
            <p className="mt-3 text-xs text-slate-400">
              Showing 30 most recent of {timeline.length} events. Download the CSV above for the
              full history.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-600",
    approved: "bg-emerald-100 text-emerald-700",
    changes_requested: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function Insight({
  label,
  value,
  hint,
  small,
}: {
  label: string;
  value: string;
  hint: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-bold text-slate-900 ${small ? "truncate text-base" : "text-2xl"}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{hint}</div>
    </div>
  );
}

interface AssetSlim {
  id: string;
  label: string;
  status: string;
  createdAt: Date;
}
interface CommentSlim {
  id: string;
  assetId: string;
  isFromAgency: boolean;
  createdAt: Date;
}
interface ApprovalSlim {
  id: string;
  assetId: string;
  approvedAt: Date;
}

function computeInsights(
  assetList: AssetSlim[],
  commentRows: CommentSlim[],
  approvalRows: ApprovalSlim[],
) {
  const totalAssets = assetList.length;
  const approvedAssets = assetList.filter((a) => a.status === "approved").length;
  const commentCount = commentRows.length;
  const clientComments = commentRows.filter((c) => !c.isFromAgency).length;

  // Avg approval time (days from asset.createdAt → first approval)
  const firstApprovalByAsset = new Map<string, Date>();
  for (const a of approvalRows) {
    const cur = firstApprovalByAsset.get(a.assetId);
    if (!cur || a.approvedAt < cur) firstApprovalByAsset.set(a.assetId, a.approvedAt);
  }
  const durations: number[] = [];
  for (const a of assetList) {
    const ap = firstApprovalByAsset.get(a.id);
    if (ap) {
      const days = (ap.getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (days >= 0) durations.push(days);
    }
  }
  const avgApprovalDays =
    durations.length > 0
      ? durations.reduce((s, n) => s + n, 0) / durations.length
      : null;

  // Most-discussed asset
  const counts = new Map<string, number>();
  for (const c of commentRows) counts.set(c.assetId, (counts.get(c.assetId) ?? 0) + 1);
  let topId: string | null = null;
  let topCount = 0;
  for (const [id, n] of counts) {
    if (n > topCount) {
      topCount = n;
      topId = id;
    }
  }
  const mostDiscussedLabel = topId ? assetList.find((a) => a.id === topId)?.label ?? null : null;

  return {
    totalAssets,
    approvedAssets,
    commentCount,
    clientComments,
    avgApprovalDays,
    mostDiscussedLabel,
    mostDiscussedCount: topCount,
  };
}
