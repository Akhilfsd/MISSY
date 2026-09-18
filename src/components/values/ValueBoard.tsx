"use client";

import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { Card, toneStyles, type Tone } from "@/components/ui";
import {
  VALUE_BOARD,
  VALUE_BOARD_CENTREPIECE,
  VALUE_BOARD_NOTES,
} from "@/lib/content";

export default function ValueBoard({ nickname }: { nickname: string }) {
  return (
    <div className="space-y-4">
      {/* Centrepiece */}
      <div className="card relative overflow-hidden p-6 text-center sm:p-9">
        <div
          className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--accent-soft)" }}
        />
        <div
          className="pointer-events-none absolute -right-24 -bottom-28 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--color-lilac-100)" }}
        />
        <div className="relative flex flex-col items-center">
          <div
            className="relative h-28 w-28 overflow-hidden rounded-[20px] border shadow-md sm:h-36 sm:w-36"
            style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
          >
            <Image
              src="/images/girl-precious.jpg"
              alt="You are precious, Misba"
              fill
              sizes="144px"
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          <p className="eyebrow mt-4">Just a little reminder</p>
          <h2 className="display mt-2 max-w-2xl text-[23px] font-semibold leading-[1.3] sm:text-[31px]">
            {VALUE_BOARD_CENTREPIECE}
          </h2>
          <p className="muted mt-3 max-w-md text-[13.5px] leading-relaxed">
            Not because of what you do, but simply because you exist. Never forget that, {nickname}.
          </p>
        </div>
      </div>

      {/* Value groups */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {VALUE_BOARD.map((group, gi) => {
          const t = toneStyles(group.tone as Tone);
          return (
            <Card key={group.key} className="flex flex-col" delay={gi * 50}>
              <div className="mb-3.5 flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                  style={{ background: t.bg, color: t.fg }}
                >
                  <Icon name={group.icon as IconName} size={16} />
                </span>
                <h3 className="display text-[15.5px] font-semibold">{group.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: t.fg, opacity: 0.55 }}
                    />
                    <span className="text-[13.2px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Personal notes */}
      <div className="grid gap-3 sm:grid-cols-2">
        {VALUE_BOARD_NOTES.map((n, i) => (
          <div
            key={n.key}
            className="card-flat animate-fade-up flex items-start gap-3 p-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
              <Icon name="heart" size={15} />
            </span>
            <p className="display text-[14px] leading-relaxed">{n.text}</p>
          </div>
        ))}
      </div>

      {/* Closing */}
      <Card className="text-center">
        <div className="flex flex-col items-center">
          <span className="icon-tile" style={{ color: "var(--accent)" }}>
            <Icon name="gem" size={17} />
          </span>
          <p className="display mt-3 text-[19px] font-semibold sm:text-[22px]">
            You are priceless, {nickname}.
          </p>
          <p className="muted mt-2 max-w-sm text-[13px] leading-relaxed">
            You are a diamond — and diamonds never lose their shine, even on the days they can&apos;t see it
            themselves.
          </p>
        </div>
      </Card>
    </div>
  );
}
