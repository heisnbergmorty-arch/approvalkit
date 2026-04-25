export default function CheckEmailPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="mt-3 text-slate-600">
        We've sent a magic link to your inbox. Click it to sign in.
      </p>
      <p className="mt-6 text-xs text-slate-500">
        Tip: if it doesn't arrive in 1 minute, check spam.
      </p>
    </main>
  );
}
