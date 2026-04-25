/**
 * Asset access logs (added in v0.4 for "who's seen this" UX).
 * We log a row each time the public review portal is loaded for a slug.
 * This is the table; a follow-up migration will be needed.
 */
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { projects } from "./schema";

export const reviewViews = pgTable(
  "reviewViews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userAgent: text("userAgent"),
    ipHash: text("ipHash"), // sha256 of IP+secret, never raw IP
    viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  },
  (t) => ({ projectIdx: index("review_views_project_idx").on(t.projectId) }),
);
