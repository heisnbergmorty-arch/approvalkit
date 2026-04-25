import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createOrUpdateAgency } from "@/lib/actions";
import Link from "next/link";

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const existing = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, session.user.id),
  });

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to dashboard
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white text-lg font-bold">
          1
        </span>
        <div>
          <h1 className="text-2xl font-semibold">
            {existing ? "Edit your agency" : "Set up your agency"}
          </h1>
          <p className="text-sm text-slate-600">
            Takes 30 seconds. You can change anything later in Settings.
          </p>
        </div>
      </div>

      <form action={createOrUpdateAgency} className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field
          label="Agency name"
          name="name"
          defaultValue={existing?.name}
          required
          placeholder="Pixel & Pine Studio"
          help="Shown at the top of every client review page."
        />
        <Field
          label="URL slug (optional)"
          name="slug"
          defaultValue={existing?.slug}
          placeholder="pixel-and-pine"
          help="Auto-generated from your name if you leave this blank."
        />
        <Field
          label="Logo URL (optional)"
          name="logoUrl"
          defaultValue={existing?.logoUrl ?? ""}
          placeholder="https://your-cdn.com/logo.png"
          type="url"
          help="Square image works best. Skip for now and we'll show a brand-color initial."
        />
        <div>
          <label className="mb-1 block text-sm font-medium">Brand color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="brandColor"
              defaultValue={existing?.brandColor ?? "#6366f1"}
              className="h-12 w-20 cursor-pointer rounded-lg border border-slate-300"
            />
            <span className="text-xs text-slate-500">
              Used everywhere your clients look — buttons, pin badges, accents.
            </span>
          </div>
        </div>
        <button className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600">
          {existing ? "Save changes" : "Create agency →"}
        </button>
      </form>

      {!existing && (
        <p className="mt-6 text-center text-xs text-slate-500">
          Next: create your first project and send a branded review link to your client.{" "}
          <Link href="/demo" className="underline">
            Preview what they&apos;ll see
          </Link>
          .
        </p>
      )}
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
