import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL_MISSING_ON_VERCEL" }, { status: 500 });
    }
    const { getDb } = await import("@/lib/db");
    const { doseOccurrences } = await import("@/lib/db/schema");
    const { lt, eq, and } = await import("drizzle-orm");
    const db = getDb();
    const now = new Date();
    const due = await db.select().from(doseOccurrences)
      .where(and(eq(doseOccurrences.status, "upcoming"), lt(doseOccurrences.scheduledAt, now))).limit(50);
    for (const occ of due) {
      await db.update(doseOccurrences).set({ status: "due" }).where(eq(doseOccurrences.id, occ.id));
    }
    return NextResponse.json({ success: true, processed: due.length, time: now.toISOString() });
  } catch (e: any) {
    console.error("CRON_ERROR", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}