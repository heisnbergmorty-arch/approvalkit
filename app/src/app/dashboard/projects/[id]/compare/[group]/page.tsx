import { requireAgency, appUrl } from "@/lib/session";
import { db } from "@/db/client";
import { projects, assets } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props { params: Promise<{ id: string; group: string }> }

/**
 * Side-by-side comparison of all versions of one asset group.
 * E.g. /dashboard/projects/<id>/compare/logo-concepts shows v1, v2, v3.
 */
export default async function CompareVersions({ params }: Props) {
  const { id, group } = await params;
  const groupKey = decodeURIComponent(group);
  const { agency } = await requireAgency();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.agencyId, agency.id)),
  });
  if (!project) notFound();

  const versions = await db.query.assets.findMany({
    where: and(eq(assets.projectId, project.id), eq(assets.groupKey, groupKey)),
    orderBy: [asc(assets.version)],
  });

  if (versions.length === 0) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href={`/dashboard/projects/${project.id}`} className="text-sm text-slate-500 hover:text-slate-800">
        ← {project.name}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold">
        Version history: <span className="text-slate-500">{groupKey}</span>
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {versions.length} version{versions.length === 1 ? "" : "s"} ·
        Client sees only the current version on{" "}
        <a href={appUrl(`/review/${project.reviewSlug}`)} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
          the review portal
        </a>.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {versions.map((v) => (
          <div key={v.id} className={`overflow-hidden rounded-xl border bg-white ${v.isCurrentVersion ? "border-brand-500 ring-2 ring-brand-500/20" : "border-slate-200"}`}>
            <div className="aspect-video bg-slate-100">
              {v.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.fileUrl} alt={v.label} className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  📄 {v.mimeType}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">v{v.version} — {v.label}</div>
                <div className="text-xs text-slate-500">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      v.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : v.status === "changes_requested"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {v.status === "changes_requested" ? "changes req." : v.status}
                  </span>
                  <a
                    href={v.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-500 underline hover:text-slate-700"
                  >
                    Open file
                  </a>
                </div>
              </div>
              {v.isCurrentVersion && (
                <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  current
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
