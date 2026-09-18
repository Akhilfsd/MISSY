import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { checkins, checklistCompletions, checklistItems, periodLogs } from "@/db/schema";
import { withUser, dayKey } from "@/lib/api";
import { computeCycle } from "@/lib/dates";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return withUser(async ({ user, settings: s }) => {
    const day = dayKey(url.searchParams.get("date"), "date");

    const items = await db
      .select()
      .from(checklistItems)
      .where(and(eq(checklistItems.userId, user.id), eq(checklistItems.archived, false)));

    const ids = items.map((i) => i.id);
    const completions = ids.length
      ? await db
          .select()
          .from(checklistCompletions)
          .where(and(eq(checklistCompletions.day, day), inArray(checklistCompletions.itemId, ids)))
      : [];

    const doneIds = new Set(completions.filter((c) => c.done).map((c) => c.itemId));

    const checkin =
      (
        await db
          .select()
          .from(checkins)
          .where(and(eq(checkins.userId, user.id), eq(checkins.day, day)))
          .limit(1)
      )[0] ?? null;

    const periodLog =
      (
        await db
          .select()
          .from(periodLogs)
          .where(and(eq(periodLogs.userId, user.id), eq(periodLogs.day, day)))
          .limit(1)
      )[0] ?? null;

    const cycle = computeCycle(s.lastPeriodStart, s.cycleLength, s.periodDuration, day);

    return {
      day,
      items: items
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((i) => ({ ...i, done: doneIds.has(i.id) })),
      checkin,
      periodLog,
      cycle,
    };
  });
}
