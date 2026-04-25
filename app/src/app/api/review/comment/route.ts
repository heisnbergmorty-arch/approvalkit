import { NextResponse } from "next/server";
import { addComment } from "@/lib/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await addComment(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
