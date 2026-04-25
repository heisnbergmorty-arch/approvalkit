import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Ctx { params: Promise<{ slug: string }> }

export async function POST(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const pin = (body.pin ?? "").trim();
  if (!pin) return NextResponse.json({ error: "missing_pin" }, { status: 400 });

  const project = await db.query.projects.findFirst({
    where: eq(projects.reviewSlug, slug),
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!project.reviewPin) return NextResponse.json({ ok: true });
  if (project.reviewPin !== pin) {
    return NextResponse.json({ error: "wrong_pin" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(`rvpin_${project.id}`, pin, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return NextResponse.json({ ok: true });
}
