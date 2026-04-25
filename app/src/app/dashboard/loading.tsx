export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-100" />
      <div className="mt-8 space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </main>
  );
}
