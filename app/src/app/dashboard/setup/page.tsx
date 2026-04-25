import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createOrUpdateAgency } from "@/lib/actions";

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const existing = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, session.user.id),
  });

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold">
        {existing ? "Edit agency" : "Set up your agency"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        These details show up on every client review portal you send.
      </p>

      <form action={createOrUpdateAgency} className="mt-8 space-y-5">
        <Field label="Agency name" name="name" defaultValue={existing?.name} required placeholder="Acme Studio" />
        <Field label="URL slug" name="slug" defaultValue={existing?.slug} placeholder="acme-studio" />
        <Field label="Logo URL (optional)" name="logoUrl" defaultValue={existing?.logoUrl ?? ""} placeholder="https://..." type="url" />
        <div>
          <label className="mb-1 block text-sm font-medium">Brand color</label>
          <input
            type="color"
            name="brandColor"
            defaultValue={existing?.brandColor ?? "#6366f1"}
            className="h-12 w-24 cursor-pointer rounded-lg border border-slate-300"
          />
        </div>
        <button className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">
          {existing ? "Save changes" : "Create agency"}
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
