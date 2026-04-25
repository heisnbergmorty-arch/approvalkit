import { db } from "@/db/client";
import { projects, assets, comments } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AssetReviewCard } from "./asset-card";
import { ReviewFilters } from "./review-filters";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ filter?: string }>;
}

export default async function ReviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const filterRaw = sp.filter ?? "all";
  const filter: "all" | "pending" | "approved" =
    filterRaw === "pending" || filterRaw === "approved" ? filterRaw : "all";

  const project = await db.query.projects.findFirst({
    where: eq(projects.reviewSlug, slug),
    with: { agency: true },
  });
  if (!project) notFound();

  const currentAssets = await db.query.assets.findMany({
    where: and(eq(assets.projectId, project.id), eq(assets.isCurrentVersion, true)),
    orderBy: [desc(assets.createdAt)],
  });

  const assetIds = currentAssets.map((a) => a.id);
  const allComments = assetIds.length
    ? await db.query.comments.findMany({
        where: inArray(comments.assetId, assetIds),
        orderBy: [desc(comments.createdAt)],
      })
    : [];
  const commentsByAsset = new Map<string, typeof allComments>();
  for (const c of allComments) {
    if (!commentsByAsset.has(c.assetId)) commentsByAsset.set(c.assetId, []);
    commentsByAsset.get(c.assetId)!.push(c);
  }

  const brandColor = project.agency.brandColor ?? "#6366f1";
  const counts = {
    all: currentAssets.length,
    pending: currentAssets.filter((a) => a.status !== "approved").length,
    approved: currentAssets.filter((a) => a.status === "approved").length,
  };
  const visibleAssets = currentAssets.filter((a) => {
    if (filter === "pending") return a.status !== "approved";
    if (filter === "approved") return a.status === "approved";
    return true;
  });
  const progressPct = counts.all === 0 ? 0 : Math.round((counts.approved / counts.all) * 100);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 font-semibold" style={{ color: brandColor }}>
            {project.agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.agency.logoUrl} alt={project.agency.name} className="h-7 w-7 rounded" />
            ) : (
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded text-white text-sm font-bold"
                style={{ backgroundColor: brandColor }}
              >
                {project.agency.name.charAt(0)}
              </span>
            )}
            {project.agency.name}
          </div>
          <div className="text-sm text-slate-500">{project.name}</div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Hi {project.clientName} 👋</h1>
            <p className="mt-2 text-slate-600">
              {counts.all === 0
                ? `${project.agency.name} hasn't uploaded any work yet. Check back soon.`
                : counts.pending > 0
                  ? `${counts.pending} ${counts.pending === 1 ? "item needs" : "items need"} your review.`
                  : "All caught up — every item is approved! 🎉"}
            </p>
          </div>
          {counts.all > 0 && (
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-500">Progress</div>
              <div className="text-2xl font-bold text-slate-900">
                {counts.approved} <span className="text-sm font-normal text-slate-500">/ {counts.all}</span>
              </div>
            </div>
          )}
        </div>

        {counts.all > 0 && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full transition-all"
              style={{ width: `${progressPct}%`, backgroundColor: brandColor }}
            />
          </div>
        )}

        {counts.all > 0 && (
          <ReviewFilters slug={slug} brandColor={brandColor} counts={counts} active={filter} />
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAssets.length === 0 && counts.all > 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No items in this filter.
            </div>
          )}
          {visibleAssets.map((a) => (
            <AssetReviewCard
              key={a.id}
              reviewSlug={slug}
              asset={{
                id: a.id,
                label: a.label,
                version: a.version,
                fileUrl: a.fileUrl,
                mimeType: a.mimeType,
                status: a.status,
              }}
              comments={(commentsByAsset.get(a.id) ?? []).map((c) => ({
                id: c.id,
                authorName: c.authorName,
                isFromAgency: c.isFromAgency,
                body: c.body,
                xPct: c.xPct,
                yPct: c.yPct,
                createdAt: c.createdAt,
              }))}
              brandColor={brandColor}
              defaultName={project.clientName}
            />
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-12 text-center text-xs text-slate-400">
        Powered by ApprovalKit
      </footer>
    </main>
  );
}
