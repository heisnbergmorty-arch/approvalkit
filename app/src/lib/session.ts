import { auth } from "@/auth";
import { db } from "@/db/client";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function requireAgency() {
  const userId = await requireUserId();
  const agency = await db.query.agencies.findFirst({
    where: eq(agencies.ownerUserId, userId),
  });
  if (!agency) throw new Error("NO_AGENCY");
  return { userId, agency };
}

export function appUrl(path = ""): string {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
