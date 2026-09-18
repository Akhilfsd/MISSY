import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customReminders } from "@/db/schema";
import { getProfile } from "@/lib/auth";
import Shell from "@/components/Shell";
import GentleReminders from "@/components/GentleReminders";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { user, settings } = await getProfile();

  const reminders = await db
    .select()
    .from(customReminders)
    .where(eq(customReminders.userId, user.id));

  return (
    <Shell nickname={user.nickname} name={user.name} initialTheme={settings.theme}>
      {children}
      <GentleReminders
        enabled={settings.remindersEnabled}
        intervalMinutes={settings.reminderIntervalMinutes}
        quietStart={settings.quietStart}
        quietEnd={settings.quietEnd}
        categories={settings.reminderCategories.split(",").filter(Boolean)}
        custom={reminders.filter((r) => r.enabled).map((r) => r.text)}
        nickname={user.nickname}
      />
    </Shell>
  );
}
