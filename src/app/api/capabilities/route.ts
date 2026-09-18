import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { capabilities } from "@/db/schema";
import { str, withUser } from "@/lib/api";

export async function GET() {
  return withUser(async ({ user }) => {
    const rows = await db
      .select()
      .from(capabilities)
      .where(eq(capabilities.userId, user.id))
      .orderBy(desc(capabilities.createdAt));
    return { capabilities: rows };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const text = str(body.text, "Text", 240);
    const category = str(body.category, "Category", 40, false) || "Capable of";
    const [row] = await db.insert(capabilities).values({ userId: user.id, text, category }).returning();
    return { capability: row };
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return withUser(async ({ user }) => {
    const id = Number(body.id);
    const patch: Record<string, unknown> = {};
    if (typeof body.text === "string") patch.text = str(body.text, "Text", 240);
    if (typeof body.category === "string") patch.category = str(body.category, "Category", 40);
    const [row] = await db
      .update(capabilities)
      .set(patch)
      .where(and(eq(capabilities.id, id), eq(capabilities.userId, user.id)))
      .returning();
    return { capability: row };
  });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  return withUser(async ({ user }) => {
    await db.delete(capabilities).where(and(eq(capabilities.id, id), eq(capabilities.userId, user.id)));
    return { ok: true };
  });
}
