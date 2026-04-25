import { NextResponse } from "next/server";
import { approveAsset } from "@/lib/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await approveAsset(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
