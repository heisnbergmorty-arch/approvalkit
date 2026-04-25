/**
 * License verification proxy for self-hosted ApprovalKit installs.
 *
 * Sold via Gumroad → buyer receives license key → sets LICENSE_KEY env →
 * on boot, app calls Gumroad's `licenses/verify` endpoint via this route to
 * confirm the key is valid and not refunded.
 *
 * GUMROAD_PRODUCT_PERMALINK is set on the seller side (us, the maker).
 *
 * Public endpoint — no auth required because the key itself is the secret.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ licenseKey: z.string().min(8).max(200) });

const PRODUCT = process.env.GUMROAD_PRODUCT_PERMALINK;

export async function POST(req: Request) {
  if (!PRODUCT) {
    return NextResponse.json({ valid: false, error: "GUMROAD_PRODUCT_PERMALINK not set" }, { status: 500 });
  }

  let data;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ valid: false, error: "bad request" }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("product_permalink", PRODUCT);
  form.set("license_key", data.licenseKey);
  form.set("increment_uses_count", "false");

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    body: form,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

  const json = (await res.json()) as { success: boolean; purchase?: { refunded?: boolean; chargebacked?: boolean; email?: string } };

  if (!json.success || json.purchase?.refunded || json.purchase?.chargebacked) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, email: json.purchase?.email });
}
