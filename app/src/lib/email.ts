import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "ApprovalKit <noreply@example.com>";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send", { to, subject });
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html, replyTo });
}

// === Templates ===

export function reviewLinkEmail(opts: {
  agencyName: string;
  brandColor: string;
  clientName: string;
  projectName: string;
  reviewUrl: string;
}): string {
  const { agencyName, brandColor, clientName, projectName, reviewUrl } = opts;
  return baseShell(
    brandColor,
    `
    <h1 style="margin:0 0 16px;font-size:22px">Hi ${escape(clientName)},</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#475569">
      ${escape(agencyName)} has work ready for your review on <b>${escape(projectName)}</b>.
    </p>
    <p style="margin:24px 0">
      <a href="${reviewUrl}" style="display:inline-block;background:${brandColor};color:#fff;
        padding:14px 22px;border-radius:8px;font-weight:600;text-decoration:none">
        Review the work →
      </a>
    </p>
    <p style="font-size:13px;color:#94a3b8">No login needed. Just open the link.</p>
    `,
  );
}

export function approvedEmail(opts: {
  agencyContactEmail: string;
  brandColor: string;
  approverName: string;
  assetLabel: string;
  projectName: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `✓ ${opts.approverName} approved "${opts.assetLabel}"`,
    html: baseShell(
      opts.brandColor,
      `
      <h1 style="margin:0 0 16px;font-size:22px;color:#10b981">Approved ✓</h1>
      <p style="margin:0 0 16px;font-size:15px;color:#475569">
        <b>${escape(opts.approverName)}</b> approved <b>${escape(opts.assetLabel)}</b>
        on project <b>${escape(opts.projectName)}</b>.
      </p>
      <p style="margin:24px 0">
        <a href="${opts.dashboardUrl}" style="color:${opts.brandColor};font-weight:600">Open dashboard →</a>
      </p>
      `,
    ),
  };
}

export function commentEmail(opts: {
  brandColor: string;
  authorName: string;
  assetLabel: string;
  projectName: string;
  body: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `💬 ${opts.authorName} left feedback on "${opts.assetLabel}"`,
    html: baseShell(
      opts.brandColor,
      `
      <h1 style="margin:0 0 16px;font-size:22px">New feedback</h1>
      <p style="margin:0 0 8px;font-size:15px;color:#475569">
        <b>${escape(opts.authorName)}</b> commented on <b>${escape(opts.assetLabel)}</b>
        in <b>${escape(opts.projectName)}</b>:
      </p>
      <blockquote style="margin:16px 0;padding:12px 16px;background:#f1f5f9;border-left:3px solid ${opts.brandColor};
        border-radius:6px;font-size:14px;color:#0f172a">
        ${escape(opts.body)}
      </blockquote>
      <p style="margin:24px 0">
        <a href="${opts.dashboardUrl}" style="color:${opts.brandColor};font-weight:600">Reply in dashboard →</a>
      </p>
      `,
    ),
  };
}

function baseShell(brand: string, inner: string): string {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    max-width:560px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="font-weight:700;color:${brand};margin-bottom:24px">▰ ApprovalKit</div>
    ${inner}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px"/>
    <p style="font-size:12px;color:#94a3b8;margin:0">Sent by ApprovalKit on behalf of your design partner.</p>
  </div>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
