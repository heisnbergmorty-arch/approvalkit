/**
 * Seed: generates a demo agency + project + assets so a buyer can play with
 * the app immediately after install. Idempotent — running twice is safe.
 *
 * Usage: pnpm tsx scripts/seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { db } from "../src/db/client";
import { users, agencies, projects, assets, comments } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { reviewSlug } from "../src/lib/ids";

async function main() {
  const demoEmail = "demo@approvalkit.local";

  let user = await db.query.users.findFirst({ where: eq(users.email, demoEmail) });
  if (!user) {
    [user] = await db.insert(users).values({ email: demoEmail, name: "Demo Owner" }).returning();
  }

  let agency = await db.query.agencies.findFirst({ where: eq(agencies.ownerUserId, user.id) });
  if (!agency) {
    [agency] = await db.insert(agencies).values({
      ownerUserId: user.id,
      name: "Northstar Studio",
      slug: "northstar-studio",
      brandColor: "#6366f1",
    }).returning();
  }

  const slug = reviewSlug();
  const [project] = await db.insert(projects).values({
    agencyId: agency.id,
    name: "Acme Co — Brand Identity",
    clientName: "Sarah Chen",
    clientEmail: "sarah@acme.com",
    reviewSlug: slug,
    description: "Logo, color palette, and brand guidelines for Acme Co's Q3 launch.",
  }).returning();

  const [logo] = await db.insert(assets).values({
    projectId: project.id,
    groupKey: "logo",
    version: 1,
    label: "Logo — Geometric Concept",
    fileUrl: "https://placehold.co/1200x800/6366f1/ffffff/png?text=Logo+v1",
    mimeType: "image/png",
    isCurrentVersion: true,
  }).returning();

  await db.insert(assets).values({
    projectId: project.id,
    groupKey: "palette",
    version: 1,
    label: "Color Palette",
    fileUrl: "https://placehold.co/1200x800/0f172a/ffffff/png?text=Palette",
    mimeType: "image/png",
    isCurrentVersion: true,
  });

  await db.insert(comments).values({
    assetId: logo.id,
    authorName: "Sarah Chen",
    isFromAgency: false,
    body: "Love the direction! Can we try a slightly bolder weight?",
  });

  console.log("✓ Seeded demo data");
  console.log(`  Login as: ${demoEmail}`);
  console.log(`  Client review URL: /review/${slug}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
