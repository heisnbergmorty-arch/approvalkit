import { requireAgency } from "@/lib/session";
import { updateSettings } from "./actions";
import { TestWebhookButton } from "./test-webhook-button";
import { LogoUploader } from "@/components/logo-uploader";
import { BrandColorPicker } from "@/components/brand-color-picker";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function SettingsPage() {
  const { agency } = await requireAgency();
  const firstProject = await db.query.projects.findFirst({
    where: eq(projects.agencyId, agency.id),
    orderBy: [desc(projects.createdAt)],
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Agency settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        These details show up on every client review portal you send.
      </p>

      <form action={updateSettings} className="mt-8 space-y-8">
        <Section title="Brand">
          <Field
            label="Agency name"
            name="name"
            defaultValue={agency.name}
            required
            placeholder="Pixel & Pine Studio"
            help="Shown in the header of every client review page."
          />
          <BrandColorPicker name="brandColor" defaultValue={agency.brandColor ?? "#6366f1"} />
          <LogoUploader
            name="logoUrl"
            defaultUrl={agency.logoUrl ?? ""}
            brandColor={agency.brandColor ?? "#6366f1"}
            agencyInitial={(agency.name?.[0] ?? "A").toUpperCase()}
          />
        </Section>

        <Section title="White-label domain">
          <Field
            label="Custom domain"
            name="customDomain"
            defaultValue={agency.customDomain ?? ""}
            placeholder="review.yourstudio.com"
            help="Point a CNAME at this app. Clients see your branded URL instead of ours."
          />
        </Section>

        <Section title="Integrations">
          <Field
            label="Webhook URL"
            name="webhookUrl"
            type="url"
            defaultValue={agency.webhookUrl ?? ""}
            placeholder="https://hooks.slack.com/services/…"
            help="POSTed on every approve and comment event. Works with Slack incoming webhooks, Zapier, n8n, Make."
          />
          <TestWebhookButton />
        </Section>

        <Section title="Client emails">
          <div>
            <label className="mb-1 block text-sm font-medium">Email opener</label>
            <textarea
              name="emailIntro"
              rows={3}
              defaultValue={agency.emailIntro ?? ""}
              placeholder="Hi there — we&rsquo;ve got fresh work ready for your review. Let us know what you think!"
              maxLength={500}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <p className="mt-1 text-xs text-slate-500">
              First line of every review-link email. Leave blank for a sensible default.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Sign-off</label>
            <input
              name="emailSignature"
              defaultValue={agency.emailSignature ?? ""}
              placeholder="— The team at Pixel & Pine"
              maxLength={120}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <p className="mt-1 text-xs text-slate-500">
              Shown at the bottom of every client email. Defaults to your agency name.
            </p>
          </div>
        </Section>

        <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-600">
          Save settings
        </button>
      </form>

      {firstProject && (
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm">
          <div className="font-medium text-slate-900">See it through your client&rsquo;s eyes</div>
          <p className="mt-1 text-slate-600">
            Open the live review page for <b>{firstProject.name}</b> to preview your branding.
          </p>
          <Link
            href={`/review/${firstProject.reviewSlug}`}
            target="_blank"
            className="mt-3 inline-block rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
          >
            Preview as client ↗
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div className="font-medium text-slate-900">Your public profile</div>
        <p className="mt-1 text-slate-600">
          Share this link in your portfolio, proposals, or socials — clients see your branded review hub.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
            /a/{agency.slug}
          </code>
          <Link
            href={`/a/${agency.slug}`}
            target="_blank"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-500"
          >
            View public profile ↗
          </Link>
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
        <div className="font-semibold">Webhook payload example</div>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`{
  "event": "asset.approved",
  "agencyId": "...",
  "projectId": "...",
  "projectName": "Lumen — Brand Identity",
  "assetLabel": "Logo — Concept B",
  "actorName": "Maya Patel",
  "url": "https://app/dashboard/projects/...",
  "timestamp": "2026-04-25T14:00:00.000Z"
}`}
        </pre>
        <p className="mt-3 text-xs text-slate-500">
          Other events: <code>comment.created</code>, <code>asset.uploaded</code>.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <div className="font-semibold">Your data</div>
        <p className="mt-2 text-slate-600">
          Need to export everything? Use the <strong>Export approval log (CSV)</strong> button on
          each project page. We're rolling out a full account-wide export soon.
        </p>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string }) {
  const { label, help, ...rest } = props;
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        {...rest}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}
