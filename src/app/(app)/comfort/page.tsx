import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cycles, periodLogs } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import ComfortSection from "@/components/comfort/ComfortSection";
import Period5DayCare from "@/components/comfort/Period5DayCare";
import DairyMilkComfort from "@/components/comfort/DairyMilkComfort";
import { computeCycle, toDayKey } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ComfortPage() {
  const { user, settings } = await requireProfile();

  const [cycleRows, logRows] = await Promise.all([
    db.select().from(cycles).where(eq(cycles.userId, user.id)).orderBy(desc(cycles.startDate)).limit(24),
    db.select().from(periodLogs).where(eq(periodLogs.userId, user.id)).orderBy(desc(periodLogs.day)).limit(40),
  ]);

  const cycle = computeCycle(
    settings.lastPeriodStart,
    settings.cycleLength,
    settings.periodDuration,
    toDayKey(new Date()),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Private to you"
        title="Comfort Calendar"
        description="Gentle cycle tracking, cozy Dairy Milk comfort, and five days of real care. Everything here is an estimate — never a medical certainty."
      />

      <Period5DayCare
        nickname={user.nickname}
        activeDay={cycle?.isPeriodDay ? cycle.periodDayNumber : 0}
      />

      <DairyMilkComfort nickname={user.nickname} />

      <ComfortSection
        nickname={user.nickname}
        initialSettings={{
          cycleLength: settings.cycleLength,
          periodDuration: settings.periodDuration,
          lastPeriodStart: settings.lastPeriodStart,
        }}
        initialCycles={cycleRows.map((c) => ({ id: c.id, startDate: c.startDate, endDate: c.endDate, notes: c.notes }))}
        initialLogs={logRows.map((l) => ({
          id: l.id,
          day: l.day,
          pain: l.pain,
          energy: l.energy,
          mood: l.mood,
          symptoms: l.symptoms,
          careDone: l.careDone,
          note: l.note,
        }))}
      />
    </div>
  );
}
