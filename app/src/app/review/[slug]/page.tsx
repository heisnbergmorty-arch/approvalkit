import { db } from "@/db/client";
import { projects, assets, comments } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AssetReviewCard } from "./asset-card";

interface Props { params: Promise<{ slug: string }> }

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;

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
  const pending = currentAssets.filter((a) => a.status !== "approved").length;

  return (
    <main className="min-h-screen bg-slate-50" style={{ ["--brand-500" as string]: brandColor }}>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 font-semibold" style={{ color: brandColor }}>
            {project.agency.logoUrl
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={project.agency.logoUrl} alt={project.agency.name} className="h-7 w-7 rounded" />
              : <span>▰</span>}
            {project.agency.name}
          </div>
          <div className="text-sm text-slate-500">{project.name}</div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Hi {project.clientName} 👋</h1>
        <p className="mt-2 text-slate-600">
          {pending > 0
            ? `${pending} ${pending === 1 ? "item needs" : "items need"} your review.`
            : "All caught up — no items need your review right now."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentAssets.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              {project.agency.name} hasn't uploaded any work yet. Check back soon.
            </div>
          )}
          {currentAssets.map((a) => (
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
