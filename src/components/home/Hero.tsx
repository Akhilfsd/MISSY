"use client";

import Image from "next/image";
import { Icon } from "@/components/icons";
import { Skeleton } from "@/components/ui";
import { buildDailyPack } from "@/lib/content";
import { greeting, prettyDate, toDayKey, weekdayName } from "@/lib/dates";
import { useNow } from "@/lib/hooks";

export default function Hero({ nickname }: { nickname: string }) {
  const now = useNow(30000);

  if (!now) {
    return (
      <div className="card p-6 sm:p-7">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-3.5 h-7 w-64" />
        <Skeleton className="mt-3 h-4 w-80" />
      </div>
    );
  }

  const g = greeting(now);
  const key = toDayKey(now);
  const pack = buildDailyPack(key);
  const hour = now.getHours();
  const artSrc = hour < 16 ? "/images/girl-morning.jpg" : "/images/girl-cozy-evening.jpg";
  const timeIcon = hour < 12 ? "sunrise" : hour < 17 ? "sun" : hour < 21 ? "sunset" : "moon";

  return (
    <div className="card relative overflow-hidden p-6 sm:p-7">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--accent-soft)" }}
      />
      <div className="relative flex items-center justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5" style={{ color: "var(--text-faint)" }}>
            <Icon name={timeIcon} size={13} strokeWidth={1.8} />
            <p className="eyebrow">
              {weekdayName(key)} · {prettyDate(key)}
            </p>
          </div>
          <h1 className="display mt-2.5 text-[25px] font-semibold leading-[1.15] sm:text-[34px]">
            {g.text}, {nickname}
          </h1>
          <p className="muted mt-2.5 max-w-lg text-[14px] leading-relaxed">{pack.line}</p>
        </div>
        <div
          className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border shadow-sm sm:block sm:h-28 sm:w-28"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
        >
          <Image
            src={artSrc}
            alt="Warm cozy personal painting"
            fill
            sizes="112px"
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>
      </div>
    </div>
  );
}
