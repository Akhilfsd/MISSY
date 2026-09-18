"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Card, SectionTitle, Skeleton, Toast, useToast } from "@/components/ui";
import { buildDailyPack } from "@/lib/content";
import { apiFetch, useDayKey } from "@/lib/hooks";

export const MOODS = [
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "okay", emoji: "🙂", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "stressed", emoji: "😣", label: "Stressed" },
  { key: "tired", emoji: "😴", label: "Tired" },
  { key: "irritated", emoji: "😤", label: "Irritated" },
  { key: "peaceful", emoji: "😌", label: "Peaceful" },
];

const ENERGY = ["low", "medium", "high"];

type Checkin = { id: number; mood: string; energy: string; stress: number; note: string; day: string };

export default function CheckinCard({ onSaved }: { onSaved?: () => void }) {
  const day = useDayKey();
  const [checkin, setCheckin] = useState<Checkin | null | undefined>(undefined);
  const [mood, setMood] = useState("okay");
  const [energy, setEnergy] = useState("medium");
  const [stress, setStress] = useState(3);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const { message, show, toast } = useToast();

  const load = useCallback(async () => {
    if (!day) return;
    const data = await apiFetch<{ checkin: Checkin | null }>(`/api/day?date=${day}`);
    setCheckin(data.checkin);
    if (data.checkin) {
      setMood(data.checkin.mood);
      setEnergy(data.checkin.energy);
      setStress(data.checkin.stress);
      setNote(data.checkin.note);
    }
  }, [day]);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!day) return;
    setSaving(true);
    try {
      const data = await apiFetch<{ checkin: Checkin }>("/api/checkins", {
        method: "POST",
        body: JSON.stringify({ day, mood, energy, stress, note }),
      });
      setCheckin(data.checkin);
      toast("Saved. Thank you for telling me.");
      onSaved?.();
    } catch {
      toast("Couldn't save that right now.");
    } finally {
      setSaving(false);
    }
  }

  if (!day || checkin === undefined) {
    return (
      <Card>
        <SectionTitle icon="mind" title="How are you really feeling today?" />
        <Skeleton className="h-28 w-full" />
      </Card>
    );
  }

  const pack = buildDailyPack(day);

  return (
    <Card>
      <SectionTitle
        icon="mind"
        title="How are you really feeling today?"
        subtitle="No right answer. Nobody else sees this."
        right={
          <div
            className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
            style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            title="Cozy evening tea"
          >
            <Image
              src="/images/girl-cozy-evening.jpg"
              alt="Woman drinking warm tea"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {MOODS.map((m) => {
          const active = mood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className="flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-[12.5px] transition-all"
              style={{
                borderColor: active ? "var(--accent)" : "var(--border-strong)",
                background: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-soft)",
                fontWeight: active ? 600 : 450,
              }}
            >
              <span className="text-[14px] leading-none">{m.emoji}</span> {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">Energy</p>
          <div className="flex gap-1.5">
            {ENERGY.map((e) => {
              const active = energy === e;
              return (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  className="flex-1 rounded-[9px] border px-2 py-1.5 text-[12px] capitalize transition-all"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--border-strong)",
                    background: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-soft)",
                    fontWeight: active ? 600 : 450,
                  }}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2">Stress · <span className="tabular-nums">{stress}/10</span></p>
          <input
            type="range"
            min={0}
            max={10}
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="mt-1.5 w-full"
            style={{ accentColor: "var(--accent)" }}
          />
        </div>
      </div>

      <p className="eyebrow mb-2 mt-4">What is on your mind?</p>
      <textarea
        className="soft-input min-h-[92px] resize-y leading-relaxed"
        placeholder="Anything at all. Even one line."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="faint max-w-xs text-[12px] italic leading-snug">{pack.pause}</p>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : checkin ? "Update today" : "Save today"}
        </button>
      </div>
      <Toast message={message} show={show} />
    </Card>
  );
}
