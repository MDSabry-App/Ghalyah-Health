import Decimal from "decimal.js";

export function calcTotalUnits(strips: number, unitsPerStrip: number) {
  return new Decimal(strips).mul(unitsPerStrip);
}

export function calcRemainingDays(balance: string | number, dosesPerDay: number, qtyPerDose: string | number) {
  if (dosesPerDay === 0) return null; // PRN
  const daily = new Decimal(dosesPerDay).mul(qtyPerDose);
  if (daily.eq(0)) return null;
  return new Decimal(balance).div(daily).floor();
}

export function calcCurrentBalance(events: { quantity: string }[]): Decimal {
  return events.reduce((acc, e) => acc.add(new Decimal(e.quantity)), new Decimal(0));
}

export function canFulfill(balance: Decimal, qty: Decimal): boolean {
  return balance.greaterThanOrEqualTo(qty);
}