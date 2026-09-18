"use client";

import { useMemo, useState } from "react";
import { Card, Chip, EmptyState, Field, Modal, SectionTitle, Toast, useToast } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CAT_ICON } from "@/components/home/UpcomingMini";
import { EVENT_CATEGORIES } from "@/lib/content";
import { addDays, diffDays, prettyDate, toDayKey } from "@/lib/dates";
import { apiFetch, useDayKey } from "@/lib/hooks";

export type EventRow = {
  id: number;
  title: string;
  description: string;
  day: string;
  time: string | null;
  category: string;
  remind: boolean;
  repeatYearly: boolean;
};



function occurrenceFor(e: EventRow, todayKey: string): string {
  if (!e.repeatYearly) return e.day;
  const [, m, d] = e.day.split("-");
  const year = Number(todayKey.slice(0, 4));
  const thisYear = `${year}-${m}-${d}`;
  return diffDays(todayKey, thisYear) >= 0 ? thisYear : `${year + 1}-${m}-${d}`;
}

export default function EventsSection({ initial }: { initial: EventRow[] }) {
  const todayKey = useDayKey();
  const [events, setEvents] = useState<EventRow[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    day: "",
    time: "",
    category: "personal",
    remind: true,
    repeatYearly: false,
  });
  const [busy, setBusy] = useState(false);
  const { message, show, toast } = useToast();

  const base = todayKey ?? "2025-01-01";

  const upcoming = useMemo(() => {
    return events
      .map((e) => ({ e, when: occurrenceFor(e, base) }))
      .filter((x) => diffDays(base, x.when) >= 0)
      .sort((a, b) => a.when.localeCompare(b.when))
      .slice(0, 8);
  }, [events, base]);

  const monthGrid = useMemo(() => {
    const d = new Date(Number(base.slice(0, 4)), Number(base.slice(5, 7)) - 1 + monthOffset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7; // Monday first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startPad; i += 1) cells.push(null);
    for (let i = 1; i <= daysInMonth; i += 1) cells.push(toDayKey(new Date(year, month, i)));
    return { cells, label: first.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) };
  }, [base, monthOffset]);

  function eventsOn(key: string): EventRow[] {
    return events.filter((e) =>
      e.repeatYearly ? e.day.slice(5) === key.slice(5) : e.day === key,
    );
  }

  function openNew(day?: string) {
    setEditing(null);
    setForm({ title: "", description: "", day: day ?? base, time: "", category: "personal", remind: true, repeatYearly: false });
    setOpen(true);
  }

  function openEdit(e: EventRow) {
    setEditing(e);
    setForm({
      title: e.title,
      description: e.description,
      day: e.day,
      time: e.time ?? "",
      category: e.category,
      remind: e.remind,
      repeatYearly: e.repeatYearly,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.day) {
      toast("A title and a date, please.");
      return;
    }
    setBusy(true);
    try {
      if (editing) {
        const data = await apiFetch<{ event: EventRow }>("/api/events", {
          method: "PATCH",
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        setEvents((cur) => cur.map((x) => (x.id === editing.id ? data.event : x)));
        toast("Updated.");
      } else {
        const data = await apiFetch<{ event: EventRow }>("/api/events", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setEvents((cur) => [...cur, data.event]);
        toast("Added to your calendar 📅");
      }
      setOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(e: EventRow) {
    const before = events;
    setEvents(events.filter((x) => x.id !== e.id));
    try {
      await apiFetch(`/api/events?id=${e.id}`, { method: "DELETE" });
      toast("Removed.");
    } catch {
      setEvents(before);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          icon="calendar"
          title="Important Dates"
          subtitle="Birthdays, appointments, exams, quiet plans — all in one soft place."
          right={<button onClick={() => openNew()} className="btn-primary">+ Add date</button>}
        />

        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setMonthOffset((m) => m - 1)} className="btn-ghost">←</button>
          <p className="display text-sm font-semibold">{monthGrid.label}</p>
          <button onClick={() => setMonthOffset((m) => m + 1)} className="btn-ghost">→</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="muted text-[10px] font-semibold uppercase">{d}</span>
          ))}
          {monthGrid.cells.map((key, i) => {
            if (!key) return <span key={`pad-${i}`} />;
            const list = eventsOn(key);
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                onClick={() => openNew(key)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-[12px] transition-all hover:border-blossom-300 ${
                  isToday ? "bg-gradient-to-br from-blossom-100 to-lilac-100 font-semibold" : ""
                }`}
                style={{ borderColor: isToday ? "transparent" : "var(--border)" }}
                title={list.map((e) => e.title).join(", ") || "Add something"}
              >
                <span>{Number(key.slice(8))}</span>
                {list.length ? (
                  <span className="mt-0.5 flex gap-0.5">
                    {list.slice(0, 3).map((e) => (
                      <span key={e.id} className="h-1.5 w-1.5 rounded-full bg-blossom-400" />
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="muted mt-3 text-[11px]">Tip: tap any day to add something to it.</p>
      </Card>

      <Card>
        <SectionTitle icon="flower" title="Coming up" />
        {upcoming.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="Nothing on the horizon"
            hint="Add a birthday, an appointment, or a small plan you're looking forward to."
            action={<button onClick={() => openNew()} className="btn-primary">Add the first one</button>}
          />
        ) : (
          <ul className="space-y-2">
            {upcoming.map(({ e, when }, i) => {
              const away = diffDays(base, when);
              return (
                <li
                  key={`${e.id}-${when}`}
                  className="group animate-fade-up flex items-center gap-3 rounded-2xl border p-3"
                  style={{ borderColor: "var(--border)", animationDelay: `${i * 35}ms` }}
                >
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blossom-100 to-lilac-100">
                    <span className="text-[13px] font-bold leading-none">{Number(when.slice(8))}</span>
                    <span className="text-[9px] uppercase">{new Date(when).toLocaleDateString("en-GB", { month: "short" })}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug">
                      <Icon name={CAT_ICON[e.category] ?? "star"} size={13} /> {e.title}
                    </p>
                    <p className="muted text-[12px]">
                      {away === 0 ? "Today" : away === 1 ? "Tomorrow" : `in ${away} days`}
                      {e.time ? ` · ${e.time}` : ""}
                      {e.description ? ` · ${e.description}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(e)} className="muted text-[12px]">edit</button>
                    <button onClick={() => remove(e)} className="muted text-[12px] hover:text-blossom-500">delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <SectionTitle icon="briefcase" title="All your dates" subtitle={`${events.length} saved`} />
        {events.length === 0 ? (
          <EmptyState title="Nothing saved yet" hint="Your calendar is quiet and that's okay." />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {[...events].sort((a, b) => a.day.localeCompare(b.day)).map((e) => (
              <div key={e.id} className="group flex items-start justify-between gap-2 rounded-2xl border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold"><Icon name={CAT_ICON[e.category] ?? "star"} size={13} /> {e.title}</p>
                  <p className="muted text-[12px]">
                    {prettyDate(e.day)}{e.time ? ` · ${e.time}` : ""}{e.repeatYearly ? " · every year" : ""}
                  </p>
                  {e.description ? <p className="muted mt-0.5 text-[12px] leading-snug">{e.description}</p> : null}
                  <div className="mt-1.5 flex gap-1.5">
                    <Chip tone="lilac">{e.category}</Chip>
                    {e.remind ? <Chip tone="mint">reminder on</Chip> : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEdit(e)} className="muted text-[11px]">edit</button>
                  <button onClick={() => remove(e)} className="muted text-[11px] hover:text-blossom-500">delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit date" : "Add a date"}>
        <div className="space-y-3">
          <Field label="Title">
            <input className="soft-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Eye check-up" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" className="soft-input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
            </Field>
            <Field label="Time (optional)">
              <input type="time" className="soft-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
          </div>
          <Field label="Category">
            <select className="soft-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Note (optional)">
            <textarea className="soft-input min-h-[70px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="flex flex-wrap gap-4 text-[13px]">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.remind} onChange={(e) => setForm({ ...form, remind: e.target.checked })} className="accent-[#e96e97]" />
              Gentle reminder
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.repeatYearly} onChange={(e) => setForm({ ...form, repeatYearly: e.target.checked })} className="accent-[#e96e97]" />
              Every year
            </label>
          </div>
          <button onClick={save} disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Save changes" : "Add it"}
          </button>
        </div>
      </Modal>
      <Toast message={message} show={show} />
      <div className="flex justify-center pt-2 opacity-50" style={{ color: "var(--accent)" }}>
        <Icon name="flower" size={16} />
      </div>
    </div>
  );
}
