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
  emailIntro: z.string().max(500).optional().or(z.literal("")),
  emailSignature: z.string().max(120).optional().or(z.literal("")),
});

export async function updateSettings(formData: FormData) {
  const { agency } = await requireAgency();
  const data = settingsSchema.parse({
    name: formData.get("name"),
    brandColor: formData.get("brandColor") || "#6366f1",
    logoUrl: formData.get("logoUrl") || "",
    customDomain: formData.get("customDomain") || "",
    webhookUrl: formData.get("webhookUrl") || "",
    emailIntro: formData.get("emailIntro") || "",
    emailSignature: formData.get("emailSignature") || "",
  });

  await db
    .update(agencies)
    .set({
      name: data.name,
      brandColor: data.brandColor,
      logoUrl: data.logoUrl || null,
      customDomain: data.customDomain || null,
      webhookUrl: data.webhookUrl || null,
      emailIntro: data.emailIntro || null,
      emailSignature: data.emailSignature || null,
    })
    .where(eq(agencies.id, agency.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function testWebhook(): Promise<{ ok: boolean; status?: number; error?: string }> {
  const { agency } = await requireAgency();
  if (!agency.webhookUrl) {
    return { ok: false, error: "No webhook URL saved yet. Save one above first." };
  }
  const payload = {
    event: "asset.approved" as const,
    agencyId: agency.id,
    projectId: "test-project",
    projectName: "ApprovalKit test ping",
    assetLabel: "Logo — Concept B",
    actorName: "ApprovalKit",
    url: "https://approvalkit-topaz.vercel.app/dashboard",
    timestamp: new Date().toISOString(),
    test: true,
  };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(agency.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "request failed" };
  }
}

export async function sendTestEmail(): Promise<{
  ok: boolean;
  to?: string;
  error?: string;
}> {
  const { agency, userId } = await requireAgency();
  const { db: dbi } = await import("@/db/client");
  const { users } = await import("@/db/schema");
  const u = await dbi.query.users.findFirst({ where: eq(users.id, userId) });
  const to = u?.email;
  if (!to) return { ok: false, error: "No email on your account." };

  // Lazy import to avoid pulling Resend into other server actions' bundles.
  const { sendEmail, reviewLinkEmail } = await import("@/lib/email");
  try {
    await sendEmail({
      to,
      subject: `[Test] ${agency.name} — review work for Sample Project`,
      html: reviewLinkEmail({
        agencyName: agency.name,
        brandColor: agency.brandColor ?? "#6366f1",
        clientName: "Test Client",
        projectName: "Sample Project",
        reviewUrl: "https://approvalkit-topaz.vercel.app/demo",
        intro: agency.emailIntro,
        signature: agency.emailSignature,
      }),
    });
    return { ok: true, to };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
