"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { projects, assets } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAgency } from "@/lib/session";
import { deleteObject } from "@/lib/storage";
import { sendReviewLink as sendReviewLinkAction } from "@/lib/actions";

const idSchema = z.string().uuid();

export async function sendReviewLinkToClient(projectId: string) {
  const id = idSchema.parse(projectId);
  await sendReviewLinkAction(id);
  revalidatePath(`/dashboard/projects/${id}`);
  return { ok: true };
}

export async function archiveProject(projectId: string) {
  const id = idSchema.parse(projectId);
  const { agency } = await requireAgency();
  await db.update(projects)
    .set({ status: "archived" })
    .where(and(eq(projects.id, id), eq(projects.agencyId, agency.id)));
  revalidatePath("/dashboard");
}

export async function unarchiveProject(projectId: string) {
  const id = idSchema.parse(projectId);
  const { agency } = await requireAgency();
  await db.update(projects)
    .set({ status: "active" })
    .where(and(eq(projects.id, id), eq(projects.agencyId, agency.id)));
  revalidatePath("/dashboard");
}

export async function deleteProject(projectId: string) {
  const id = idSchema.parse(projectId);
  const { agency } = await requireAgency();

  // Delete underlying object storage for each asset (best-effort)
  const assetList = await db.query.assets.findMany({
    where: eq(assets.projectId, id),
  });
  for (const a of assetList) {
    const key = extractKey(a.fileUrl);
    if (key) await deleteObject(key).catch(() => undefined);
  }

  await db.delete(projects)
    .where(and(eq(projects.id, id), eq(projects.agencyId, agency.id)));
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteAsset(assetId: string, projectId: string) {
  const aid = idSchema.parse(assetId);
  const pid = idSchema.parse(projectId);
  const { agency } = await requireAgency();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, pid), eq(projects.agencyId, agency.id)),
  });
  if (!project) throw new Error("NOT_FOUND");

  const asset = await db.query.assets.findFirst({
    where: and(eq(assets.id, aid), eq(assets.projectId, pid)),
  });
  if (asset) {
    const key = extractKey(asset.fileUrl);
    if (key) await deleteObject(key).catch(() => undefined);
    await db.delete(assets).where(eq(assets.id, aid));
  }
  revalidatePath(`/dashboard/projects/${pid}`);
}

function extractKey(url: string): string | null {
  // If our public URL begins with S3_PUBLIC_URL, the rest is the key.
  const base = process.env.S3_PUBLIC_URL?.replace(/\/+$/, "");
  if (base && url.startsWith(base + "/")) return url.slice(base.length + 1);
  // Otherwise assume it's already a key
  if (!url.startsWith("http")) return url;
  return null;
}

export async function updateAssetNote(assetId: string, projectId: string, note: string) {
  const aid = idSchema.parse(assetId);
  const pid = idSchema.parse(projectId);
  const { agency } = await requireAgency();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, pid), eq(projects.agencyId, agency.id)),
  });
  if (!project) throw new Error("NOT_FOUND");

  const trimmed = note.slice(0, 500);
  await db.update(assets)
    .set({ internalNote: trimmed || null })
    .where(and(eq(assets.id, aid), eq(assets.projectId, pid)));

  revalidatePath(`/dashboard/projects/${pid}`);
  return { ok: true };
}

export async function updateProjectNotifyMode(
  projectId: string,
  mode: "instant" | "digest" | "off",
) {
  const id = idSchema.parse(projectId);
  const { agency } = await requireAgency();
  if (!["instant", "digest", "off"].includes(mode)) throw new Error("INVALID_MODE");
  await db
    .update(projects)
    .set({ notifyMode: mode })
    .where(and(eq(projects.id, id), eq(projects.agencyId, agency.id)));
  revalidatePath(`/dashboard/projects/${id}`);
  return { ok: true };
}

export async function updateProjectMeta(
  projectId: string,
  patch: { name?: string; description?: string | null; clientName?: string; clientEmail?: string },
) {
  const id = idSchema.parse(projectId);
  const { agency } = await requireAgency();
  const update: Record<string, unknown> = {};
  if (typeof patch.name === "string" && patch.name.trim().length > 1) {
    update.name = patch.name.trim().slice(0, 120);
  }
  if (patch.description !== undefined) {
    update.description =
      patch.description && patch.description.trim()
        ? patch.description.trim().slice(0, 2000)
        : null;
  }
  if (typeof patch.clientName === "string" && patch.clientName.trim().length > 0) {
    update.clientName = patch.clientName.trim().slice(0, 80);
  }
  if (typeof patch.clientEmail === "string" && /.+@.+\..+/.test(patch.clientEmail)) {
    update.clientEmail = patch.clientEmail.trim().slice(0, 200);
  }
  if (Object.keys(update).length === 0) return { ok: false, error: "Nothing to update" };
  await db
    .update(projects)
    .set(update)
    .where(and(eq(projects.id, id), eq(projects.agencyId, agency.id)));
  revalidatePath(`/dashboard/projects/${id}`);
  return { ok: true };
}
