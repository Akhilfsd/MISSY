"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Skeleton, StatTile, Tip } from "@/components/ui";
import { birthdayInfo, computeAge, nf, prettyDate } from "@/lib/dates";
import { useNow } from "@/lib/hooks";

export function Confetti() {
  const bits = Array.from({ length: 24 }, (_, i) => i);
  const colors = ["#e5adc0", "#c3b9e0", "#e8b795", "#a6c9b6", "#a9c4de"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
      {bits.map((i) => (
        <span
          key={i}
          className="confetti-bit absolute block h-1.5 w-1.5 rounded-[1px]"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDuration: `${4.5 + (i % 5)}s`,
            animationDelay: `${(i % 7) * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AgeCard({
  birthday,
  nickname,
  compact = false,
}: {
  birthday: string;
  nickname: string;
  compact?: boolean;
}) {
  const now = useNow(1000);

  if (!now) {
    return (
      <div className="card p-5 sm:p-6">
        <Skeleton className="h-4 w-36" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      </div>
    );
  }

  const age = computeAge(birthday, now);
  const b = birthdayInfo(birthday, now);

  if (b.isBirthday) {
    return (
      <div className="card relative overflow-hidden p-6 sm:p-7">
        <Confetti />
        <div className="relative flex flex-col items-center gap-2.5 text-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-[18px] border shadow-sm">
            <Image src="/images/girl-birthday.jpg" fill alt="Birthday cake and candle" sizes="112px" className="object-cover" />
          </div>
          <h2 className="display text-[23px] font-semibold sm:text-[27px]">Happy Birthday, {nickname}</h2>
          <p className="muted max-w-sm text-[13.5px] leading-relaxed">You made it another beautiful year.</p>
          <div className="mt-2 grid w-full max-w-sm grid-cols-3 gap-2">
            <StatTile value={`${age.years}`} label="years today" />
            <StatTile value={nf(age.totalDays)} label="days lived" />
            <StatTile value={`${age.years + 1}`} label="next year" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="icon-tile mt-0.5" style={{ color: "var(--accent)" }}>
            <Icon name="cake" size={17} />
          </span>
          <div>
            <h2 className="display text-[16.5px] font-semibold leading-snug sm:text-[18px]">
              Your Journey
              <Tip text="Calculated live from your birthday, down to the second." />
            </h2>
            <p className="faint mt-1 text-[12px]">Born {prettyDate(birthday)}</p>
          </div>
        </div>
        <div
          className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
          title="Comfort Teddy"
        >
          <Image
            src="/images/teddy-comfort.jpg"
            alt="Comfort Teddy Bear"
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatTile value={`${age.years}`} label="years" />
        <StatTile value={`${age.months}`} label="months" />
        <StatTile value={`${age.days}`} label="days" />
      </div>

      <p className="eyebrow mt-5">You have already lived about</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile value={nf(age.totalDays)} label="days" />
        <StatTile value={nf(age.totalHours)} label="hours" />
        <StatTile value={nf(age.totalMinutes)} label="minutes" />
        <StatTile value={nf(age.totalSeconds)} label="seconds" />
      </div>

      <div className="card-sunk mt-5 p-4">
        <div className="flex items-center gap-1.5" style={{ color: "var(--text-soft)" }}>
          <Icon name="clock" size={13} />
          <p className="text-[12px] font-semibold">Your next birthday is in</p>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          <StatTile value={`${b.days}`} label="days" />
          <StatTile value={`${b.hours}`} label="hours" />
          <StatTile value={`${b.minutes}`} label="mins" />
          <StatTile value={`${b.seconds}`} label="secs" />
        </div>
        <p className="faint mt-3 text-[12px]">
          Turning <span className="font-semibold" style={{ color: "var(--text-soft)" }}>{b.turning}</span> on{" "}
          {b.nextDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {!compact ? (
        <Link href="/birthday" className="btn-ghost mt-4">
          See the whole journey <Icon name="arrowRight" size={13} />
        </Link>
      ) : null}
    </div>
  );
}
