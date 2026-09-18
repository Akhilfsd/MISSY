"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Card, EmptyState, SectionTitle, Toast, useToast } from "@/components/ui";
import { CAPABILITY_REMINDERS, rotate } from "@/lib/content";
import { apiFetch, useDayKey } from "@/lib/hooks";
import { dayIndexFromKey } from "@/lib/content";

export type Capability = { id: number; text: string; category: string };

const CATEGORIES = ["Capable of", "Quality", "Strength", "Dream", "Achievement"];

export default function CapabilitiesSection({ initial }: { initial: Capability[] }) {
  const [items, setItems] = useState<Capability[]>(initial);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Capable of");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const { message, show, toast } = useToast();
  const day = useDayKey();

  const line = day ? rotate(CAPABILITY_REMINDERS, dayIndexFromKey(day), 3) : CAPABILITY_REMINDERS[0];

  async function add() {
    const value = text.trim();
    if (!value) return;
    const optimistic: Capability = { id: -Date.now(), text: value, category };
    setItems([optimistic, ...items]);
    setText("");
    try {
      const data = await apiFetch<{ capability: Capability }>("/api/capabilities", {
        method: "POST",
        body: JSON.stringify({ text: value, category }),
      });
      setItems((cur) => cur.map((c) => (c.id === optimistic.id ? data.capability : c)));
      toast("Added. This is true about you. 🌟");
    } catch {
      setItems((cur) => cur.filter((c) => c.id !== optimistic.id));
      toast("Couldn't add that.");
    }
  }

  async function saveEdit(id: number) {
    const value = draft.trim();
    if (!value) return;
    setItems((cur) => cur.map((c) => (c.id === id ? { ...c, text: value } : c)));
    setEditingId(null);
    try {
      await apiFetch("/api/capabilities", { method: "PATCH", body: JSON.stringify({ id, text: value }) });
    } catch {
      toast("Couldn't save that.");
    }
  }

  async function remove(id: number) {
    const before = items;
    setItems(items.filter((c) => c.id !== id));
    try {
      await apiFetch(`/api/capabilities?id=${id}`, { method: "DELETE" });
    } catch {
      setItems(before);
    }
  }

  return (
    <Card>
      <SectionTitle
        icon="sparkle"
        title="Remember Who You Are"
        subtitle="Things you are capable of, qualities you already have, quiet proof of you."
        right={
          <div
            className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
            style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            title="Cozy study & growth"
          >
            <Image
              src="/images/girl-morning.jpg"
              alt="Woman in morning light"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        }
      />

      <div className="card-sunk p-4">
        <div className="flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
          <Icon name="star" size={13} />
          <p className="eyebrow" style={{ color: "var(--accent)" }}>Today&apos;s thought</p>
        </div>
        <p className="display mt-1.5 text-[17px] font-semibold leading-snug">{line}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="soft-input"
          value={text}
          placeholder="Add something you know is true about you…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void add(); }}
        />
        <select className="soft-input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={add} className="btn-primary shrink-0">Add</button>
      </div>

      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon="smile"
            title="Nothing written here yet"
            hint="Start with one small thing — “I am capable of starting again.”"
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {items.map((c, i) => (
            <li
              key={c.id}
              className="group animate-fade-up flex items-start gap-2 rounded-2xl border p-3"
              style={{ borderColor: "var(--border)", animationDelay: `${i * 30}ms` }}
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)", opacity: 0.6 }} />
              <div className="min-w-0 flex-1">
                {editingId === c.id ? (
                  <input
                    autoFocus
                    className="soft-input text-[13px]"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => saveEdit(c.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") void saveEdit(c.id); }}
                  />
                ) : (
                  <>
                    <p className="text-[13.5px] leading-snug">{c.text}</p>
                    <span className="muted text-[11px]">{c.category}</span>
                  </>
                )}
              </div>
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => { setEditingId(c.id); setDraft(c.text); }} className="muted text-[11px]">edit</button>
                <button onClick={() => remove(c.id)} className="muted text-[11px] hover:text-blossom-500">×</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Toast message={message} show={show} />
    </Card>
  );
}
