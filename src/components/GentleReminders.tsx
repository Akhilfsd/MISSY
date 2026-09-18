"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GENTLE_REMINDERS } from "@/lib/content";

type Props = {
  enabled: boolean;
  intervalMinutes: number;
  quietStart: string;
  quietEnd: string;
  categories: string[];
  custom: string[];
  nickname: string;
};

const ART_BY_TAG: Record<string, string> = {
  water: "/images/girl-morning.jpg",
  eyes: "/images/girl-rest.jpg",
  posture: "/images/teddy-comfort.jpg",
  breathe: "/images/girl-cozy-evening.jpg",
  food: "/images/dairy-milk.jpg",
  rest: "/images/teddy-comfort.jpg",
};

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function inQuietHours(now: Date, start: string, end: string): boolean {
  const cur = now.getHours() * 60 + now.getMinutes();
  const s = minutesOf(start);
  const e = minutesOf(end);
  if (s === e) return false;
  return s < e ? cur >= s && cur < e : cur >= s || cur < e;
}

export default function GentleReminders({
  enabled,
  intervalMinutes,
  quietStart,
  quietEnd,
  categories,
  custom,
  nickname,
}: Props) {
  const [current, setCurrent] = useState<{ text: string; tag: string } | null>(null);
  const idx = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const pool = [
      ...GENTLE_REMINDERS.filter((r) => categories.length === 0 || categories.includes(r.tag)),
      ...custom.map((text) => ({ text, tag: "rest" })),
    ];
    if (pool.length === 0) return;

    const ms = Math.max(1, intervalMinutes) * 60 * 1000;

    function fire() {
      if (inQuietHours(new Date(), quietStart, quietEnd)) return;
      const next = pool[idx.current % pool.length];
      idx.current += 1;
      setCurrent({
        text: next.text.replace(/\bPgl\b/g, nickname),
        tag: next.tag,
      });
      window.setTimeout(() => setCurrent(null), 12000);
    }

    const firstDelay = window.setTimeout(fire, 25000);
    const timer = window.setInterval(fire, ms);
    return () => {
      window.clearTimeout(firstDelay);
      window.clearInterval(timer);
    };
  }, [enabled, intervalMinutes, quietStart, quietEnd, categories, custom, nickname]);

  if (!current) return null;

  return (
    <div className="fixed bottom-24 right-3 z-50 w-[min(19rem,calc(100vw-1.5rem))] sm:bottom-6 sm:right-6">
      <div className="card animate-pop flex items-center gap-3 p-3.5 shadow-lg">
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[11px] border"
          style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
        >
          <Image
            src={ART_BY_TAG[current.tag] || "/images/teddy-comfort.jpg"}
            alt="Gentle reminder"
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="muted text-[10px] font-semibold uppercase tracking-wide">a gentle nudge</p>
          <p className="text-[13px] leading-snug">{current.text}</p>
        </div>
        <button onClick={() => setCurrent(null)} className="muted self-start text-lg leading-none hover:opacity-60" aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
