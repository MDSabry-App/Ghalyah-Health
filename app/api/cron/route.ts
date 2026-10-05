import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { doseOccurrences } from "@/lib/db/schema";
import { lt, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// cron-job.org يضرب كل دقيقة
export async function GET(req: NextRequest) {
  // حماية اختيارية
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    // اسمح حالياً بدون حماية لو لم تضع CRON_SECRET
  }

  const now = new Date();
  
  // 1. هات كل الجرعات اللي معادها جه ولسه upcoming
  const due = await db.select().from(doseOccurrences)
    .where(and(
      eq(doseOccurrences.status, "upcoming"),
      lt(doseOccurrences.scheduledAt, now)
    )).limit(50);

  // 2. اقلبها لـ due
  for (const occ of due) {
    await db.update(doseOccurrences).set({ status: "due" }).where(eq(doseOccurrences.id, occ.id));
  }

  // 3. هنا لاحقاً هنضيف Local Push + تصعيد الابن T+10/T+20
  return NextResponse.json({ success: true, processed: due.length, time: now.toISOString() });
}