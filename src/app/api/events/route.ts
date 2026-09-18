import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { dayKey, str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db.select().from(events).where(eq(events.userId, user.id)).orderBy(asc(events.day));
    return { events: rows };
  });
}

function timeOrNull(value: unknown): string | null {
  const v = typeof value === "string" ? value.trim() : "";
  return /^\d{2}:\d{2}$/.test(v) ? v : null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const title = str(body.title, "Title", 160);
    const description = str(body.description, "Description", 1000, false);
    const day = dayKey(body.day, "Date");
    const category = str(body.category, "Category", 40, false) || "personal";
    const [row] = await db
      .insert(events)
      .values({
        userId: user.id,
        title,
        description,
        day,
        time: timeOrNull(body.time),
        category,
        remind: body.remind !== false,
        repeatYearly: body.repeatYearly === true,
      })
      .returning();
    return { event: row };
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const id = Number(body.id);
    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string") patch.title = str(body.title, "Title", 160);
    if (typeof body.description === "string") patch.description = str(body.description, "Description", 1000, false);
    if (typeof body.day === "string") patch.day = dayKey(body.day, "Date");
    if (body.time !== undefined) patch.time = timeOrNull(body.time);
    if (typeof body.category === "string") patch.category = str(body.category, "Category", 40);
    if (typeof body.remind === "boolean") patch.remind = body.remind;
    if (typeof body.repeatYearly === "boolean") patch.repeatYearly = body.repeatYearly;
    const [row] = await db
      .update(events)
      .set(patch)
      .where(and(eq(events.id, id), eq(events.userId, user.id)))
      .returning();
    return { event: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(events).where(and(eq(events.id, id), eq(events.userId, user.id)));
    return { ok: true };
  });
}
