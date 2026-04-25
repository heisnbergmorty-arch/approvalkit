/**
 * Database schema for ApprovalKit.
 *
 * Five tables drive the entire product:
 *   agencies   — the customer (one per ApprovalKit install)
 *   projects   — work for one client
 *   assets     — files within a project (logos, mocks, PDFs)
 *   comments   — pixel-anchored or general feedback on an asset
 *   approvals  — explicit "I approve this" events
 *
 * Plus standard Auth.js tables (users / accounts / sessions / verificationTokens).
 */

import { pgTable, text, timestamp, uuid, integer, boolean, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// Auth.js standard tables (drizzle adapter spec)
// ============================================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.identifier, t.token] }) }),
);

// ============================================================================
// Payment gating — Gumroad-paid customers
// ============================================================================

/**
 * paidUsers = email allowlist populated by Gumroad sale webhook.
 * Only emails in this table can complete magic-link signin.
 * Refunds set refundedAt → signIn callback rejects.
 */
export const paidUsers = pgTable("paidUsers", {
  email: text("email").primaryKey(),
  gumroadSaleId: text("gumroadSaleId").notNull(),
  gumroadProductId: text("gumroadProductId"),
  paidAt: timestamp("paidAt").defaultNow().notNull(),
  refundedAt: timestamp("refundedAt"),
});

// ============================================================================
// ApprovalKit domain tables
// ============================================================================

/**
 * An agency = one ApprovalKit instance. In a self-hosted setup this is usually
 * exactly one row, but keeping it relational means future multi-tenant SaaS
 * deployments are trivial.
 */
export const agencies = pgTable("agencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerUserId: uuid("ownerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // used in client portal URLs
  logoUrl: text("logoUrl"),
  brandColor: text("brandColor").default("#6366f1"),
  customDomain: text("customDomain"),
  webhookUrl: text("webhookUrl"),
  emailIntro: text("emailIntro"), // optional opener for client review-link emails
  emailSignature: text("emailSignature"), // optional sign-off / sender name
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * A project = one chunk of work for one client. Generates a unique reviewSlug
 * so the client can access their portal without an account.
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agencyId: uuid("agencyId").notNull().references(() => agencies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    clientName: text("clientName").notNull(),
    clientEmail: text("clientEmail").notNull(),
    reviewSlug: text("reviewSlug").notNull().unique(), // public-but-unguessable token in URL
    status: text("status", { enum: ["active", "archived"] }).default("active").notNull(),
    description: text("description"),
    notifyMode: text("notifyMode", {
      enum: ["instant", "digest", "off"],
    }).default("instant").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({ agencyIdx: index("projects_agency_idx").on(t.agencyId) }),
);

/**
 * An asset = a single file the client reviews. Multi-version: a new version
 * inherits the same `groupKey` so the timeline can show "Logo v1, v2, v3."
 */
export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    groupKey: text("groupKey").notNull(), // groups versions: "logo-concepts"
    version: integer("version").default(1).notNull(),
    label: text("label").notNull(), // "Concept A — Geometric"
    fileUrl: text("fileUrl").notNull(),
    mimeType: text("mimeType").notNull(),
    fileSizeBytes: integer("fileSizeBytes"),
    status: text("status", {
      enum: ["pending", "approved", "changes_requested"],
    }).default("pending").notNull(),
    isCurrentVersion: boolean("isCurrentVersion").default(true).notNull(),
    internalNote: text("internalNote"), // agency-only notes, never shown to client
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    projectIdx: index("assets_project_idx").on(t.projectId),
    groupIdx: index("assets_group_idx").on(t.projectId, t.groupKey),
  }),
);

/**
 * A comment = one piece of feedback on an asset. Anchored optionally to a
 * pixel coordinate (xPct/yPct as percentage so it scales) for visual feedback.
 */
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("assetId").notNull().references(() => assets.id, { onDelete: "cascade" }),
    authorName: text("authorName").notNull(),
    authorEmail: text("authorEmail"),
    isFromAgency: boolean("isFromAgency").default(false).notNull(),
    body: text("body").notNull(),
    xPct: integer("xPct"), // 0-10000 (basis points for precision); null = general comment
    yPct: integer("yPct"),
    resolved: boolean("resolved").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({ assetIdx: index("comments_asset_idx").on(t.assetId) }),
);

/**
 * An approval = explicit sign-off event on an asset. Stored as immutable log;
 * even if status changes later, you have an audit trail of "Sarah approved
 * Concept B at 2:14pm on May 9."
 */
export const approvals = pgTable(
  "approvals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("assetId").notNull().references(() => assets.id, { onDelete: "cascade" }),
    approverName: text("approverName").notNull(),
    approverEmail: text("approverEmail"),
    approvedAt: timestamp("approvedAt").defaultNow().notNull(),
  },
  (t) => ({ assetIdx: index("approvals_asset_idx").on(t.assetId) }),
);

// ============================================================================
// Relations (for Drizzle's query API)
// ============================================================================

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  owner: one(users, { fields: [agencies.ownerUserId], references: [users.id] }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  agency: one(agencies, { fields: [projects.agencyId], references: [agencies.id] }),
  assets: many(assets),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  project: one(projects, { fields: [assets.projectId], references: [projects.id] }),
  comments: many(comments),
  approvals: many(approvals),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  asset: one(assets, { fields: [comments.assetId], references: [assets.id] }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  asset: one(assets, { fields: [approvals.assetId], references: [assets.id] }),
}));
