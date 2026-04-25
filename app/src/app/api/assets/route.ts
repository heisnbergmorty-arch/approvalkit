import { NextResponse } from "next/server";
import { createAsset } from "@/lib/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await createAsset(body);
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
