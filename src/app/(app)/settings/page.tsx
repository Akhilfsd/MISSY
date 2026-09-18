import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customReminders } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import SettingsForm from "@/components/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user, settings } = await requireProfile();
  const reminders = await db.select().from(customReminders).where(eq(customReminders.userId, user.id));

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description={`Make this space fit you exactly, ${user.nickname}.`}
      />
      <SettingsForm
        user={{ name: user.name, nickname: user.nickname, birthday: user.birthday, email: user.email }}
        settings={{
          cycleLength: settings.cycleLength,
          periodDuration: settings.periodDuration,
          lastPeriodStart: settings.lastPeriodStart,
          remindersEnabled: settings.remindersEnabled,
          reminderIntervalMinutes: settings.reminderIntervalMinutes,
          quietStart: settings.quietStart,
          quietEnd: settings.quietEnd,
          theme: settings.theme,
          reminderCategories: settings.reminderCategories,
          notifyBrowser: settings.notifyBrowser,
        }}
        reminders={reminders.map((r) => ({ id: r.id, text: r.text, enabled: r.enabled }))}
      />
    </div>
  );
}
