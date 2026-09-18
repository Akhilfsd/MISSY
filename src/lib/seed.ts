import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  capabilities,
  checkins,
  checklistItems,
  cycles,
  events,
  goals,
  notes,
  periodLogs,
  settings,
  users,
} from "@/db/schema";
import { DEFAULT_CHECKLIST, SEED_NOTES } from "@/lib/content";
import { addDays, toDayKey } from "@/lib/dates";

export const PROFILE_EMAIL = "misba@pgl.app";

let cachedId: number | null = null;

/** Her last period, as requested: 6th → 10th September (most recent occurrence). */
function lastPeriodWindow(): { start: string; end: string } {
  const now = new Date();
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1; // Sept = month 8
  return {
    start: toDayKey(new Date(year, 8, 6)),
    end: toDayKey(new Date(year, 8, 10)),
  };
}

async function seedChecklistFor(userId: number) {
  const existing = await db.select().from(checklistItems).where(eq(checklistItems.userId, userId)).limit(1);
  if (existing.length) return;
  const rows = DEFAULT_CHECKLIST.flatMap((group) =>
    group.items.map((label, idx) => ({
      userId,
      partOfDay: group.part,
      label,
      sortOrder: idx,
    })),
  );
  await db.insert(checklistItems).values(rows);
}

/** Ensures the single profile exists (creating + seeding on first run) and returns its id. */
export async function ensureProfile(): Promise<number> {
  if (cachedId) return cachedId;

  const existing = await db.select().from(users).where(eq(users.email, PROFILE_EMAIL)).limit(1);
  if (existing.length) {
    cachedId = existing[0].id;
    return cachedId;
  }

  const { start: lastStart } = lastPeriodWindow();
  const today = toDayKey(new Date());

  const [user] = await db
    .insert(users)
    .values({
      email: PROFILE_EMAIL,
      passwordHash: "none",
      name: "Misba",
      nickname: "Pgl",
      birthday: "2005-02-23",
    })
    .returning();

  await db.insert(settings).values({
    userId: user.id,
    cycleLength: 28,
    periodDuration: 5,
    lastPeriodStart: lastStart,
    remindersEnabled: true,
    reminderIntervalMinutes: 120,
  });

  await seedChecklistFor(user.id);

  await db.insert(notes).values(SEED_NOTES.map((n) => ({ userId: user.id, category: n.category, body: n.body })));

  await db.insert(capabilities).values(
    [
      { text: "You are capable of learning anything you give time to", category: "Capable of" },
      { text: "You are capable of starting again", category: "Capable of" },
      { text: "You notice when people are quietly struggling", category: "Quality" },
      { text: "You keep going on days that feel heavy", category: "Strength" },
      { text: "You want a calm, honest, beautiful life — and you're building it", category: "Dream" },
      { text: "You finished things other people would have quit", category: "Achievement" },
    ].map((c) => ({ userId: user.id, ...c })),
  );

  await db.insert(goals).values([
    { userId: user.id, category: "dream", title: "A calm little home with big windows", description: "Plants on the sill, warm light, and no rush in the mornings.", progress: 20 },
    { userId: user.id, category: "goal", title: "Finish the course I started", description: "One small lesson at a time, no pressure.", progress: 45 },
    { userId: user.id, category: "learn", title: "Learn to make proper pasta", description: "Something to do on slow Sundays.", progress: 10 },
    { userId: user.id, category: "visit", title: "See the sea at least once this year", description: "Just to sit and look at it.", progress: 0 },
    { userId: user.id, category: "buy", title: "A soft reading chair", description: "The kind you disappear into.", progress: 0 },
    { userId: user.id, category: "proud", title: "I asked for help when I needed it", description: "That took more courage than it looks.", progress: 100, done: true },
    { userId: user.id, category: "improve", title: "Sleeping before midnight", description: "Slowly, 15 minutes earlier each week.", progress: 30 },
  ]);

  await db.insert(events).values([
    { userId: user.id, title: "Misba's Birthday", description: "The most important day of the year.", day: "2005-02-23", category: "birthday", repeatYearly: true },
    { userId: user.id, title: "Eye check-up", description: "Remember to carry the old prescription.", day: addDays(today, 6), time: "11:30", category: "appointment" },
    { userId: user.id, title: "Slow Sunday", description: "No plans. That's the plan.", day: addDays(today, 3), category: "personal" },
    { userId: user.id, title: "Monthly self-check", description: "Refill supplies, tidy the desk, breathe.", day: addDays(today, 12), category: "monthly" },
  ]);

  const { start: cur, end: curEnd } = lastPeriodWindow();
  await db.insert(cycles).values([
    { userId: user.id, startDate: cur, endDate: curEnd, notes: "Lighter than usual." },
    { userId: user.id, startDate: addDays(cur, -28), endDate: addDays(cur, -23), notes: "Cramps on day 1 and 2." },
    { userId: user.id, startDate: addDays(cur, -56), endDate: addDays(cur, -51), notes: "" },
  ]);

  await db.insert(periodLogs).values([
    { userId: user.id, day: cur, pain: 6, energy: "low", mood: "tired", symptoms: "Cramps,Fatigue", careDone: "Drink water,Rest when needed", note: "Warm water helped." },
    { userId: user.id, day: addDays(cur, 1), pain: 4, energy: "low", mood: "calm", symptoms: "Back pain", careDone: "Drink water,Eat proper meals" },
  ]);

  await db.insert(checkins).values([
    { userId: user.id, day: addDays(today, -1), mood: "peaceful", energy: "medium", stress: 2, note: "Quiet day. Finished one small thing and that was enough." },
    { userId: user.id, day: addDays(today, -2), mood: "tired", energy: "low", stress: 4, note: "Slept badly but still showed up. Counting that as a win." },
    { userId: user.id, day: addDays(today, -4), mood: "happy", energy: "high", stress: 1, note: "Good tea, good music, no overthinking." },
  ]);

  cachedId = user.id;
  return user.id;
}
