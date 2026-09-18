import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db.select().from(notes).where(eq(notes.userId, user.id)).orderBy(desc(notes.createdAt));
    return { notes: rows };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const category = str(body.category, "Category", 40);
    const bodyText = str(body.body, "Message", 2000);
    const author = str(body.author, "Author", 60, false) || "For you";
    const [row] = await db.insert(notes).values({ userId: user.id, category, body: bodyText, author }).returning();
    return { note: row };
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const id = Number(body.id);
    const patch: Record<string, unknown> = {};
    if (typeof body.body === "string") patch.body = str(body.body, "Message", 2000);
    if (typeof body.category === "string") patch.category = str(body.category, "Category", 40);
    const [row] = await db
      .update(notes)
      .set(patch)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning();
    return { note: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
    return { ok: true };
  });
}
