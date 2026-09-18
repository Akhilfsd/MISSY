export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(key: string, days: number): string {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + days);
  return toDayKey(d);
}

export function diffDays(a: string, b: string): number {
  const da = parseDayKey(a).getTime();
  const db = parseDayKey(b).getTime();
  return Math.round((db - da) / 86400000);
}

export function prettyDate(key: string): string {
  const d = parseDayKey(key);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function prettyShort(key: string): string {
  const d = parseDayKey(key);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function weekdayName(key: string): string {
  return parseDayKey(key).toLocaleDateString("en-GB", { weekday: "long" });
}

export type AgeBreakdown = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
};

export function computeAge(birthdayKey: string, now: Date): AgeBreakdown {
  const b = parseDayKey(birthdayKey);
  let years = now.getFullYear() - b.getFullYear();
  let months = now.getMonth() - b.getMonth();
  let days = now.getDate() - b.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const ms = now.getTime() - b.getTime();
  const totalSeconds = Math.floor(ms / 1000);
  return {
    years,
    months,
    days,
    totalDays: Math.floor(totalSeconds / 86400),
    totalHours: Math.floor(totalSeconds / 3600),
    totalMinutes: Math.floor(totalSeconds / 60),
    totalSeconds,
  };
}

export type BirthdayInfo = {
  isBirthday: boolean;
  nextDate: Date;
  turning: number;
  previousAge: number;
  nextAge: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function birthdayInfo(birthdayKey: string, now: Date): BirthdayInfo {
  const b = parseDayKey(birthdayKey);
  const isBirthday = now.getMonth() === b.getMonth() && now.getDate() === b.getDate();
  let next = new Date(now.getFullYear(), b.getMonth(), b.getDate(), 0, 0, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate(), 0, 0, 0, 0);
  }
  const current = computeAge(birthdayKey, now).years;
  const diff = Math.max(0, next.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    isBirthday,
    nextDate: next,
    turning: next.getFullYear() - b.getFullYear(),
    previousAge: Math.max(0, current - 1),
    nextAge: current + 1,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };
}

export type CyclePhase = "period" | "follicular" | "ovulation" | "luteal";

export type CycleInfo = {
  hasData: boolean;
  cycleDay: number;
  cycleLength: number;
  periodDuration: number;
  periodStart: string;
  nextPeriod: string;
  daysUntilNext: number;
  phase: CyclePhase;
  isPeriodDay: boolean;
  periodDayNumber: number;
  fertileStart: string;
  fertileEnd: string;
};

export function computeCycle(
  lastPeriodStart: string | null,
  cycleLength: number,
  periodDuration: number,
  todayKey: string,
): CycleInfo | null {
  if (!lastPeriodStart) return null;
  const len = Math.max(20, Math.min(45, cycleLength || 28));
  const dur = Math.max(1, Math.min(12, periodDuration || 5));
  let start = lastPeriodStart;
  // roll forward through predicted cycles until the current one
  let guard = 0;
  while (diffDays(start, todayKey) >= len && guard < 100) {
    start = addDays(start, len);
    guard += 1;
  }
  const elapsed = diffDays(start, todayKey);
  const cycleDay = elapsed + 1;
  const nextPeriod = addDays(start, len);
  const daysUntilNext = diffDays(todayKey, nextPeriod);
  const isPeriodDay = cycleDay >= 1 && cycleDay <= dur;
  const ovulationDay = len - 14;
  let phase: CyclePhase = "luteal";
  if (isPeriodDay) phase = "period";
  else if (cycleDay < ovulationDay - 1) phase = "follicular";
  else if (cycleDay <= ovulationDay + 1) phase = "ovulation";
  return {
    hasData: true,
    cycleDay,
    cycleLength: len,
    periodDuration: dur,
    periodStart: start,
    nextPeriod,
    daysUntilNext,
    phase,
    isPeriodDay,
    periodDayNumber: isPeriodDay ? cycleDay : 0,
    fertileStart: addDays(start, ovulationDay - 5),
    fertileEnd: addDays(start, ovulationDay + 1),
  };
}

export function greeting(now: Date): { text: string; emoji: string } {
  const h = now.getHours();
  if (h < 12) return { text: "Good Morning", emoji: "🌷" };
  if (h < 17) return { text: "Good Afternoon", emoji: "🌼" };
  if (h < 21) return { text: "Good Evening", emoji: "🌙" };
  return { text: "Good Night", emoji: "✨" };
}

export function nf(n: number): string {
  return n.toLocaleString("en-US");
}
