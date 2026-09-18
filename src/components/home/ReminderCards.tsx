"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Card, Chip, Skeleton } from "@/components/ui";
import { PAUSE_MESSAGES, buildDailyPack, dayIndexFromKey, rotate } from "@/lib/content";
import { useDayKey } from "@/lib/hooks";

export function TodaysReminder() {
  const day = useDayKey();
  if (!day) {
    return (
      <Card>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-7 w-full" />
        <Skeleton className="mt-2 h-7 w-2/3" />
      </Card>
    );
  }
  const pack = buildDailyPack(day);
  return (
    <Card className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px]"
        style={{ background: "var(--accent)" }}
      />
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Today, remember this</p>
          <p className="display mt-3 text-[19px] font-medium leading-[1.42] sm:text-[23px]">
            {pack.value.text}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip tone="blush" icon="sparkle">{pack.value.category}</Chip>
            <span className="faint text-[11.5px]">A new one each morning</span>
          </div>
        </div>

        <div
          className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-[16px] border shadow-sm sm:block"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
        >
          <Image
            src="/images/teddy-comfort.jpg"
            alt="Warm comfort teddy"
            fill
            sizes="80px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      <div className="hairline mt-5 pt-4">
        <div className="flex items-start gap-2.5">
          <span className="icon-tile h-7 w-7" style={{ color: "var(--accent)" }}>
            <Icon name="shield" size={14} />
          </span>
          <div className="min-w-0">
            <p className="faint text-[11px] font-semibold uppercase tracking-wide">Remember who you are</p>
            <p className="mt-1 text-[13.5px] leading-relaxed">{pack.capability}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PauseCard() {
  const day = useDayKey();
  const [extra, setExtra] = useState(0);
  if (!day) return <Card><Skeleton className="h-24 w-full" /></Card>;
  const base = dayIndexFromKey(day) * 5 + new Date().getHours();
  const message = rotate(PAUSE_MESSAGES, base + extra, 7);

  return (
    <Card className="relative overflow-hidden">
      <div className="flex flex-col items-center text-center">
        {/* Breathe for a minute badge — inspired by reference image */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-medium"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)", color: "var(--text-soft)" }}>
          <Icon name="wind" size={13} strokeWidth={2} />
          <span>Breathe for a minute</span>
        </div>

        {/* Cozy painting matching the reference image */}
        <div
          className="relative mx-auto h-36 w-full max-w-[280px] overflow-hidden rounded-[16px] border shadow-sm sm:h-44 sm:max-w-[320px]"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
        >
          <Image
            src="/images/girl-cozy-evening.jpg"
            alt="Cozy peaceful moment on couch with warm tea"
            fill
            sizes="320px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <p className="display mt-3.5 text-[18px] font-medium leading-snug sm:text-[20px]">{message}</p>
        <p className="faint mt-1 text-[12px]">A tiny pause, just for a moment</p>

        <button onClick={() => setExtra((e) => e + 1)} className="btn-ghost mt-3.5 text-[12.5px]">
          <Icon name="repeat" size={13} /> Another thought
        </button>
      </div>
    </Card>
  );
}
