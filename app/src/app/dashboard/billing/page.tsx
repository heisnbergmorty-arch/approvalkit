import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { paidUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const metadata = { title: "Billing" };

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const PAYMENT_GATING_ENABLED = process.env.PAYMENT_GATING_ENABLED !== "false";
const GUMROAD_URL =
  process.env.NEXT_PUBLIC_GUMROAD_URL ?? "https://heisnberg4.gumroad.com/l/tneacr";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) redirect("/login");

  const email = session.user.email.toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(email);
  const paid = await db.query.paidUsers.findFirst({
    where: eq(paidUsers.email, email),
  });

  const status: "admin" | "active" | "refunded" | "free" | "ungated" = !PAYMENT_GATING_ENABLED
    ? "ungated"
    : isAdmin
    ? "admin"
    : paid?.refundedAt
    ? "refunded"
    : paid
    ? "active"
    : "free";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-slate-500">License status for {email}.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <StatusBlock status={status} paid={paid} />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">How licensing works</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>
            <b>One-time payment.</b> $149 lifetime via Gumroad. No recurring fees, no per-seat
            charges.
          </li>
          <li>
            <b>Use forever.</b> Every future feature shipped to ApprovalKit (see the{" "}
            <Link href="/changelog" className="text-brand-600 underline">
              changelog
            </Link>
            ) is included.
          </li>
          <li>
            <b>14-day refund.</b> Email{" "}
            <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
              heisnbergmorty@gmail.com
            </a>
            . No questions asked.
          </li>
          <li>
            <b>Self-hosting.</b> The codebase ships open with{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">PAYMENT_GATING_ENABLED=false</code>{" "}
            for non-commercial use.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Questions about an invoice? Email{" "}
        <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
          heisnbergmorty@gmail.com
        </a>{" "}
        with your Gumroad sale ID.
      </p>
    </main>
  );
}

function StatusBlock({
  status,
  paid,
}: {
  status: "admin" | "active" | "refunded" | "free" | "ungated";
  paid: { paidAt: Date; refundedAt: Date | null; gumroadSaleId: string } | undefined;
}) {
  if (status === "admin") {
    return (
      <>
        <Badge color="indigo">Admin</Badge>
        <p className="mt-3 text-sm text-slate-700">
          Your email is in <code className="text-xs">ADMIN_EMAILS</code> — full access without
          a license entry.
        </p>
      </>
    );
  }
  if (status === "ungated") {
    return (
      <>
        <Badge color="slate">Self-hosted</Badge>
        <p className="mt-3 text-sm text-slate-700">
          Payment gating is disabled on this install (
          <code className="text-xs">PAYMENT_GATING_ENABLED=false</code>).
        </p>
      </>
    );
  }
  if (status === "active" && paid) {
    return (
      <>
        <Badge color="emerald">Lifetime · Active</Badge>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Purchased</dt>
            <dd className="font-medium">{new Date(paid.paidAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Sale ID</dt>
            <dd className="font-mono text-xs">{paid.gumroadSaleId}</dd>
          </div>
        </dl>
      </>
    );
  }
  if (status === "refunded" && paid) {
    return (
      <>
        <Badge color="amber">Refunded</Badge>
        <p className="mt-3 text-sm text-slate-700">
          A refund was processed on{" "}
          <b>{paid.refundedAt && new Date(paid.refundedAt).toLocaleDateString()}</b>. Access
          will end at the next session boundary. Email support if this is an error.
        </p>
      </>
    );
  }
  return (
    <>
      <Badge color="amber">No license</Badge>
      <p className="mt-3 text-sm text-slate-700">
        We don&rsquo;t see a Gumroad purchase for this email. If you bought under a different
        address, email{" "}
        <a className="text-brand-600 underline" href="mailto:heisnbergmorty@gmail.com">
          heisnbergmorty@gmail.com
        </a>
        .
      </p>
      <a
        href={GUMROAD_URL}
        className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Buy lifetime access — $149
      </a>
    </>
  );
}

function Badge({
  color,
  children,
}: {
  color: "emerald" | "amber" | "indigo" | "slate";
  children: React.ReactNode;
}) {
  const cls = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-indigo-100 text-indigo-700",
    slate: "bg-slate-100 text-slate-700",
  }[color];
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}
