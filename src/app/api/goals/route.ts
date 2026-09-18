import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { num, str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db.select().from(goals).where(eq(goals.userId, user.id)).orderBy(desc(goals.createdAt));
    return { goals: rows };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const title = str(body.title, "Title", 160);
    const description = str(body.description, "Description", 1000, false);
    const category = str(body.category, "Category", 40, false) || "dream";
    const progress = num(body.progress, "Progress", 0, 100, 0);
    const [row] = await db
      .insert(goals)
      .values({ userId: user.id, title, description, category, progress, done: progress >= 100 })
      .returning();
    return { goal: row };
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const id = Number(body.id);
    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string") patch.title = str(body.title, "Title", 160);
    if (typeof body.description === "string") patch.description = str(body.description, "Description", 1000, false);
    if (typeof body.category === "string") patch.category = str(body.category, "Category", 40);
    if (body.progress !== undefined) {
      const p = num(body.progress, "Progress", 0, 100, 0);
      patch.progress = p;
      patch.done = p >= 100;
    }
    if (typeof body.done === "boolean") patch.done = body.done;
    const [row] = await db
      .update(goals)
      .set(patch)
      .where(and(eq(goals.id, id), eq(goals.userId, user.id)))
      .returning();
    return { goal: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, user.id)));
    return { ok: true };
  });
}
