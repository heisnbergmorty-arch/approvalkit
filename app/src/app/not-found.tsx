import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl">🪁</div>
      <h1 className="mt-4 text-2xl font-semibold">Lost the trail.</h1>
      <p className="mt-2 text-slate-600">
        That review link doesn't exist — or it expired. Ask whoever sent it
        for a fresh one.
      </p>
      <Link href="/" className="mt-6 text-sm text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}
