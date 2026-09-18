"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Card, Checkbox, SectionTitle, toneStyles, type Tone } from "@/components/ui";
import {
  PERIOD_5_DAY_PLAN,
  PERIOD_BLESSING,
  PERIOD_CLOSING_NOTE,
  PERIOD_DHIKR,
  PERIOD_DONTS,
  PERIOD_DOS,
  PERIOD_DUA,
  PERIOD_GENERAL_CARE,
} from "@/lib/content";

export default function Period5DayCare({
  nickname,
  activeDay = 0,
}: {
  nickname: string;
  activeDay?: number;
}) {
  const [selected, setSelected] = useState(activeDay > 0 && activeDay <= 5 ? activeDay : 1);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const plan = PERIOD_5_DAY_PLAN.find((p) => p.day === selected) ?? PERIOD_5_DAY_PLAN[0];
  const t = toneStyles(plan.tone as Tone);

  function toggle(key: string) {
    setDone((cur) => ({ ...cur, [key]: !cur[key] }));
  }

  const completed = plan.items.filter((i) => done[`${plan.day}:${i}`]).length;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[14px] border sm:h-24 sm:w-24"
              style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            >
              <Image
                src="/images/girl-rest.jpg"
                alt="Cozy resting with warm hot water bottle"
                fill
                sizes="96px"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            <div>
              <p className="eyebrow">Hey {nickname}</p>
              <h2 className="display mt-1 text-[19px] font-semibold leading-snug sm:text-[22px]">
                Your 5-Day Period Care
              </h2>
              <p className="muted mt-1.5 max-w-md text-[13px] leading-relaxed">
                You&apos;re not just going through a cycle — you&apos;re doing something really brave.
              </p>
            </div>
          </div>
          <div className="card-sunk shrink-0 p-3.5">
            <p className="eyebrow mb-1.5">Remember</p>
            <ul className="space-y-1">
              {["Rest", "Hydrate", "Nourish", "Pray", "Be kind to yourself"].map((w) => (
                <li key={w} className="flex items-center gap-1.5 text-[12px]">
                  <span style={{ color: "var(--accent)" }}><Icon name="check" size={10} strokeWidth={3} /></span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-flat mt-4 flex items-start gap-2.5 p-3.5">
          <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
            <Icon name="sparkle" size={14} />
          </span>
          <p className="text-[12.8px] italic leading-relaxed">{PERIOD_CLOSING_NOTE}</p>
        </div>
      </Card>

      {/* Day selector */}
      <Card>
        <div className="mb-4 grid grid-cols-5 gap-1.5">
          {PERIOD_5_DAY_PLAN.map((p) => {
            const active = p.day === selected;
            const pt = toneStyles(p.tone as Tone);
            return (
              <button
                key={p.day}
                onClick={() => setSelected(p.day)}
                className="flex flex-col items-center gap-1 rounded-[11px] border px-1.5 py-2.5 transition-all"
                style={{
                  borderColor: active ? pt.fg : "var(--border)",
                  background: active ? pt.bg : "transparent",
                  color: active ? pt.fg : "var(--text-soft)",
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wide">Day {p.day}</span>
                <span className="hidden text-[10.5px] leading-tight sm:block" style={{ opacity: 0.85 }}>
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold"
              style={{ background: t.bg, color: t.fg }}
            >
              {plan.day}
            </span>
            <div>
              <h3 className="display text-[17px] font-semibold">{plan.title}</h3>
              <p className="faint text-[12px]">
                {completed} of {plan.items.length} done today
              </p>
            </div>
          </div>
          <div
            className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
            style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            title="Cozy comfort teddy"
          >
            <Image
              src="/images/teddy-comfort.jpg"
              alt="Comfort teddy bear"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        </div>

        <ul className="mt-4 space-y-1">
          {plan.items.map((item) => {
            const key = `${plan.day}:${item}`;
            const isDone = Boolean(done[key]);
            return (
              <li key={item}>
                <button
                  onClick={() => toggle(key)}
                  className="flex w-full items-start gap-2.5 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-[var(--surface-sunk)]"
                >
                  <span className="mt-[1px]"><Checkbox checked={isDone} /></span>
                  <span
                    className="text-[13px] leading-relaxed"
                    style={{
                      color: isDone ? "var(--text-faint)" : "var(--text)",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="mt-4 rounded-[11px] px-3.5 py-2.5 text-center text-[12.5px] font-medium"
          style={{ background: t.bg, color: t.fg }}
        >
          {plan.footer}
        </div>
      </Card>

      {/* General care + Do's and Don'ts */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle icon="shield" title="General care" subtitle="All five days." />
          <ul className="space-y-1.5">
            {PERIOD_GENERAL_CARE.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-[12.8px] leading-relaxed">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)", opacity: 0.6 }} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle icon="check" title="Do's & Don'ts" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card-flat p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: "#4b8268" }}>
                <Icon name="check" size={13} strokeWidth={2.6} /> DO
              </p>
              <ul className="space-y-1.5">
                {PERIOD_DOS.map((d) => (
                  <li key={d} className="text-[12.2px] leading-snug">{d}</li>
                ))}
              </ul>
            </div>
            <div className="card-flat p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: "var(--color-blossom-500)" }}>
                <Icon name="close" size={13} strokeWidth={2.6} /> DON'T
              </p>
              <ul className="space-y-1.5">
                {PERIOD_DONTS.map((d) => (
                  <li key={d} className="text-[12.2px] leading-snug">{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Dua + Dhikr */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle icon="pray" title="Dua" subtitle="Whenever you feel low." />
          <p
            dir="rtl"
            lang="ar"
            className="mb-3 text-center text-[19px] leading-[2]"
            style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
          >
            {PERIOD_DUA.arabic}
          </p>
          <p className="muted text-center text-[12.5px] italic leading-relaxed">{PERIOD_DUA.transliteration}</p>
          <div className="card-sunk mt-3 p-3.5">
            <p className="text-[12.8px] leading-relaxed">“{PERIOD_DUA.translation}”</p>
            <p className="faint mt-1.5 text-[11.5px]">{PERIOD_DUA.reference}</p>
          </div>
        </Card>

        <Card>
          <SectionTitle icon="sparkle" title="Dhikr to recite" subtitle="After Salah, or any time you feel low." />
          <div className="space-y-2">
            {PERIOD_DHIKR.map((d) => (
              <div key={d.text} className="card-flat flex items-center justify-between p-3">
                <span className="text-[13.5px] font-medium">{d.text}</span>
                <span className="chip" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  {d.count}
                </span>
              </div>
            ))}
          </div>
          <div className="card-sunk mt-3 flex items-start gap-2.5 p-3.5">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
              <Icon name="heart" size={14} />
            </span>
            <p className="text-[12.5px] leading-relaxed">{PERIOD_BLESSING}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
