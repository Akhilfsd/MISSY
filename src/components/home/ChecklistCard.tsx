"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Card, Checkbox, EmptyState, ProgressRing, SectionTitle, Skeleton, Toast, useToast } from "@/components/ui";
import { apiFetch, useDayKey } from "@/lib/hooks";

type Item = { id: number; label: string; partOfDay: string; sortOrder: number; done: boolean };

const PARTS: { key: string; label: string; icon: IconName; hint: string }[] = [
  { key: "morning", label: "Morning", icon: "sunrise", hint: "A calm start is enough." },
  { key: "day", label: "Day", icon: "sun", hint: "Small breaks, steady water." },
  { key: "evening", label: "Evening", icon: "sunset", hint: "Slow down, you did enough." },
  { key: "night", label: "Night", icon: "moon", hint: "Rest your eyes and your mind." },
];

export default function ChecklistCard({ manage = false }: { manage?: boolean }) {
  const day = useDayKey();
  const [items, setItems] = useState<Item[] | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const { message, show, toast } = useToast();

  const load = useCallback(async () => {
    if (!day) return;
    const data = await apiFetch<{ items: Item[] }>(`/api/day?date=${day}`);
    setItems(data.items);
  }, [day]);

  useEffect(() => { void load(); }, [load]);

  async function toggle(item: Item) {
    if (!day || !items) return;
    const next = !item.done;
    setItems(items.map((i) => (i.id === item.id ? { ...i, done: next } : i)));
    if (next) toast("That counts. Well done.");
    try {
      await apiFetch("/api/checklist", { method: "POST", body: JSON.stringify({ itemId: item.id, day, done: next }) });
    } catch {
      setItems((cur) => (cur ? cur.map((i) => (i.id === item.id ? { ...i, done: !next } : i)) : cur));
      toast("Couldn't save that.");
    }
  }

  async function addItem(part: string) {
    const label = draft.trim();
    if (!label) return;
    setDraft("");
    setAdding(null);
    try {
      const data = await apiFetch<{ item: Item }>("/api/checklist", {
        method: "PUT",
        body: JSON.stringify({ partOfDay: part, label }),
      });
      setItems((cur) => (cur ? [...cur, data.item] : [data.item]));
      toast("Added to your day.");
    } catch {
      toast("Couldn't add that.");
    }
  }

  async function removeItem(id: number) {
    setItems((cur) => (cur ? cur.filter((i) => i.id !== id) : cur));
    try {
      await apiFetch(`/api/checklist?id=${id}`, { method: "DELETE" });
    } catch { void load(); }
  }

  if (!day || !items) {
    return (
      <Card>
        <SectionTitle icon="droplet" title="Daily Care Checklist" subtitle="Small things, gently." />
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </Card>
    );
  }

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length ? (doneCount / items.length) * 100 : 0;

  return (
    <Card>
      <SectionTitle
        icon="droplet"
        title="Daily Care Checklist"
        subtitle="It resets itself every morning. Nothing here is a demand — just care."
        right={<ProgressRing value={pct} size={62} stroke={6} label={`${doneCount}/${items.length}`} sub="today" />}
      />

      {items.length === 0 ? (
        <EmptyState icon="leaf" title="Your checklist is empty" hint="Add a few small things you want to remember each day." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {PARTS.map((part) => {
            const group = items.filter((i) => i.partOfDay === part.key);
            const gDone = group.filter((i) => i.done).length;
            const complete = group.length > 0 && gDone === group.length;
            return (
              <div key={part.key} className="card-flat p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: complete ? "var(--accent)" : "var(--text-faint)" }}>
                      <Icon name={part.icon} size={15} />
                    </span>
                    <p className="text-[13px] font-semibold">{part.label}</p>
                  </div>
                  <span className="faint text-[11px] tabular-nums">{gDone}/{group.length}</span>
                </div>
                <p className="faint mb-3 text-[11px]">{part.hint}</p>
                <ul className="space-y-0.5">
                  {group.map((item) => (
                    <li key={item.id} className="group flex items-center gap-1">
                      <button
                        onClick={() => toggle(item)}
                        className="flex flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-[var(--surface-sunk)]"
                      >
                        <Checkbox checked={item.done} />
                        <span
                          className="text-[12.5px] leading-snug"
                          style={{
                            color: item.done ? "var(--text-faint)" : "var(--text)",
                            textDecoration: item.done ? "line-through" : "none",
                          }}
                        >
                          {item.label}
                        </span>
                      </button>
                      {manage ? (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ color: "var(--text-faint)" }}
                          aria-label="Remove"
                        >
                          <Icon name="close" size={12} />
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {manage ? (
                  adding === part.key ? (
                    <div className="mt-2 flex gap-1.5">
                      <input
                        autoFocus
                        className="soft-input text-[12.5px]"
                        value={draft}
                        placeholder="Something small…"
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void addItem(part.key);
                          if (e.key === "Escape") setAdding(null);
                        }}
                      />
                      <button onClick={() => void addItem(part.key)} className="btn-accent shrink-0 px-2.5">
                        <Icon name="check" size={13} strokeWidth={2.4} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAdding(part.key); setDraft(""); }}
                      className="mt-2 flex items-center gap-1 text-[11.5px] transition-colors hover:opacity-70"
                      style={{ color: "var(--text-faint)" }}
                    >
                      <Icon name="plus" size={11} strokeWidth={2.2} /> add something
                    </button>
                  )
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      <Toast message={message} show={show} />
    </Card>
  );
}
