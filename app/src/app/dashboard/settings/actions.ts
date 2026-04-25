"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAgency } from "@/lib/session";

const settingsSchema = z.object({
  customDomain: z.string().max(120).optional().or(z.literal("")),
  webhookUrl: z.string().url().max(500).optional().or(z.literal("")),
});

export async function updateSettings(formData: FormData) {
  const { agency } = await requireAgency();
  const data = settingsSchema.parse({
    customDomain: formData.get("customDomain") || "",
    webhookUrl: formData.get("webhookUrl") || "",
  });

  await db.update(agencies)
    .set({
      customDomain: data.customDomain || null,
      webhookUrl: data.webhookUrl || null,
    })
    .where(eq(agencies.id, agency.id));

  revalidatePath("/dashboard/settings");
}
