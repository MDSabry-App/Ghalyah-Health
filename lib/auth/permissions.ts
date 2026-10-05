import { db } from "@/lib/db";
import { householdMemberships } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function assertMember(householdId: string, userId: string) {
  const row = await db.select().from(householdMemberships)
    .where(and(eq(householdMemberships.householdId, householdId), eq(householdMemberships.userId, userId)));
  if (row.length === 0) throw new Error("FORBIDDEN: not a member of household");
  return row[0];
}