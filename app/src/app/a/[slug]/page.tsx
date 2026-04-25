import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, count, desc, and } from "drizzle-orm";
import { db } from "@/db/client";
import { agencies, projects, assets, approvals } from "@/db/schema";

export const revalidate = 300; // 5min CDN cache so it's effectively free traffic

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.slug, slug),
  });
  if (!agency) return { title: "Agency not found" };
  return {
    title: `${agency.name} — Client review hub`,
    description: `${agency.name} uses ApprovalKit to collect feedback and approvals from clients in one place.`,
    openGraph: {
      title: `${agency.name} on ApprovalKit`,
      description: `Client review hub for ${agency.name}.`,
    },
  };
}

export default async function PublicAgencyPage({ params }: PageProps) {
  const { slug } = await params;
  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.slug, slug),
  });
  if (!agency) notFound();

  const [projectCountRow, assetCountRow, approvalCountRow, latestProjects] = await Promise.all([
    db
      .select({ n: count() })
      .from(projects)
      .where(eq(projects.agencyId, agency.id)),
    db
      .select({ n: count() })
      .from(assets)
      .innerJoin(projects, eq(assets.projectId, projects.id))
      .where(eq(projects.agencyId, agency.id)),
    db
      .select({ n: count() })
      .from(approvals)
      .innerJoin(assets, eq(approvals.assetId, assets.id))
      .innerJoin(projects, eq(assets.projectId, projects.id))
      .where(eq(projects.agencyId, agency.id)),
    db.query.projects.findMany({
      where: and(eq(projects.agencyId, agency.id), eq(projects.status, "active")),
      orderBy: [desc(projects.createdAt)],
      limit: 6,
      columns: { id: true, name: true, clientName: true, createdAt: true },
    }),
  ]);

  const brand = agency.brandColor ?? "#6366f1";
  const initial = (agency.name?.[0] ?? "A").toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="flex flex-col items-center text-center">
          {agency.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agency.logoUrl}
              alt={agency.name}
              className="h-20 w-20 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-sm"
              style={{ background: brand }}
            >
              {initial}
            </div>
          )}
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
            {agency.name}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">
            Client review hub. We share visuals, you tap approve. No logins, no chasing.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-3 gap-3">
          <Stat label="Projects" value={projectCountRow[0]?.n ?? 0} />
          <Stat label="Deliverables shipped" value={assetCountRow[0]?.n ?? 0} />
          <Stat label="Approvals collected" value={approvalCountRow[0]?.n ?? 0} />
        </section>

        {latestProjects.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recent work
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {latestProjects.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Client: {p.clientName}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            Are you a client of <b>{agency.name}</b>? They&rsquo;ll send you a private review link
            by email when there&rsquo;s work ready.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Powered by{" "}
            <Link href="/" className="font-medium text-brand-600 hover:underline">
              ApprovalKit
            </Link>
            {" "}— the lightweight client approval tool for studios.
          </p>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}
