import { requireAgency } from "@/lib/session";
import { updateSettings } from "./actions";
import Link from "next/link";

export default async function SettingsPage() {
  const { agency } = await requireAgency();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">← Dashboard</Link>
      <h1 className="mt-4 text-2xl font-semibold">Settings</h1>

      <form action={updateSettings} className="mt-8 space-y-6">
        <Field
          label="Custom domain"
          name="customDomain"
          defaultValue={agency.customDomain ?? ""}
          placeholder="review.yourstudio.com"
          help="Point a CNAME at this app. Clients will see your branded URL."
        />

        <Field
          label="Webhook URL"
          name="webhookUrl"
          type="url"
          defaultValue={agency.webhookUrl ?? ""}
          placeholder="https://hooks.slack.com/services/…"
          help="POSTed on approve and comment events. Works with Slack, Zapier, n8n."
        />

        <button className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-600">
          Save settings
        </button>
      </form>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
        <div className="font-semibold">Webhook payload example</div>
        <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`{
  "event": "asset.approved",
  "agencyId": "...",
  "projectId": "...",
  "projectName": "Acme Co — Brand Identity",
  "assetLabel": "Logo — Concept B",
  "actorName": "Sarah Chen",
  "url": "https://app/dashboard/projects/...",
  "timestamp": "2026-04-25T14:00:00.000Z"
}`}
        </pre>
      </section>
    </main>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string }) {
  const { label, help, ...rest } = props;
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        {...rest}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}
