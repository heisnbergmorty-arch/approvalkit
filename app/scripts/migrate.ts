/**
 * Apply Drizzle migrations to the database.
 * Reads ./drizzle/*.sql and executes them in order.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const client = postgres(url, { max: 1 });
const db = drizzle(client);

(async () => {
  console.log("Running migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations applied");
  await client.end();
})();
