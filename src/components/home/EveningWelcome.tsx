"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Checkbox } from "@/components/ui";
import { EVENING_UNWIND, EVENING_WELCOME, TIRED_COMFORT, dayIndexFromKey, rotate } from "@/lib/content";
import { toDayKey } from "@/lib/dates";
import { useNow } from "@/lib/hooks";

/**
 * Her duty finishes at 6 PM. From then until late evening this card greets her
 * home, appreciates the day she just got through, and offers a short unwind list.
 */
const DUTY_END_HOUR = 18;
const SHOW_UNTIL_HOUR = 23;

export default function EveningWelcome({ nickname }: { nickname: string }) {
  const now = useNow(60000);
  const [done, setDone] = useState<string[]>([]);

  if (!now) return null;
  const hour = now.getHours();
  if (hour < DUTY_END_HOUR || hour > SHOW_UNTIL_HOUR) return null;

  const idx = dayIndexFromKey(toDayKey(now));
  const welcome = rotate(EVENING_WELCOME, idx);
  const comfort = rotate(TIRED_COMFORT, idx, 3);
  const unwind = [
    rotate(EVENING_UNWIND, idx, 1),
    rotate(EVENING_UNWIND, idx, 4),
    rotate(EVENING_UNWIND, idx, 6),
    rotate(EVENING_UNWIND, idx, 2),
  ].filter((v, i, a) => a.indexOf(v) === i);

  function toggle(item: string) {
    setDone((cur) => (cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item]));
  }

  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-peach-100)" }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="icon-tile mt-0.5" style={{ color: "var(--accent)" }}>
              <Icon name="sunset" size={17} />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">Duty finished · {nickname} is home</p>
              <h2 className="display mt-1.5 text-[18px] font-semibold leading-snug sm:text-[21px]">
                {welcome.title}
              </h2>
              <p className="muted mt-2 max-w-lg text-[13.5px] leading-relaxed">{welcome.body}</p>
            </div>
          </div>
          <div
            className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-[16px] border shadow-sm sm:block sm:h-28 sm:w-28"
            style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
          >
            <Image
              src="/images/girl-cozy-evening.jpg"
              alt="Cozy evening couch with warm tea"
              fill
              sizes="112px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        <div className="card-sunk mt-4 flex items-start gap-2.5 p-3.5">
          <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
            <Icon name="heart" size={14} />
          </span>
          <p className="text-[13px] italic leading-relaxed">{comfort}</p>
        </div>

        <div className="mt-4">
          <p className="eyebrow mb-2.5">A soft way to wind down</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {unwind.map((item) => {
              const isDone = done.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className="card-flat flex items-center gap-2.5 p-2.5 text-left transition-colors hover:border-[var(--accent)]"
                >
                  <Checkbox checked={isDone} />
                  <span
                    className="text-[12.5px] leading-snug"
                    style={{
                      color: isDone ? "var(--text-faint)" : "var(--text)",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
