import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { doseEvents, doseOccurrences, inventoryEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Decimal from "decimal.js";

export async function POST(req: NextRequest) {
  const { occurrenceId, medicationId, personId, quantity, operationId, userId } = await req.json();
  
  if (!operationId || !occurrenceId) {
    return NextResponse.json({ error: "operationId required" }, { status: 400 });
  }

  // idempotency - لو نفس العملية اتبعتت قبل كده رجع نجاح بدون خصم تاني
  const existing = await db.select().from(doseEvents).where(eq(doseEvents.operationId, operationId));
  if (existing.length > 0) {
    return NextResponse.json({ success: true, deduplicated: true });
  }

  // هات اخر رصيد
  const lastInventory = await db.select().from(inventoryEvents)
    .where(eq(inventoryEvents.medicationId, medicationId))
    .orderBy(inventoryEvents.createdAt).limit(1);
  
  const balanceBefore = lastInventory[0] ? new Decimal(lastInventory[0].balanceAfter) : new Decimal(0);
  const qty = new Decimal(quantity);
  
  if (balanceBefore.lessThan(qty)) {
    return NextResponse.json({ error: "INSUFFICIENT_STOCK" }, { status: 409 });
  }
  
  const balanceAfter = balanceBefore.sub(qty);

  await db.transaction(async (tx) => {
    await tx.insert(doseEvents).values({
      occurrenceId, medicationId, personId, quantity: qty.toString(), type: "taken", recordedBy: userId, operationId
    });
    await tx.update(doseOccurrences).set({ status: "taken" }).where(eq(doseOccurrences.id, occurrenceId));
    await tx.insert(inventoryEvents).values({
      medicationId, personId, type: "taken_dose", quantity: qty.neg().toString(),
      balanceBefore: balanceBefore.toString(), balanceAfter: balanceAfter.toString(),
      operationId, createdBy: userId
    });
  });

  return NextResponse.json({ success: true, balanceAfter: balanceAfter.toString() });
}