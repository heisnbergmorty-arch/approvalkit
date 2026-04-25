/**
 * Outbound webhooks. Agencies can paste a URL (Slack incoming webhook,
 * Zapier catch-hook, n8n, custom) and we POST a JSON payload on key events.
 *
 * Currently fires on: asset.approved, comment.created
 *
 * Best-effort: we don't retry, we don't store delivery history. Caller is
 * expected to be fast (<2s) or use a queue downstream.
 */
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";

interface WebhookPayload {
  event: "asset.approved" | "comment.created";
  agencyId: string;
  projectId: string;
  projectName: string;
  assetLabel: string;
  actorName: string;
  url: string;
  body?: string;
  timestamp: string;
}

export async function fireWebhook(agencyId: string, payload: Omit<WebhookPayload, "agencyId" | "timestamp">) {
  const a = await db.query.agencies.findFirst({ where: eq(agencies.id, agencyId) });
  // webhookUrl column is optional; bail if not configured
  // (We add the column lazily — older installs won't have it.)
  const webhookUrl = (a as unknown as { webhookUrl?: string | null })?.webhookUrl;
  if (!webhookUrl) return;

  const fullPayload: WebhookPayload = {
    ...payload,
    agencyId,
    timestamp: new Date().toISOString(),
  };

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(fullPayload),
      signal: ctrl.signal,
    });
    clearTimeout(t);
  } catch (e) {
    console.warn("[webhook] delivery failed", agencyId, e);
  }
}
