import { db } from "@/db/client";
import { agencies, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props { params: Promise<{ host: string }> }

/**
 * Branded landing page rendered when an agency points their custom domain
 * at this app. Looks up the agency by `customDomain` and shows their logo,
 * brand color, and a "Find your project" search box.
 */
export default async function AgencyPortal({ params }: Props) {
  const { host } = await params;
  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.customDomain, host),
  });
  if (!agency) notFound();

  const recent = await db.query.projects.findMany({
    where: eq(projects.agencyId, agency.id),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit: 5,
  });

  const brand = agency.brandColor ?? "#6366f1";

  return (
    <main className="min-h-screen bg-slate-50" style={{ ["--brand-500" as string]: brand }}>
      <header className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {agency.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agency.logoUrl} alt={agency.name} className="h-10 w-10 rounded" />
          )}
          <h1 className="text-xl font-semibold" style={{ color: brand }}>
            {agency.name} — Client Portal
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">Welcome 👋</h2>
        <p className="mt-3 text-slate-600">
          Open the review link {agency.name} sent you by email. Each project has its own private link —
          no login required.
        </p>

        {recent.length > 0 && (
          <div className="mx-auto mt-12 max-w-md text-left">
            <div className="text-sm font-semibold text-slate-700">Recent projects</div>
            <ul className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {recent.map((p) => (
                <li key={p.id} className="px-5 py-3">
                  <Link href={`/review/${p.reviewSlug}`} className="font-medium hover:underline" style={{ color: brand }}>
                    {p.name}
                  </Link>
                  <div className="text-xs text-slate-500">for {p.clientName}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className="px-6 pb-10 text-center text-xs text-slate-400">
        Powered by ApprovalKit
      </footer>
    </main>
  );
}
