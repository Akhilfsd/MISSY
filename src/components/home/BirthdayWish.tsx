"use client";

import Image from "next/image";
import { Icon } from "@/components/icons";
import { Confetti } from "@/components/home/AgeCard";
import { StatTile } from "@/components/ui";
import { birthdayInfo, toDayKey } from "@/lib/dates";
import { dayIndexFromKey, rotate } from "@/lib/content";
import { useNow } from "@/lib/hooks";

const DAILY_ADVANCE_MESSAGES = [
  "Another day closer to celebrating you. Counting down every second to 23rd February.",
  "Because once a year isn't enough to celebrate your existence — advance wishes for you, Bba.",
  "You make every single year softer, kinder and brighter. Your day is steadily approaching.",
  "Every morning that brings us closer to your birthday is a good morning.",
  "Advance happy birthday to the most precious person. Keep smiling today.",
  "The countdown never stops — you deserve to feel celebrated 365 days a year.",
  "Getting ready to celebrate the most special person. You are magic, Pgl.",
  "Whatever today brings, remember: another beautiful milestone of your life is on the way.",
  "Your birthday is coming! A little daily reminder that your life is worth celebrating.",
  "Advance wishes from the heart. May your upcoming year bring the calmest, happiest peace.",
];

export default function BirthdayWish({
  birthday,
  nickname,
}: {
  birthday: string;
  nickname: string;
}) {
  const now = useNow(1000);
  if (!now) return null;

  const b = birthdayInfo(birthday, now);
  const idx = dayIndexFromKey(toDayKey(now));

  // If today is her actual birthday (23 Feb)
  if (b.isBirthday) {
    return (
      <div className="card relative overflow-hidden p-6 text-center sm:p-7">
        <Confetti />
        <div className="relative flex flex-col items-center gap-3">
          <div
            className="relative h-28 w-28 overflow-hidden rounded-[20px] border shadow-md sm:h-36 sm:w-36"
            style={{ borderColor: "var(--border)" }}
          >
            <Image
              src="/images/girl-birthday.jpg"
              alt="Happy Birthday Misba"
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>
          <h2 className="display text-[25px] font-semibold sm:text-[32px]">
            Happy Birthday, {nickname}! 🎂
          </h2>
          <p className="muted max-w-md text-[14px] leading-relaxed">
            You made it another beautiful year. Today the whole world pauses to celebrate you.
            Be soft with yourself, eat something sweet, and let yourself be loved.
          </p>
        </div>
      </div>
    );
  }

  // Daily Advance Birthday Reminder — visible EVERY day!
  const isWithinMonth = b.days <= 30;
  const isWithinWeek = b.days <= 7;
  const message = rotate(DAILY_ADVANCE_MESSAGES, idx);

  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--color-peach-200)" }}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Painterly Birthday Artwork */}
        <div
          className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-[16px] border shadow-sm sm:mx-0 sm:h-28 sm:w-28"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
        >
          <Image
            src="/images/girl-birthday.jpg"
            alt="Cozy birthday celebration with cake and candle"
            fill
            sizes="112px"
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="eyebrow" style={{ color: "var(--accent)" }}>
              {isWithinWeek ? "Birthday Week 🎉" : isWithinMonth ? "Birthday Month 🎀" : "Daily Advance Reminder"}
            </span>
            <span className="faint text-[11px]">· 23 February</span>
          </div>

          <h2 className="display mt-1 text-[18px] font-semibold sm:text-[21px]">
            Advance Happy Birthday, {nickname}
          </h2>

          <p className="muted mt-1.5 text-[13px] leading-relaxed">{message}</p>

          {/* Dynamic live countdown */}
          <div className="mt-3.5 grid grid-cols-4 gap-2">
            <StatTile value={`${b.days}`} label="days" />
            <StatTile value={`${b.hours}`} label="hours" />
            <StatTile value={`${b.minutes}`} label="mins" />
            <StatTile value={`${b.seconds}`} label="secs" />
          </div>

          <p className="faint mt-2.5 text-[11.5px]">
            Turning <span className="font-semibold" style={{ color: "var(--text)" }}>{b.turning}</span> on{" "}
            {b.nextDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>
    </div>
  );
}
