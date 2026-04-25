/**
 * Drizzle DB client.
 *
 * postgres-js is lazy — it doesn't open a TCP connection at construct time,
 * only when a query runs. So we can use a dummy URL during `next build`
 * (which imports route modules to collect static data) without crashing.
 * At runtime, if DATABASE_URL is still missing, the first query will fail.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://build:build@localhost:5432/build";

if (!process.env.DATABASE_URL && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[db] DATABASE_URL is not set. Queries will fail.");
}

const globalForDb = globalThis as unknown as {
  conn?: ReturnType<typeof postgres>;
};

const conn = globalForDb.conn ?? postgres(connectionString, { max: 5 });
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export type DB = typeof db;
