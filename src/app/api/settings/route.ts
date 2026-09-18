import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { customReminders, settings, users } from "@/db/schema";
import { dayKey, num, str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user, settings: s }) => {
    const reminders = await db.select().from(customReminders).where(eq(customReminders.userId, user.id));
    return { user: { ...user, passwordHash: undefined }, settings: s, reminders };
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const userPatch: Record<string, unknown> = {};
    if (typeof body.name === "string") userPatch.name = str(body.name, "Name", 120);
    if (typeof body.nickname === "string") userPatch.nickname = str(body.nickname, "Nickname", 60);
    if (typeof body.birthday === "string") userPatch.birthday = dayKey(body.birthday, "Birthday");
    if (Object.keys(userPatch).length) {
      await db.update(users).set(userPatch).where(eq(users.id, user.id));
    }

    const patch: Record<string, unknown> = {};
    if (body.cycleLength !== undefined) patch.cycleLength = num(body.cycleLength, "Cycle length", 20, 45, 28);
    if (body.periodDuration !== undefined) patch.periodDuration = num(body.periodDuration, "Period duration", 1, 12, 5);
    if (typeof body.lastPeriodStart === "string" && body.lastPeriodStart)
      patch.lastPeriodStart = dayKey(body.lastPeriodStart, "Period start");
    if (typeof body.remindersEnabled === "boolean") patch.remindersEnabled = body.remindersEnabled;
    if (body.reminderIntervalMinutes !== undefined)
      patch.reminderIntervalMinutes = num(body.reminderIntervalMinutes, "Interval", 15, 480, 120);
    if (typeof body.quietStart === "string") patch.quietStart = str(body.quietStart, "Quiet start", 5);
    if (typeof body.quietEnd === "string") patch.quietEnd = str(body.quietEnd, "Quiet end", 5);
    if (typeof body.theme === "string") patch.theme = str(body.theme, "Theme", 10);
    if (typeof body.accent === "string") patch.accent = str(body.accent, "Accent", 20);
    if (Array.isArray(body.reminderCategories))
      patch.reminderCategories = (body.reminderCategories as string[]).join(",").slice(0, 300);
    if (typeof body.notifyBrowser === "boolean") patch.notifyBrowser = body.notifyBrowser;

    if (Object.keys(patch).length) {
      await db.update(settings).set(patch).where(eq(settings.userId, user.id));
    }
    const s = (await db.select().from(settings).where(eq(settings.userId, user.id)).limit(1))[0];
    const u = (await db.select().from(users).where(eq(users.id, user.id)).limit(1))[0];
    return { settings: s, user: { ...u, passwordHash: undefined } };
  });
}

/** Custom reminder messages. */
export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const text = str(body.text, "Reminder", 200);
    const [row] = await db.insert(customReminders).values({ userId: user.id, text }).returning();
    return { reminder: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(customReminders).where(and(eq(customReminders.id, id), eq(customReminders.userId, user.id)));
    return { ok: true };
  });
}
