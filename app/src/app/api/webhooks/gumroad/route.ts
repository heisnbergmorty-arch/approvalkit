/**
 * Gumroad ping/webhook handler.
 *
 * Configure in Gumroad: Settings → Advanced → Ping URL =
 *   https://approvalkit-topaz.vercel.app/api/webhooks/gumroad
 *
 * Gumroad sends an `x-www-form-urlencoded` POST on:
 *   - sale            (resource_name=sale, refunded=false)
 *   - refund          (resource_name=sale, refunded=true)
 *   - dispute / chargeback (sets disputed/disputed_won fields)
 *
 * We only act on the email + sale_id. On sale we upsert into paidUsers; on
 * refund/chargeback we set refundedAt so signIn rejects them.
 *
 * Security: Gumroad does not sign pings. Use GUMROAD_PRODUCT_ID to verify the
 * ping is for our product (anyone could POST otherwise).
 */
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { paidUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const ALLOWED_PRODUCT_IDS = (process.env.GUMROAD_PRODUCT_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let body: Record<string, string> = {};

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    body = Object.fromEntries(new URLSearchParams(text)) as Record<string, string>;
  } else if (contentType.includes("application/json")) {
    body = (await req.json()) as Record<string, string>;
  } else {
    return NextResponse.json({ ok: false, error: "unsupported content-type" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const saleId = body.sale_id ?? body.id ?? "";
  const productId = body.product_id ?? body.product_permalink ?? "";
  const refunded = body.refunded === "true" || body.disputed === "true";

  if (!email || !saleId) {
    return NextResponse.json({ ok: false, error: "missing email or sale_id" }, { status: 400 });
  }

  // Verify the ping is for one of our products (skip in test if no allowlist).
  if (ALLOWED_PRODUCT_IDS.length && productId && !ALLOWED_PRODUCT_IDS.includes(productId)) {
    return NextResponse.json({ ok: false, error: "unknown product" }, { status: 400 });
  }

  if (refunded) {
    // Mark as refunded — signIn callback will reject.
    await db
      .update(paidUsers)
      .set({ refundedAt: new Date() })
      .where(eq(paidUsers.email, email));
    return NextResponse.json({ ok: true, action: "refunded" });
  }

  // Upsert sale.
  await db
    .insert(paidUsers)
    .values({
      email,
      gumroadSaleId: saleId,
      gumroadProductId: productId || null,
    })
    .onConflictDoUpdate({
      target: paidUsers.email,
      set: { gumroadSaleId: saleId, gumroadProductId: productId || null, refundedAt: null },
    });

  return NextResponse.json({ ok: true, action: "granted" });
}
