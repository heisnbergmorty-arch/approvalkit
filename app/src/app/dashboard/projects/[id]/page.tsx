import { requireAgency, appUrl } from "@/lib/session";
import { db } from "@/db/client";
import { projects, assets } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UploadAssetForm } from "./upload-form";
import { CopyButton } from "./copy-button";
import { ProjectActions } from "./project-actions";

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

  const reviewUrl = appUrl(`/review/${project.reviewSlug}`);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">← Dashboard</Link>

      <header className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-slate-600">{project.clientName} · {project.clientEmail}</p>
        </div>
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
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Upload work for review</h2>
        <UploadAssetForm projectId={project.id} />
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
            <li key={a.id} className="flex items-center justify-between px-6 py-4">
              <div>
                  {a.label}{" "}
                  <Link
                    href={`/dashboard/projects/${project.id}/compare/${encodeURIComponent(a.groupKey)}`}
                    className="ml-1 text-xs text-slate-400 hover:text-brand-600 hover:underline"
                  >
                    v{a.version} →
                  </Link>
                
                <div className="font-medium">{a.label} <span className="text-xs text-slate-400">v{a.version}</span></div>
                <div className="text-xs text-slate-500">{a.groupKey} · {a.mimeType}</div>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </section>
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
