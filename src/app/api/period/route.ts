import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cycles, periodLogs, settings } from "@/db/schema";
import { badRequest, dayKey, num, str, withUser } from "@/lib/api";

/** Upsert the daily period-care log. */
export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const day = dayKey(body.day, "day");
    const pain = num(body.pain, "Pain", 0, 10, 0);
    const energy = str(body.energy, "Energy", 10, false) || "medium";
    const mood = str(body.mood, "Mood", 20, false) || "calm";
    const symptoms = Array.isArray(body.symptoms) ? (body.symptoms as string[]).join(",").slice(0, 300) : "";
    const careDone = Array.isArray(body.careDone) ? (body.careDone as string[]).join(",").slice(0, 600) : "";
    const note = str(body.note, "Note", 2000, false);
    const existing = (
      await db
        .select()
        .from(periodLogs)
        .where(and(eq(periodLogs.userId, user.id), eq(periodLogs.day, day)))
        .limit(1)
    )[0];
    if (existing) {
      const [row] = await db
        .update(periodLogs)
        .set({ pain, energy, mood, symptoms, careDone, note })
        .where(eq(periodLogs.id, existing.id))
        .returning();
      return { log: row };
    }
    const [row] = await db
      .insert(periodLogs)
      .values({ userId: user.id, day, pain, energy, mood, symptoms, careDone, note })
      .returning();
    return { log: row };
  });
}

/** Cycle history operations. */
export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db
      .select()
      .from(cycles)
      .where(eq(cycles.userId, user.id))
      .orderBy(desc(cycles.startDate))
      .limit(24);
    const logs = await db
      .select()
      .from(periodLogs)
      .where(eq(periodLogs.userId, user.id))
      .orderBy(desc(periodLogs.day))
      .limit(60);
    return { cycles: rows, logs };
  });
}

/**
 * Log a new period (start, optional end). The start becomes the prediction
 * anchor and, when an end date is given, the period duration is updated too so
 * the tracker reflects her actual last period.
 */
export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const startDate = dayKey(body.startDate, "Start date");
    let endDate: string | null = null;
    if (typeof body.endDate === "string" && body.endDate.trim()) {
      endDate = dayKey(body.endDate, "End date");
      if (endDate < startDate) badRequest("The end date can't be before the start date.");
    }
    const notes = str(body.notes, "Notes", 500, false);

    const [row] = await db
      .insert(cycles)
      .values({ userId: user.id, startDate, endDate, notes })
      .returning();

    const patch: { lastPeriodStart: string; periodDuration?: number } = { lastPeriodStart: startDate };
    if (endDate) {
      const days = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
      patch.periodDuration = Math.min(12, Math.max(1, days));
    }
    await db.update(settings).set(patch).where(eq(settings.userId, user.id));
    return { cycle: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(cycles).where(and(eq(cycles.id, id), eq(cycles.userId, user.id)));
    return { ok: true };
  });
}
