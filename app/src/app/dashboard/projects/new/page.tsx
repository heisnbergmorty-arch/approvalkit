import { requireAgency } from "@/lib/session";
import { createProject } from "@/lib/actions";
import Link from "next/link";

export default async function NewProjectPage() {
  await requireAgency();
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">New project</h1>
      <p className="mt-2 text-sm text-slate-600">
        We&apos;ll generate a unique branded review link for your client. They&apos;ll be able to
        approve or pin comments — no signup required.
      </p>

      <form
        action={createProject}
        className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <Field
          label="Project name"
          name="name"
          required
          placeholder="Lumen — Brand Identity"
          help="Internal name; also shown to your client at the top of the review page."
        />
        <Field
          label="Client name"
          name="clientName"
          required
          placeholder="Maya Patel"
          help="Used in the personalized greeting (&quot;Hi Maya 👋&quot;)."
        />
        <Field
          label="Client email"
          name="clientEmail"
          required
          type="email"
          placeholder="maya@lumenco.com"
          help="We email the review link here. Auto-nudges go here too."
        />
        <div>
          <label className="mb-1 block text-sm font-medium">Description (optional)</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Logo + brand guidelines for the Q3 launch."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <p className="mt-1 text-xs text-slate-500">For your own notes. Not shown to the client.</p>
        </div>
        <button className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">
          Create project →
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Next: upload your first asset and copy the review link.{" "}
        <Link href="/demo" target="_blank" className="underline">
          See what your client will see
        </Link>
        .
      </p>
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
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}
