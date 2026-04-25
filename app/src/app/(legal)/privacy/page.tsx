export default function PrivacyPage() {
  return (
    <main className="prose mx-auto max-w-2xl px-6 py-16">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: April 2026</p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address (login)</li>
        <li>Files you upload to share with clients</li>
        <li>Comments and approval events from your clients</li>
      </ul>

      <h2>Where it's stored</h2>
      <p>
        Your data lives in our hosted database. We don't share, sell, or use
        it for anything other than running ApprovalKit for you.
      </p>
      <p>
        Files (mockups, comments) are stored in encrypted object storage.
        Database is hosted on managed Postgres in the US.
      </p>

      <h2>What we share</h2>
      <p>Nothing. No analytics, no third-party trackers on the review portal.</p>

      <h2>What your clients see</h2>
      <p>
        Clients access reviews via an unguessable URL. They submit their name
        when commenting/approving — that name and email (if provided) is
        visible to you, the agency.
      </p>

      <h2>Deletion</h2>
      <p>
        Delete a project from your dashboard and all associated assets,
        comments, and approvals are permanently removed within seconds.
      </p>

      <h2>Contact</h2>
      <p>Questions? Email heisnbergmorty@gmail.com.</p>
    </main>
  );
}
