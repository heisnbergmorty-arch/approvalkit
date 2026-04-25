export default function TermsPage() {
  return (
    <main className="prose mx-auto max-w-2xl px-6 py-16">
      <h1>Terms of Service</h1>
      <p className="text-sm text-slate-500">Last updated: April 2026</p>

      <h2>Use</h2>
      <p>
        ApprovalKit is provided AS-IS. By using the service you agree to these
        terms. Your access is tied to the email you used at checkout.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don't use ApprovalKit to host illegal content.</li>
        <li>Don't try to brute-force or guess other agencies' review URLs.</li>
        <li>You are responsible for what your clients upload via comments.</li>
      </ul>

      <h2>Refunds</h2>
      <p>30-day full refund, no questions asked. Email the address on your receipt.</p>

      <h2>Liability</h2>
      <p>
        We're not liable for damages arising from use of the service, lost
        data, missed approvals, or your client choosing the wrong logo.
      </p>
    </main>
  );
}
