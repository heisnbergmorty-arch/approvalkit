import { NextResponse } from "next/server";
import { approveAsset } from "@/lib/actions";
import { checkReviewPinForSlug } from "@/lib/review-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const err = await checkReviewPinForSlug(body?.reviewSlug);
    if (err) {
      return NextResponse.json({ error: err }, { status: err === "pin_required" ? 401 : 400 });
    }
    const result = await approveAsset(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
