import { NextResponse } from "next/server";
import { requireAgency } from "@/lib/session";
import { db } from "@/db/client";
import { projects, assets, comments, approvals } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

interface Ctx { params: Promise<{ id: string }> }

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(...cells: unknown[]): string {
  return cells.map(csvEscape).join(",");
}

export async function GET(_req: Request, ctx: Ctx) {
  let agencyId: string;
  try {
    const { agency } = await requireAgency();
    agencyId = agency.id;
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: projectId } = await ctx.params;

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.agencyId, agencyId)),
  });
  if (!project) return new NextResponse("Not found", { status: 404 });

  const assetList = await db.query.assets.findMany({
    where: eq(assets.projectId, project.id),
  });

  const assetIds = assetList.map((a) => a.id);
  const assetById = new Map(assetList.map((a) => [a.id, a]));

  const [allComments, allApprovals] =
    assetIds.length === 0
      ? [[], []]
      : await Promise.all([
          db.query.comments.findMany({ where: inArray(comments.assetId, assetIds) }),
          db.query.approvals.findMany({ where: inArray(approvals.assetId, assetIds) }),
        ]);

  type LogEntry = {
    timestamp: Date;
    action: string;
    assetLabel: string;
    assetGroup: string;
    assetVersion: number;
    actorName: string;
    actorEmail: string;
    body: string;
  };

  const log: LogEntry[] = [];

  for (const c of allComments) {
    const a = assetById.get(c.assetId);
    if (!a) continue;
    log.push({
      timestamp: c.createdAt,
      action: c.isFromAgency ? "agency_comment" : "client_comment",
      assetLabel: a.label,
      assetGroup: a.groupKey,
      assetVersion: a.version,
      actorName: c.authorName,
      actorEmail: c.authorEmail ?? "",
      body: c.body,
    });
  }

  for (const ap of allApprovals) {
    const a = assetById.get(ap.assetId);
    if (!a) continue;
    log.push({
      timestamp: ap.approvedAt,
      action: "approved",
      assetLabel: a.label,
      assetGroup: a.groupKey,
      assetVersion: a.version,
      actorName: ap.approverName,
      actorEmail: ap.approverEmail ?? "",
      body: "",
    });
  }

  log.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const lines: string[] = [];
  lines.push(
    row(
      "timestamp_utc",
      "action",
      "asset_label",
      "asset_group",
      "asset_version",
      "actor_name",
      "actor_email",
      "body",
    ),
  );
  for (const e of log) {
    lines.push(
      row(
        e.timestamp.toISOString(),
        e.action,
        e.assetLabel,
        e.assetGroup,
        e.assetVersion,
        e.actorName,
        e.actorEmail,
        e.body,
      ),
    );
  }

  const csv = lines.join("\n") + "\n";
  const safeName = project.name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "project";
  const filename = `approval-log-${safeName}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
