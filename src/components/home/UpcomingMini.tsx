"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Card, EmptyState, SectionTitle, Skeleton } from "@/components/ui";
import { diffDays, prettyShort } from "@/lib/dates";
import { useDayKey } from "@/lib/hooks";

type MiniEvent = {
  id: number;
  title: string;
  day: string;
  time: string | null;
  category: string;
  repeatYearly: boolean;
};

export const CAT_ICON: Record<string, IconName> = {
  birthday: "cake",
  appointment: "stethoscope",
  exam: "book",
  work: "briefcase",
  personal: "flower",
  monthly: "repeat",
  custom: "star",
};

export default function UpcomingMini({ events }: { events: MiniEvent[] }) {
  const today = useDayKey();
  if (!today) {
    return (
      <Card>
        <SectionTitle icon="calendar" title="Important Dates" />
        <Skeleton className="h-28 w-full" />
      </Card>
    );
  }

  const upcoming = events
    .map((e) => {
      if (!e.repeatYearly) return { e, when: e.day };
      const year = Number(today.slice(0, 4));
      const thisYear = `${year}-${e.day.slice(5)}`;
      return { e, when: diffDays(today, thisYear) >= 0 ? thisYear : `${year + 1}-${e.day.slice(5)}` };
    })
    .filter((x) => diffDays(today, x.when) >= 0)
    .sort((a, b) => a.when.localeCompare(b.when))
    .slice(0, 4);

  return (
    <Card>
      <SectionTitle icon="calendar" title="Important Dates" subtitle="What's gently coming up." />
      {upcoming.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Nothing coming up"
          hint="A clear calendar is a kind of luxury too."
          action={<Link href="/calendar" className="btn-primary">Add a date</Link>}
        />
      ) : (
        <ul className="space-y-1.5">
          {upcoming.map(({ e, when }) => {
            const away = diffDays(today, when);
            return (
              <li key={`${e.id}-${when}`} className="card-flat flex items-center gap-3 p-2.5">
                <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[9px]"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <span className="text-[12px] font-bold leading-none">{Number(when.slice(8))}</span>
                  <span className="text-[8.5px] font-semibold uppercase leading-none mt-0.5">
                    {prettyShort(when).split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold">
                    <Icon name={CAT_ICON[e.category] ?? "star"} size={13} />
                    {e.title}
                  </p>
                  <p className="faint text-[11.5px]">
                    {away === 0 ? "Today" : away === 1 ? "Tomorrow" : `in ${away} days`}{e.time ? ` · ${e.time}` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/calendar" className="btn-ghost mt-4">
        Open calendar <Icon name="arrowRight" size={13} />
      </Link>
    </Card>
  );
}
