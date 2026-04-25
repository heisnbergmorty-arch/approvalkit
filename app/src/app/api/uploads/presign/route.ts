import { NextResponse } from "next/server";
import { z } from "zod";
import { presignUpload } from "@/lib/storage";
import { requireUserId } from "@/lib/session";

const schema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  try {
    await requireUserId();
    const data = schema.parse(await req.json());
    const result = await presignUpload(data.filename, data.contentType);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
