import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings, users, type Settings, type User } from "@/db/schema";
import { ensureProfile } from "@/lib/seed";

export type Profile = { user: User; settings: Settings };

/**
 * This is a private single-person app — there is no login. Every request
 * resolves to the one and only profile, creating and seeding it on first run.
 */
export async function getProfile(): Promise<Profile> {
  const userId = await ensureProfile();
  const user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
  let s = (await db.select().from(settings).where(eq(settings.userId, userId)).limit(1))[0];
  if (!s) {
    s = (await db.insert(settings).values({ userId }).returning())[0];
  }
  return { user, settings: s };
}

export async function requireProfile(): Promise<Profile> {
  return getProfile();
}
