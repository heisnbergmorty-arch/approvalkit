"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAgency } from "@/lib/session";

const settingsSchema = z.object({
  name: z.string().min(2).max(80),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logoUrl: z.string().url().max(500).optional().or(z.literal("")),
  customDomain: z.string().max(120).optional().or(z.literal("")),
  webhookUrl: z.string().url().max(500).optional().or(z.literal("")),
});

export async function updateSettings(formData: FormData) {
  const { agency } = await requireAgency();
  const data = settingsSchema.parse({
    name: formData.get("name"),
    brandColor: formData.get("brandColor") || "#6366f1",
    logoUrl: formData.get("logoUrl") || "",
    customDomain: formData.get("customDomain") || "",
    webhookUrl: formData.get("webhookUrl") || "",
  });

  await db
    .update(agencies)
    .set({
      name: data.name,
      brandColor: data.brandColor,
      logoUrl: data.logoUrl || null,
      customDomain: data.customDomain || null,
      webhookUrl: data.webhookUrl || null,
    })
    .where(eq(agencies.id, agency.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
