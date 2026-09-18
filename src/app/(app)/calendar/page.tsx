import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import EventsSection from "@/components/calendar/EventsSection";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { user } = await requireProfile();
  const rows = await db.select().from(events).where(eq(events.userId, user.id)).orderBy(asc(events.day));

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Your dates"
        title="Important Dates"
        description="Birthdays, appointments, exams, work and the small plans you're looking forward to."
      />
      <EventsSection
        initial={rows.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          day: e.day,
          time: e.time,
          category: e.category,
          remind: e.remind,
          repeatYearly: e.repeatYearly,
        }))}
      />
    </div>
  );
}
