import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { checklistCompletions, checklistItems } from "@/db/schema";
import { badRequest, dayKey, str, withUser } from "@/lib/api";

/** Toggle a checklist item for a given day. */
export async function POST(request: Request) {
  const body = (await request.json()) as { itemId?: number; day?: string; done?: boolean };
  return withUser(async ({ user }) => {
    const day = dayKey(body.day, "day");
    const itemId = Number(body.itemId);
    const item = (
      await db
        .select()
        .from(checklistItems)
        .where(and(eq(checklistItems.id, itemId), eq(checklistItems.userId, user.id)))
        .limit(1)
    )[0];
    if (!item) badRequest("That item no longer exists.");
    const done = Boolean(body.done);
    const existing = (
      await db
        .select()
        .from(checklistCompletions)
        .where(and(eq(checklistCompletions.itemId, itemId), eq(checklistCompletions.day, day)))
        .limit(1)
    )[0];
    if (existing) {
      await db.update(checklistCompletions).set({ done }).where(eq(checklistCompletions.id, existing.id));
    } else {
      await db.insert(checklistCompletions).values({ userId: user.id, itemId, day, done });
    }
    return { ok: true, itemId, done };
  });
}

/** Add a custom checklist item. */
export async function PUT(request: Request) {
  const body = (await request.json()) as { partOfDay?: string; label?: string };
  return withUser(async ({ user }) => {
    const part = str(body.partOfDay, "Part of day", 10);
    if (!["morning", "day", "evening", "night"].includes(part)) badRequest("Unknown part of day.");
    const label = str(body.label, "Label", 160);
    const [row] = await db
      .insert(checklistItems)
      .values({ userId: user.id, partOfDay: part, label, sortOrder: 99 })
      .returning();
    return { item: { ...row, done: false } };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db
      .update(checklistItems)
      .set({ archived: true })
      .where(and(eq(checklistItems.id, id), eq(checklistItems.userId, user.id)));
    return { ok: true };
  });
}
