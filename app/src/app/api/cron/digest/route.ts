/**
 * Daily digest cron — sends each agency owner ONE email summarizing what
 * happened on their projects in the last 24h, instead of per-event blasts.
 *
 * Trigger via: GET /api/cron/digest with Authorization: Bearer ${CRON_SECRET}
 *
 * Skips agencies that have no activity. Doesn't replace per-event emails;
 * agencies can opt into digest-only mode in v1.1.
 */
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { agencies, projects, assets, comments, approvals, users } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { appUrl } from "@/lib/session";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const allAgencies = await db.select().from(agencies);
  let sent = 0;

  for (const a of allAgencies) {
    const owner = await db.query.users.findFirst({ where: eq(users.id, a.ownerUserId) });
    if (!owner?.email) continue;

    const newApprovals = await db
      .select({
        assetLabel: assets.label,
        projectName: projects.name,
        approverName: approvals.approverName,
      })
      .from(approvals)
      .innerJoin(assets, eq(assets.id, approvals.assetId))
      .innerJoin(projects, eq(projects.id, assets.projectId))
      .where(and(eq(projects.agencyId, a.id), gte(approvals.approvedAt, since)));

    const newComments = await db
      .select({
        assetLabel: assets.label,
        projectName: projects.name,
        authorName: comments.authorName,
        body: comments.body,
      })
      .from(comments)
      .innerJoin(assets, eq(assets.id, comments.assetId))
      .innerJoin(projects, eq(projects.id, assets.projectId))
      .where(and(
        eq(projects.agencyId, a.id),
        gte(comments.createdAt, since),
        eq(comments.isFromAgency, false),
      ));

    if (newApprovals.length === 0 && newComments.length === 0) continue;

    const html = digestEmail({
      brandColor: a.brandColor ?? "#6366f1",
      agencyName: a.name,
      approvals: newApprovals,
      comments: newComments,
      dashboardUrl: appUrl("/dashboard"),
    });

    await sendEmail({
      to: owner.email,
      subject: `Daily digest: ${newApprovals.length} approval${newApprovals.length === 1 ? "" : "s"}, ${newComments.length} new comment${newComments.length === 1 ? "" : "s"}`,
      html,
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}

function digestEmail(args: {
  brandColor: string;
  agencyName: string;
  approvals: { assetLabel: string; projectName: string; approverName: string }[];
  comments: { assetLabel: string; projectName: string; authorName: string; body: string }[];
  dashboardUrl: string;
}): string {
  const approvalRows = args.approvals.map((a) => `
    <li style="margin:6px 0">
      <span style="color:#10b981">✓</span>
      <b>${escape(a.approverName)}</b> approved
      <i>${escape(a.assetLabel)}</i> on ${escape(a.projectName)}
    </li>`).join("");

  const commentRows = args.comments.map((c) => `
    <li style="margin:10px 0">
      💬 <b>${escape(c.authorName)}</b> on <i>${escape(c.assetLabel)}</i>
        (${escape(c.projectName)}):
      <blockquote style="margin:4px 0 0 12px;color:#475569;font-size:13px">
        ${escape(c.body.slice(0, 200))}${c.body.length > 200 ? "…" : ""}
      </blockquote>
    </li>`).join("");

  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    max-width:560px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="font-weight:700;color:${args.brandColor};margin-bottom:16px">▰ ApprovalKit</div>
    <h1 style="margin:0 0 8px;font-size:22px">Yesterday on ${escape(args.agencyName)}</h1>
    <p style="margin:0 0 18px;color:#475569;font-size:14px">
      Here's everything that happened across your projects.
    </p>
    ${args.approvals.length ? `
      <h2 style="font-size:16px;margin:16px 0 4px">Approvals</h2>
      <ul style="padding-left:20px;font-size:14px">${approvalRows}</ul>` : ""}
    ${args.comments.length ? `
      <h2 style="font-size:16px;margin:16px 0 4px">New comments</h2>
      <ul style="padding-left:20px;font-size:14px">${commentRows}</ul>` : ""}
    <p style="margin:24px 0">
      <a href="${args.dashboardUrl}" style="color:${args.brandColor};font-weight:600">Open dashboard →</a>
    </p>
  </div>`;
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
