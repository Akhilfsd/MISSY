"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, EmptyState, SectionTitle, Skeleton } from "@/components/ui";
import { prettyDate, weekdayName } from "@/lib/dates";
import { apiFetch } from "@/lib/hooks";
import { MOODS } from "@/components/home/CheckinCard";

type Checkin = { id: number; day: string; mood: string; energy: string; stress: number; note: string };

export default function CheckinTimeline({ refreshKey = 0 }: { refreshKey?: number }) {
  const [rows, setRows] = useState<Checkin[] | null>(null);

  const load = useCallback(async () => {
    const data = await apiFetch<{ checkins: Checkin[] }>("/api/checkins");
    setRows(data.checkins);
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function remove(id: number) {
    setRows((cur) => (cur ? cur.filter((r) => r.id !== id) : cur));
    try {
      await apiFetch(`/api/checkins?id=${id}`, { method: "DELETE" });
    } catch {
      void load();
    }
  }

  return (
    <Card>
      <SectionTitle icon="clock" title="Your quiet timeline" subtitle="Only you can see these." />
      {!rows ? (
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon="mug"
          title="No check-ins yet"
          hint="Whenever you tell me how you're feeling, it will gently collect here."
        />
      ) : (
        <ol className="relative space-y-3 pl-5">
          <span className="absolute left-1.5 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-blossom-200 via-lilac-200 to-transparent" />
          {rows.map((r, i) => {
            const mood = MOODS.find((m) => m.key === r.mood);
            return (
              <li key={r.id} className="animate-fade-up relative" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="absolute -left-[13px] top-3 h-2.5 w-2.5 rounded-full bg-lilac-300" />
                <div className="group rounded-2xl border p-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13.5px] font-semibold">
                        {mood?.emoji ?? ""} {mood?.label ?? r.mood}
                        <span className="muted font-normal"> · {weekdayName(r.day)}, {prettyDate(r.day)}</span>
                      </p>
                      <p className="muted text-[12px]">{r.energy} energy · stress {r.stress}/10</p>
                    </div>
                    <button onClick={() => remove(r.id)} className="muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-blossom-500">×</button>
                  </div>
                  {r.note ? <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed">{r.note}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
