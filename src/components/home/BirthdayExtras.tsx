"use client";

import Image from "next/image";
import { Icon } from "@/components/icons";
import { Card, Chip, SectionTitle, Skeleton, StatTile } from "@/components/ui";
import { birthdayInfo, computeAge, nf, prettyDate } from "@/lib/dates";
import { useNow } from "@/lib/hooks";

export default function BirthdayExtras({ birthday, nickname }: { birthday: string; nickname: string }) {
  const now = useNow(1000);
  if (!now) return <Card><Skeleton className="h-40 w-full" /></Card>;

  const age = computeAge(birthday, now);
  const b = birthdayInfo(birthday, now);
  const yearProgress = ((365 - b.days) / 365) * 100;

  const milestones = [
    { label: "First 1,000 days", done: age.totalDays >= 1000 },
    { label: "5,000 days lived", done: age.totalDays >= 5000 },
    { label: "7,500 days lived", done: age.totalDays >= 7500 },
    { label: "10,000 days lived", done: age.totalDays >= 10000 },
    { label: "1,000,000 minutes", done: age.totalMinutes >= 1000000 },
    { label: "10,000,000 minutes", done: age.totalMinutes >= 10000000 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="text-center">
          <p className="eyebrow">Previous age</p>
          <p className="display mt-1 text-3xl font-semibold">{b.previousAge}</p>
        </Card>

        <div className="card text-center p-5 sm:p-6" style={{ background: "var(--accent-soft)", borderColor: "var(--accent)" }}>
          <p className="eyebrow" style={{ color: "var(--accent)" }}>Right now</p>
          <p className="display mt-1 text-3xl font-semibold" style={{ color: "var(--accent)" }}>
            {age.years}
          </p>
          <p className="faint mt-1 text-[12px]">{age.months} months, {age.days} days</p>
        </div>

        <Card className="text-center">
          <p className="eyebrow">Turning next</p>
          <p className="display mt-1 text-3xl font-semibold">{b.turning}</p>
          <p className="faint mt-1 text-[11.5px]">23 February</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SectionTitle
              icon="sparkle"
              title="This year so far"
              subtitle={`${Math.round(yearProgress)}% of the way to your next birthday.`}
            />
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-sunk)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(2, yearProgress)}%`, background: "var(--accent)" }}
              />
            </div>
          </div>

          <div
            className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border sm:block"
            style={{ borderColor: "var(--border)" }}
          >
            <Image
              src="/images/girl-birthday.jpg"
              alt="Birthday cake and candle"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile value={nf(age.totalDays)} label="days lived" />
          <StatTile value={nf(age.totalHours)} label="hours lived" />
          <StatTile value={nf(age.totalMinutes)} label="minutes lived" />
          <StatTile value={nf(age.totalSeconds)} label="seconds lived" />
        </div>
      </Card>

      <Card>
        <SectionTitle icon="star" title="Quiet milestones" subtitle="Moments already passed along your journey." />
        <div className="grid gap-2 sm:grid-cols-2">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="card-flat flex items-center gap-3 p-3"
            >
              <span style={{ color: m.done ? "var(--accent)" : "var(--border-strong)" }}>
                <Icon name="check" size={15} strokeWidth={2.4} />
              </span>
              <div>
                <p className="text-[13px] font-semibold">{m.label}</p>
                <p className="faint text-[11px]">{m.done ? "already lived through it" : "still ahead of you"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip tone="blush">Born {prettyDate(birthday)}</Chip>
          <Chip tone="lilac">{nickname}&apos;s own timeline</Chip>
        </div>
      </Card>
    </div>
  );
}
