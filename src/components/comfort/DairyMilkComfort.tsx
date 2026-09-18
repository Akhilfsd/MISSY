"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Card, Chip, Toast, useToast } from "@/components/ui";

const CHOCOLATE_OPTIONS = [
  { id: "silk", name: "Dairy Milk Silk", tag: "Melt-in-mouth", desc: "Silky smooth, gentle comfort for when cramps feel heavy." },
  { id: "fruit-nut", name: "Fruit & Nut", tag: "Crunchy & sweet", desc: "A little chewy crunch with raisins and almonds." },
  { id: "roast-almond", name: "Roast Almond", tag: "Warm & nutty", desc: "Rich and wholesome, perfect with a warm drink." },
  { id: "hot-cocoa", name: "Warm Dairy Milk Cocoa", tag: "For cramps", desc: "Steaming, cozy hot chocolate to sip slowly under a blanket." },
];

export default function DairyMilkComfort({ nickname }: { nickname: string }) {
  const [selected, setSelected] = useState("silk");
  const [hasTreated, setHasTreated] = useState(false);
  const { message, show, toast } = useToast();

  const current = CHOCOLATE_OPTIONS.find((c) => c.id === selected) || CHOCOLATE_OPTIONS[0];

  const handleTreat = () => {
    setHasTreated(true);
    toast(`Enjoy your ${current.name}, ${nickname}. You deserve sweetness today.`);
  };

  return (
    <Card className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "#8a5ea6" }}
      />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[14px] border sm:h-24 sm:w-24"
              style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            >
              <Image
                src="/images/dairy-milk.jpg"
                alt="Cadbury Dairy Milk chocolate and warm cocoa"
                fill
                sizes="96px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="eyebrow" style={{ color: "#7c4d94" }}>
                  Special Period Comfort
                </span>
                <Chip tone="lilac">For {nickname}</Chip>
              </div>
              <h2 className="display mt-1 text-[18px] font-semibold sm:text-[21px]">
                Dairy Milk for Tough Days
              </h2>
              <p className="muted mt-1.5 max-w-lg text-[13px] leading-relaxed">
                Because period days, cramps, and emotional dips deserve a sweet corner.
                When your body hurts or energy drops, take a breath, have some chocolate, and rest.
                Zero guilt — only comfort.
              </p>
            </div>
          </div>
        </div>

        {/* Variety Selector */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CHOCOLATE_OPTIONS.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="card-flat flex flex-col p-3 text-left transition-all"
                style={{
                  borderColor: active ? "#7c4d94" : "var(--border)",
                  background: active ? "color-mix(in srgb, #7c4d94 12%, var(--surface))" : "var(--surface-2)",
                }}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <p className="text-[13px] font-semibold" style={{ color: active ? "#7c4d94" : "var(--text)" }}>
                    {c.name}
                  </p>
                  <span className="faint text-[10px] uppercase font-semibold">{c.tag}</span>
                </div>
                <p className="faint mt-1 text-[11.5px] leading-snug">{c.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Action & Note */}
        <div className="card-sunk mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5">
          <div className="flex items-center gap-2.5">
            <span style={{ color: "#7c4d94" }}>
              <Icon name="heart" size={16} strokeWidth={2} />
            </span>
            <p className="text-[12.8px] leading-tight">
              Selected: <span className="font-semibold">{current.name}</span> · {current.tag}
            </p>
          </div>

          <button
            onClick={handleTreat}
            className="btn-accent text-[12.5px] py-1.5 px-3.5"
            style={{ background: "#7c4d94" }}
          >
            <Icon name="check" size={13} strokeWidth={2.4} />
            {hasTreated ? "Have another piece" : "Take a comforting bite"}
          </button>
        </div>

        <p className="faint mt-2.5 text-center text-[11px] italic">
          Tip: Chocolate contains magnesium and encourages serotonin release, easing both cramp tension and mood swings gently.
        </p>
      </div>

      <Toast message={message} show={show} />
    </Card>
  );
}
