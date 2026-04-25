/**
 * Daily cron: nudges clients with pending review items they haven't acted on.
 *
 * Trigger via Vercel Cron, GitHub Action, or any HTTP scheduler.
 * Protected by CRON_SECRET. Send a `Authorization: Bearer ${CRON_SECRET}` header.
 */
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { projects, assets, comments } from "@/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { sendEmail, reviewLinkEmail } from "@/lib/email";
import { appUrl } from "@/lib/session";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Find projects with at least one pending asset older than 48h
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const stuck = await db
    .select({
      projectId: projects.id,
      projectName: projects.name,
      reviewSlug: projects.reviewSlug,
      clientName: projects.clientName,
      clientEmail: projects.clientEmail,
      agencyName: sql<string>`(select name from agencies where id = ${projects.agencyId})`,
      brandColor: sql<string>`(select "brandColor" from agencies where id = ${projects.agencyId})`,
    })
    .from(projects)
    .innerJoin(assets, eq(assets.projectId, projects.id))
    .where(and(
      eq(assets.status, "pending"),
      lt(assets.createdAt, cutoff),
      sql`${projects.notifyMode} != 'off'`,
    ))
    .groupBy(projects.id);

  let sent = 0;
  for (const p of stuck) {
    try {
      await sendEmail({
        to: p.clientEmail,
        subject: `Reminder: ${p.agencyName} is waiting on your review`,
        html: reviewLinkEmail({
          agencyName: p.agencyName,
          brandColor: p.brandColor ?? "#6366f1",
          clientName: p.clientName,
          projectName: p.projectName,
          reviewUrl: appUrl(`/review/${p.reviewSlug}`),
        }),
      });
      sent++;
    } catch (e) {
      console.error("[cron/reminders] failed", p.projectId, e);
    }
  }

  return NextResponse.json({ ok: true, projects: stuck.length, sent });
}
