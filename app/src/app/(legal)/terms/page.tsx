export default function TermsPage() {
  return (
    <main className="prose mx-auto max-w-2xl px-6 py-16">
      <h1>Terms of Service</h1>
      <p className="text-sm text-slate-500">Last updated: April 2026</p>

      <h2>Use</h2>
      <p>
        ApprovalKit is provided AS-IS under the license terms shipped in
        LICENSE.md of your install. By using the software you agree to those
        terms.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don't use ApprovalKit to host illegal content.</li>
        <li>Don't try to brute-force or guess other agencies' review URLs.</li>
        <li>You are responsible for what your clients upload via comments.</li>
      </ul>

      <h2>Refunds</h2>
      <p>14-day full refund on any paid license. Email the address on your receipt.</p>

      <h2>Liability</h2>
      <p>
        We're not liable for damages arising from use of the software, lost
        data, missed approvals, or your client choosing the wrong logo.
      </p>
    </main>
  );
}
