import { resolveDoseTime } from "./resolver";

type RuleConfig = { times: string[]; daysOfWeek?: number[]; intervalDays?: number; quantity: string };

export function generateOccurrences(
  ruleType: string,
  config: RuleConfig,
  from: Date,
  days: number = 14
): Date[] {
  const out: Date[] = [];
  if (ruleType === "prn") return out;

  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    const dayIdx = d.getDay();

    if (ruleType === "weekly" && config.daysOfWeek && !config.daysOfWeek.includes(dayIdx)) continue;
    if (ruleType === "every_n_days" && i % (config.intervalDays || 1) !== 0) continue;

    for (const t of config.times) {
      const [h, m] = t.split(":").map(Number);
      const occ = new Date(d);
      occ.setHours(h, m, 0, 0);
      if (occ >= from) out.push(occ);
    }
  }
  return out;
}