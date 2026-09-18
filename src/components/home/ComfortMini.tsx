"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { Card, Chip, EmptyState, ProgressRing, SectionTitle, Skeleton } from "@/components/ui";
import { PERIOD_5_DAY_PLAN, PHASE_CARE } from "@/lib/content";
import { computeCycle, prettyShort } from "@/lib/dates";
import { useDayKey } from "@/lib/hooks";

export default function ComfortMini({
  nickname,
  cycleLength,
  periodDuration,
  lastPeriodStart,
}: {
  nickname: string;
  cycleLength: number;
  periodDuration: number;
  lastPeriodStart: string | null;
}) {
  const today = useDayKey();
  if (!today) {
    return (
      <Card>
        <SectionTitle icon="moon" title={`${nickname}'s Comfort Calendar`} />
        <Skeleton className="h-28 w-full" />
      </Card>
    );
  }

  const cycle = computeCycle(lastPeriodStart, cycleLength, periodDuration, today);

  if (!cycle) {
    return (
      <Card>
        <SectionTitle icon="moon" title={`${nickname}'s Comfort Calendar`} subtitle="Private and gentle." />
        <EmptyState
          icon="moon"
          title="No cycle information yet"
          hint="Add your last period dates and soft estimates will appear here."
          action={<Link href="/comfort" className="btn-primary">Open comfort calendar</Link>}
        />
      </Card>
    );
  }

  const phase = PHASE_CARE[cycle.phase];
  const plan = cycle.isPeriodDay
    ? PERIOD_5_DAY_PLAN.find((p) => p.day === cycle.periodDayNumber) ?? PERIOD_5_DAY_PLAN[4]
    : null;
  const tips = plan ? plan.items.slice(0, 3) : phase.tips.slice(0, 3);

  return (
    <Card>
      <SectionTitle
        icon="moon"
        title={`${nickname}'s Comfort Calendar`}
        subtitle={plan ? `Day ${cycle.periodDayNumber} — ${plan.title}` : phase.title}
        right={<ProgressRing value={(cycle.cycleDay / cycle.cycleLength) * 100} size={58} stroke={5} label={`D${cycle.cycleDay}`} />}
      />
      <div className="flex flex-wrap gap-1.5">
        <Chip tone="blush" icon="calendar">Next ≈ {prettyShort(cycle.nextPeriod)}</Chip>
        <Chip tone="lilac">{Math.max(0, cycle.daysUntilNext)} days away</Chip>
        <Chip tone="neutral">estimate</Chip>
      </div>
      <ul className="mt-3.5 space-y-1.5">
        {tips.map((t) => (
          <li key={t} className="flex items-start gap-2 text-[12.5px] leading-relaxed">
            <span className="mt-[3px] shrink-0" style={{ color: "var(--accent)" }}>
              <Icon name="check" size={11} strokeWidth={2.6} />
            </span>
            <span className="muted">{t}</span>
          </li>
        ))}
      </ul>
      <Link href="/comfort" className="btn-ghost mt-4">
        Open comfort calendar <Icon name="arrowRight" size={13} />
      </Link>
    </Card>
  );
}
