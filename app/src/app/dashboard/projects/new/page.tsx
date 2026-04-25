import { requireAgency } from "@/lib/session";
import { createProject } from "@/lib/actions";

export default async function NewProjectPage() {
  await requireAgency();
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold">New project</h1>
      <p className="mt-2 text-sm text-slate-600">
        We'll generate a unique review link for your client.
      </p>

      <form action={createProject} className="mt-8 space-y-5">
        <Field label="Project name" name="name" required placeholder="Northstar Rebrand" />
        <Field label="Client name" name="clientName" required placeholder="Sarah Chen" />
        <Field label="Client email" name="clientEmail" required type="email" placeholder="sarah@northstar.com" />
        <div>
          <label className="mb-1 block text-sm font-medium">Description (optional)</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Logo + brand guidelines for Northstar's Q3 launch."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">
          Create project
        </button>
      </form>
    </main>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        {...rest}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
