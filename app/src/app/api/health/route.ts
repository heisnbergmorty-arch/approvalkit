/**
 * Health check — returns 200 if DB is reachable.
 * Use as uptime probe (UptimeRobot, BetterUptime, etc.).
 */
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { status: "error", error: (e as Error).message },
      { status: 503 },
    );
  }
}
