"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { projects, assets } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAgency } from "@/lib/session";
import { deleteObject } from "@/lib/storage";

const idSchema = z.string().uuid();

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
