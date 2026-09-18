import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { checkins } from "@/db/schema";
import { dayKey, num, str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db
      .select()
      .from(checkins)
      .where(eq(checkins.userId, user.id))
      .orderBy(desc(checkins.day))
      .limit(60);
    return { checkins: rows };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const day = dayKey(body.day, "day");
    const mood = str(body.mood, "Mood", 20);
    const energy = str(body.energy, "Energy", 10, false) || "medium";
    const stress = num(body.stress, "Stress", 0, 10, 3);
    const note = str(body.note, "Note", 4000, false);
    const existing = (
      await db
        .select()
        .from(checkins)
        .where(and(eq(checkins.userId, user.id), eq(checkins.day, day)))
        .limit(1)
    )[0];
    if (existing) {
      const [row] = await db
        .update(checkins)
        .set({ mood, energy, stress, note })
        .where(eq(checkins.id, existing.id))
        .returning();
      return { checkin: row };
    }
    const [row] = await db
      .insert(checkins)
      .values({ userId: user.id, day, mood, energy, stress, note })
      .returning();
    return { checkin: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(checkins).where(and(eq(checkins.id, id), eq(checkins.userId, user.id)));
    return { ok: true };
  });
}
