"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { agencies, projects, assets, comments, approvals } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUserId, requireAgency, appUrl } from "@/lib/session";
import { reviewSlug, slugify } from "@/lib/ids";
import { sendEmail, reviewLinkEmail, approvedEmail, commentEmail } from "@/lib/email";
import { fireWebhook } from "@/lib/webhook";

// ============================================================================
// Agency setup
// ============================================================================

const agencySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(50).optional(),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function createOrUpdateAgency(formData: FormData) {
  const userId = await requireUserId();
  const data = agencySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    brandColor: formData.get("brandColor") || "#6366f1",
    logoUrl: formData.get("logoUrl") || undefined,
  });

  const existing = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, userId),
  });

  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  if (existing) {
    await db.update(agencies)
      .set({ name: data.name, brandColor: data.brandColor, logoUrl: data.logoUrl || null })
      .where(eq(agencies.id, existing.id));
  } else {
    await db.insert(agencies).values({
      ownerUserId: userId,
      name: data.name,
      slug,
      brandColor: data.brandColor,
      logoUrl: data.logoUrl || null,
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ============================================================================
// Projects
// ============================================================================

const projectSchema = z.object({
  name: z.string().min(2).max(120),
  clientName: z.string().min(1).max(80),
  clientEmail: z.string().email(),
  description: z.string().max(2000).optional(),
});

export async function createProject(formData: FormData) {
  const { agency } = await requireAgency();
  const data = projectSchema.parse({
    name: formData.get("name"),
    clientName: formData.get("clientName"),
    clientEmail: formData.get("clientEmail"),
    description: formData.get("description") || undefined,
  });

  const slug = reviewSlug();
  const [created] = await db.insert(projects).values({
    agencyId: agency.id,
    name: data.name,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    description: data.description ?? null,
    reviewSlug: slug,
  }).returning();

  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${created.id}`);
}

export async function sendReviewLink(projectId: string) {
  const { agency } = await requireAgency();
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.agencyId, agency.id)),
  });
  if (!project) throw new Error("NOT_FOUND");

  const reviewUrl = appUrl(`/review/${project.reviewSlug}`);
  await sendEmail({
    to: project.clientEmail,
    subject: `${agency.name} — review work for ${project.name}`,
    html: reviewLinkEmail({
      agencyName: agency.name,
      brandColor: agency.brandColor ?? "#6366f1",
      clientName: project.clientName,
      projectName: project.name,
      reviewUrl,
    }),
    replyTo: undefined,
  });

  return { ok: true };
}

// ============================================================================
// Assets
// ============================================================================

const assetSchema = z.object({
  projectId: z.string().uuid(),
  groupKey: z.string().min(1).max(80),
  label: z.string().min(1).max(120),
  fileUrl: z.string().url(),
  mimeType: z.string().min(1).max(100),
  fileSizeBytes: z.coerce.number().int().nonnegative().optional(),
});

export async function createAsset(input: z.infer<typeof assetSchema>) {
  const { agency } = await requireAgency();
  const data = assetSchema.parse(input);

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, data.projectId), eq(projects.agencyId, agency.id)),
  });
  if (!project) throw new Error("NOT_FOUND");

  // Find latest version for this groupKey, mark old as not current
  const previous = await db.query.assets.findMany({
    where: and(eq(assets.projectId, data.projectId), eq(assets.groupKey, data.groupKey)),
  });
  const nextVersion = (previous.reduce((m, a) => Math.max(m, a.version), 0) || 0) + 1;

  if (previous.length) {
    await db.update(assets)
      .set({ isCurrentVersion: false })
      .where(and(eq(assets.projectId, data.projectId), eq(assets.groupKey, data.groupKey)));
  }

  const [created] = await db.insert(assets).values({
    projectId: data.projectId,
    groupKey: data.groupKey,
    version: nextVersion,
    label: data.label,
    fileUrl: data.fileUrl,
    mimeType: data.mimeType,
    fileSizeBytes: data.fileSizeBytes ?? null,
    status: "pending",
    isCurrentVersion: true,
  }).returning();

  revalidatePath(`/dashboard/projects/${data.projectId}`);
  revalidatePath(`/review/${project.reviewSlug}`);
  return created;
}

// ============================================================================
// Client-side actions (no auth — uses reviewSlug as auth)
// ============================================================================

const approveSchema = z.object({
  reviewSlug: z.string().min(8),
  assetId: z.string().uuid(),
  approverName: z.string().min(1).max(80),
  approverEmail: z.string().email().optional().or(z.literal("")),
});

export async function approveAsset(input: z.infer<typeof approveSchema>) {
  const data = approveSchema.parse(input);

  const project = await db.query.projects.findFirst({
    where: eq(projects.reviewSlug, data.reviewSlug),
    with: { agency: true },
  });
  if (!project) throw new Error("NOT_FOUND");

  const asset = await db.query.assets.findFirst({
    where: and(eq(assets.id, data.assetId), eq(assets.projectId, project.id)),
  });
  if (!asset) throw new Error("NOT_FOUND");

  await db.insert(approvals).values({
    assetId: asset.id,
    approverName: data.approverName,
    approverEmail: data.approverEmail || null,
  });
  await db.update(assets).set({ status: "approved" }).where(eq(assets.id, asset.id));

  // Notify the agency owner
  const ownerEmail = await getAgencyOwnerEmail(project.agencyId);
  if (ownerEmail) {
    const tpl = approvedEmail({
      agencyContactEmail: ownerEmail,
      brandColor: project.agency.brandColor ?? "#6366f1",
      approverName: data.approverName,
      assetLabel: asset.label,
      projectName: project.name,
      dashboardUrl: appUrl(`/dashboard/projects/${project.id}`),
    });
    await sendEmail({ to: ownerEmail, subject: tpl.subject, html: tpl.html });
  }

  await fireWebhook(project.agencyId, {
    event: "asset.approved",
    projectId: project.id,
    projectName: project.name,
    assetLabel: asset.label,
    actorName: data.approverName,
    url: appUrl(`/dashboard/projects/${project.id}`),
  });

  revalidatePath(`/review/${project.reviewSlug}`);
  revalidatePath(`/dashboard/projects/${project.id}`);
  return { ok: true };
}

const commentSchema = z.object({
  reviewSlug: z.string().min(8),
  assetId: z.string().uuid(),
  authorName: z.string().min(1).max(80),
  authorEmail: z.string().email().optional().or(z.literal("")),
  body: z.string().min(1).max(4000),
  xPct: z.coerce.number().int().min(0).max(10000).optional(),
  yPct: z.coerce.number().int().min(0).max(10000).optional(),
  isFromAgency: z.boolean().default(false),
});

export async function addComment(input: z.infer<typeof commentSchema>) {
  const data = commentSchema.parse(input);

  const project = await db.query.projects.findFirst({
    where: eq(projects.reviewSlug, data.reviewSlug),
    with: { agency: true },
  });
  if (!project) throw new Error("NOT_FOUND");

  const asset = await db.query.assets.findFirst({
    where: and(eq(assets.id, data.assetId), eq(assets.projectId, project.id)),
  });
  if (!asset) throw new Error("NOT_FOUND");

  await db.insert(comments).values({
    assetId: asset.id,
    authorName: data.authorName,
    authorEmail: data.authorEmail || null,
    isFromAgency: data.isFromAgency,
    body: data.body,
    xPct: data.xPct ?? null,
    yPct: data.yPct ?? null,
  });

  // If client commented, also flip status to changes_requested
  if (!data.isFromAgency) {
    await db.update(assets).set({ status: "changes_requested" }).where(eq(assets.id, asset.id));
  }

  // Notify the agency owner if comment is from client
  if (!data.isFromAgency) {
    const ownerEmail = await getAgencyOwnerEmail(project.agencyId);
    if (ownerEmail) {
      const tpl = commentEmail({
        brandColor: project.agency.brandColor ?? "#6366f1",
        authorName: data.authorName,
        assetLabel: asset.label,
        projectName: project.name,
        body: data.body,
        dashboardUrl: appUrl(`/dashboard/projects/${project.id}`),
      });
      await sendEmail({ to: ownerEmail, subject: tpl.subject, html: tpl.html });
    }
  } else if (project.clientEmail) {
    // Agency replied → notify client
    await sendEmail({
      to: project.clientEmail,
      subject: `${project.agency.name} replied on "${asset.label}"`,
      html: commentEmail({
        brandColor: project.agency.brandColor ?? "#6366f1",
        authorName: data.authorName,
        assetLabel: asset.label,
        projectName: project.name,
        body: data.body,
        dashboardUrl: appUrl(`/review/${project.reviewSlug}`),
      }).html,
    });
  }

  await fireWebhook(project.agencyId, {
    event: "comment.created",
    projectId: project.id,
    projectName: project.name,
    assetLabel: asset.label,
    actorName: data.authorName,
    body: data.body,
    url: appUrl(`/dashboard/projects/${project.id}`),
  });

  revalidatePath(`/review/${project.reviewSlug}`);
  revalidatePath(`/dashboard/projects/${project.id}`);
  return { ok: true };
}

async function getAgencyOwnerEmail(agencyId: string): Promise<string | null> {
  const a = await db.query.agencies.findFirst({
    where: eq(agencies.id, agencyId),
    with: { owner: true },
  });
  return a?.owner?.email ?? null;
}
