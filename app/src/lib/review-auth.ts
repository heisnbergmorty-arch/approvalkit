import { cookies } from "next/headers";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * For PIN-gated review links, verify the cookie matches the project's PIN.
 * Returns null on success, or an Error message string on failure.
 * If the project has no PIN, always succeeds.
 */
export async function checkReviewPinForSlug(reviewSlug: string): Promise<string | null> {
  if (!reviewSlug || typeof reviewSlug !== "string") return "missing_slug";
  const project = await db.query.projects.findFirst({
    where: eq(projects.reviewSlug, reviewSlug),
  });
  if (!project) return "not_found";
  if (!project.reviewPin) return null;
  const jar = await cookies();
  const cookiePin = jar.get(`rvpin_${project.id}`)?.value;
  if (cookiePin !== project.reviewPin) return "pin_required";
  return null;
}
