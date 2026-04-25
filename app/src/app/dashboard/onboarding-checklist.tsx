import Link from "next/link";

interface Step {
  done: boolean;
  title: string;
  description: string;
  cta?: { href: string; label: string };
}

interface Props {
  agencyName: string;
  hasBrandColor: boolean;
  hasLogo: boolean;
  hasFirstProject: boolean;
  hasFirstAsset: boolean;
  hasWebhook: boolean;
  hasCustomDomain: boolean;
}

export function OnboardingChecklist(p: Props) {
  const brandDone = p.hasBrandColor && Boolean(p.agencyName);
  const steps: Step[] = [
    {
      done: brandDone,
      title: "Set your brand",
      description: "Agency name + brand color show up on every client review page.",
      cta: { href: "/dashboard/settings", label: brandDone ? "Edit brand" : "Set brand" },
    },
    {
      done: p.hasLogo,
      title: "Upload a logo (optional)",
      description: "Square PNG/SVG ~64×64. Without one we use a brand-color initial.",
      cta: { href: "/dashboard/settings", label: p.hasLogo ? "Update logo" : "Add logo" },
    },
    {
      done: p.hasFirstProject,
      title: "Create your first project",
      description: "One project = one chunk of work for one client. Generates a unique review link.",
      cta: { href: "/dashboard/projects/new", label: "+ New project" },
    },
    {
      done: p.hasFirstAsset,
      title: "Upload an asset & send the link",
      description: "Drop in a PNG/JPG/PDF, then email the review link to your client.",
    },
    {
      done: p.hasWebhook,
      title: "Connect Slack or Zapier (optional)",
      description: "Get a ping the second your client approves or comments.",
      cta: { href: "/dashboard/settings", label: p.hasWebhook ? "Edit webhook" : "Add webhook" },
    },
    {
      done: p.hasCustomDomain,
      title: "Add a custom domain (optional)",
      description: "Send clients to review.yourstudio.com instead of approvalkit.com.",
      cta: { href: "/dashboard/settings", label: p.hasCustomDomain ? "Update domain" : "Add domain" },
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const required = 3; // brand + project + asset
  const requiredDone = steps.slice(0, 4).filter((s) => s.done).length - (steps[1].done ? 1 : 0);
  const allCoreDone = brandDone && p.hasFirstProject && p.hasFirstAsset;
  if (allCoreDone && p.hasWebhook && p.hasCustomDomain) {
    // Fully set up — hide checklist entirely
    return null;
  }
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <section className="mt-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Get set up</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            {allCoreDone
              ? "You’re live! Optional polish below."
              : `${requiredDone} of ${required} required steps complete.`}
          </p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          {completed}/{steps.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <ul className="mt-5 space-y-2.5">
        {steps.map((s) => (
          <li
            key={s.title}
            className="flex items-start gap-3 rounded-xl bg-white/70 p-3 text-sm ring-1 ring-slate-200"
          >
            <span
              className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                s.done
                  ? "bg-emerald-500 text-white"
                  : "border border-slate-300 bg-white text-slate-300"
              }`}
            >
              {s.done ? "✓" : ""}
            </span>
            <div className="min-w-0 flex-1">
              <div className={`font-medium ${s.done ? "text-slate-500 line-through" : "text-slate-900"}`}>
                {s.title}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{s.description}</div>
            </div>
            {s.cta && !s.done && (
              <Link
                href={s.cta.href}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium hover:border-slate-500"
              >
                {s.cta.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
