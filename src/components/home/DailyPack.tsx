"use client";

import { Icon, type IconName } from "@/components/icons";
import { Card, Chip, SectionTitle, Skeleton, type Tone } from "@/components/ui";
import { NOTE_CATEGORIES, buildDailyPack } from "@/lib/content";
import { useDayKey } from "@/lib/hooks";

export default function DailyPack({ nickname }: { nickname: string }) {
  const day = useDayKey();
  if (!day) {
    return (
      <Card>
        <SectionTitle icon="sparkle" title="Today's collection" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }
  const pack = buildDailyPack(day);
  const noteCat = pack.note ? NOTE_CATEGORIES.find((c) => c.key === pack.note?.category) : null;

  const cards: { label: string; text: string; icon: IconName; tone: Tone; tag: string }[] = [
    { label: "Your value today", text: pack.value.text, icon: "gem", tone: "blush", tag: pack.value.category },
    { label: "Your confidence", text: pack.capability, icon: "shield", tone: "lilac", tag: "Remember who you are" },
    { label: "A calm moment", text: pack.pause, icon: "wind", tone: "mint", tag: "Pause" },
    { label: "Self-care nudge", text: pack.gentle.replace(/\bPgl\b/g, nickname), icon: "droplet", tone: "sky", tag: "Gentle care" },
  ];

  return (
    <Card>
      <SectionTitle
        icon="sparkle"
        title="Today's collection"
        subtitle="Chosen for today only — tomorrow they change."
      />
      <div className="grid gap-2.5 sm:grid-cols-2">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className="card-flat animate-fade-up flex items-start gap-3 p-4"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <span className="icon-tile" style={{ color: "var(--accent)" }}>
              <Icon name={c.icon} size={16} />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">{c.label}</p>
              <p className="display mt-1.5 text-[14.5px] font-medium leading-snug">{c.text}</p>
              <div className="mt-2"><Chip tone={c.tone}>{c.tag}</Chip></div>
            </div>
          </div>
        ))}
      </div>

      {pack.note && noteCat ? (
        <div className="card-sunk mt-2.5 p-4">
          <p className="eyebrow">{noteCat.label}</p>
          <p className="display mt-1.5 text-[14.5px] leading-relaxed">{pack.note.body}</p>
        </div>
      ) : null}
    </Card>
  );
}
