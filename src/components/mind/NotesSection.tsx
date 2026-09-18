"use client";

import { useState } from "react";
import { Card, EmptyState, Field, Modal, SectionTitle, Toast, useToast } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { NOTE_CATEGORIES } from "@/lib/content";
import { apiFetch } from "@/lib/hooks";

export type NoteRow = { id: number; category: string; body: string; author: string };

export default function NotesSection({ initial }: { initial: NoteRow[] }) {
  const [notes, setNotes] = useState<NoteRow[]>(initial);
  const [active, setActive] = useState(NOTE_CATEGORIES[0].key);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ body: "", category: NOTE_CATEGORIES[0].key });
  const [busy, setBusy] = useState(false);
  const { message, show, toast } = useToast();

  const list = notes.filter((n) => n.category === active);
  const current = list.length ? list[index % list.length] : null;
  const meta = NOTE_CATEGORIES.find((c) => c.key === active)!;

  async function save() {
    if (!form.body.trim()) {
      toast("Write a line first.");
      return;
    }
    setBusy(true);
    try {
      const data = await apiFetch<{ note: NoteRow }>("/api/notes", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setNotes([data.note, ...notes]);
      setActive(form.category);
      setIndex(0);
      setForm({ body: "", category: form.category });
      setOpen(false);
      toast("Kept safe. 💌");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    const before = notes;
    setNotes(notes.filter((n) => n.id !== id));
    try {
      await apiFetch(`/api/notes?id=${id}`, { method: "DELETE" });
    } catch {
      setNotes(before);
    }
  }

  return (
    <Card>
      <SectionTitle
        icon="heart"
        title="Read This When…"
        subtitle="Short letters for the moments that need them."
        right={<button onClick={() => { setForm({ body: "", category: active }); setOpen(true); }} className="btn-primary">+ Write one</button>}
      />

      <div className="flex flex-wrap gap-2">
        {NOTE_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => { setActive(c.key); setIndex(0); }}
            className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${
              active === c.key ? "border-transparent bg-gradient-to-r from-blossom-100 to-lilac-100 font-semibold" : ""
            }`}
            style={active === c.key ? undefined : { borderColor: "var(--border)" }}
          >
            <Icon name={c.icon as IconName} size={12} /> {c.short}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {!current ? (
          <EmptyState
            icon="leaf"
            title="Nothing written here yet"
            hint={`Add a message for the days you ${meta.label.toLowerCase().replace("read this when ", "")}.`}
            action={<button onClick={() => { setForm({ body: "", category: active }); setOpen(true); }} className="btn-primary">Write one</button>}
          />
        ) : (
          <div key={current.id} className="animate-pop rounded-3xl bg-gradient-to-br from-blossom-100/50 to-lilac-100/50 p-5 sm:p-6">
            <p className="eyebrow flex items-center gap-1.5"><Icon name={meta.icon as IconName} size={12} /> {meta.label}</p>
            <p className="display mt-3 text-[16.5px] leading-relaxed sm:text-[18px]">{current.body}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className="muted text-[12px]">— {current.author} · {(index % list.length) + 1} of {list.length}</span>
              <div className="flex gap-2">
                <button onClick={() => setIndex((i) => i + 1)} className="btn-ghost">Another one →</button>
                <button onClick={() => remove(current.id)} className="btn-ghost">Remove</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Write a little message">
        <div className="space-y-3">
          <Field label="For which moment?">
            <select className="soft-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {NOTE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="The message" hint="Keep it simple and human. It doesn't need to be poetic.">
            <textarea className="soft-input min-h-[120px] resize-y" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </Field>
          <button onClick={save} disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Saving…" : "Keep it safe"}
          </button>
        </div>
      </Modal>
      <Toast message={message} show={show} />
    </Card>
  );
}
