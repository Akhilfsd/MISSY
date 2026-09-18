import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events, goals } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { Icon } from "@/components/icons";
import { Card, SectionTitle } from "@/components/ui";
import Hero from "@/components/home/Hero";
import BirthdayWish from "@/components/home/BirthdayWish";
import EveningWelcome from "@/components/home/EveningWelcome";
import AgeCard from "@/components/home/AgeCard";
import { PauseCard, TodaysReminder } from "@/components/home/ReminderCards";
import ChecklistCard from "@/components/home/ChecklistCard";
import CheckinCard from "@/components/home/CheckinCard";
import ComfortMini from "@/components/home/ComfortMini";
import UpcomingMini from "@/components/home/UpcomingMini";
import { GOAL_CATEGORIES } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { user, settings } = await requireProfile();

  const [goalRows, eventRows] = await Promise.all([
    db.select().from(goals).where(eq(goals.userId, user.id)).orderBy(desc(goals.createdAt)).limit(4),
    db.select().from(events).where(eq(events.userId, user.id)),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <Hero nickname={user.nickname} />
      <BirthdayWish birthday={user.birthday} nickname={user.nickname} />
      <EveningWelcome nickname={user.nickname} />
      <TodaysReminder />

      <Link href="/values" className="card group flex items-center gap-4 p-5 transition-colors hover:border-[var(--accent)]">
        <span className="icon-tile h-10 w-10" style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
          <Icon name="gem" size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="display text-[15.5px] font-semibold">How precious you are, {user.nickname}</p>
          <p className="muted mt-0.5 text-[12.5px] leading-relaxed">
            Your worth, your heart, your dreams — written down, for the days you forget.
          </p>
        </div>
        <span className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-faint)" }}>
          <Icon name="chevronRight" size={17} />
        </span>
      </Link>

      <div className="grid gap-4 lg:grid-cols-2">
        <AgeCard birthday={user.birthday} nickname={user.nickname} />
        <div className="space-y-4">
          <PauseCard />
          <ComfortMini
            nickname={user.nickname}
            cycleLength={settings.cycleLength}
            periodDuration={settings.periodDuration}
            lastPeriodStart={settings.lastPeriodStart}
          />
        </div>
      </div>

      <ChecklistCard />
      <CheckinCard />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle icon="sprout" title="Your Little Future" subtitle="The things you are quietly walking towards." />
          {goalRows.length === 0 ? (
            <div className="rounded-[14px] border border-dashed p-6 text-center" style={{ borderColor: "var(--border-strong)" }}>
              <p className="display text-[15px] font-semibold">Nothing written down yet</p>
              <p className="muted mt-1 text-[12.5px]">Even one small wish is a good start.</p>
              <Link href="/life" className="btn-primary mt-3">Add a dream</Link>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {goalRows.map((g) => {
                const meta = GOAL_CATEGORIES.find((c) => c.key === g.category) ?? GOAL_CATEGORIES[0];
                return (
                  <li key={g.id} className="card-flat p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold">{g.title}</p>
                      <span className="faint shrink-0 text-[11px] tabular-nums">{g.progress}%</span>
                    </div>
                    <p className="faint mt-0.5 text-[11px]">{meta.label}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-sunk)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${g.progress}%`, background: "var(--accent)" }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href="/life" className="btn-ghost mt-4">
            See everything <Icon name="arrowRight" size={13} />
          </Link>
        </Card>

        <UpcomingMini
          events={eventRows.map((e) => ({
            id: e.id,
            title: e.title,
            day: e.day,
            time: e.time,
            category: e.category,
            repeatYearly: e.repeatYearly,
          }))}
        />
      </div>

      <p className="faint pb-4 text-center text-[11.5px] leading-relaxed">
        Made quietly for {user.name} — your health matters, your presence matters,
        <br className="hidden sm:block" /> your dreams matter, your peace matters.
      </p>
    </div>
  );
}
