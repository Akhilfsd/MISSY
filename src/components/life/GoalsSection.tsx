"use client";

import { useState } from "react";
import { Card, Chip, EmptyState, Field, Modal, ProgressRing, SectionTitle, Toast, useToast } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { GOAL_CATEGORIES } from "@/lib/content";
import { apiFetch } from "@/lib/hooks";

export type Goal = {
  id: number;
  category: string;
  title: string;
  description: string;
  progress: number;
  done: boolean;
};

export default function GoalsSection({ initial }: { initial: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initial);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "dream", progress: 0 });
  const [busy, setBusy] = useState(false);
  const { message, show, toast } = useToast();

  function openNew(category = "dream") {
    setEditing(null);
    setForm({ title: "", description: "", category, progress: 0 });
    setOpen(true);
  }

  function openEdit(g: Goal) {
    setEditing(g);
    setForm({ title: g.title, description: g.description, category: g.category, progress: g.progress });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) {
      toast("It needs a little title first.");
      return;
    }
    setBusy(true);
    try {
      if (editing) {
        const data = await apiFetch<{ goal: Goal }>("/api/goals", {
          method: "PATCH",
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        setGoals((g) => g.map((x) => (x.id === editing.id ? data.goal : x)));
        toast("Updated.");
      } else {
        const data = await apiFetch<{ goal: Goal }>("/api/goals", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setGoals((g) => [data.goal, ...g]);
        toast("Added to your little future.");
      }
      setOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  async function setProgress(goal: Goal, progress: number) {
    setGoals((g) => g.map((x) => (x.id === goal.id ? { ...x, progress, done: progress >= 100 } : x)));
    try {
      await apiFetch("/api/goals", { method: "PATCH", body: JSON.stringify({ id: goal.id, progress }) });
    } catch {
      toast("Couldn't save progress.");
    }
  }

  async function remove(goal: Goal) {
    const before = goals;
    setGoals((g) => g.filter((x) => x.id !== goal.id));
    try {
      await apiFetch(`/api/goals?id=${goal.id}`, { method: "DELETE" });
      toast("Removed.");
    } catch {
      setGoals(before);
    }
  }

  const visible = filter === "all" ? goals : goals.filter((g) => g.category === filter);
  const avg = goals.length ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          icon="sprout"
          title="Your Little Future"
          subtitle="Dreams, goals, small wishes and the things you're already proud of."
          right={<ProgressRing value={avg} size={72} sub="overall" />}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${filter === "all" ? "border-transparent bg-gradient-to-r from-blossom-100 to-lilac-100 font-semibold" : ""}`}
            style={filter === "all" ? undefined : { borderColor: "var(--border)" }}
          >
            All ({goals.length})
          </button>
          {GOAL_CATEGORIES.map((c) => {
            const count = goals.filter((g) => g.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${filter === c.key ? "border-transparent bg-gradient-to-r from-blossom-100 to-lilac-100 font-semibold" : ""}`}
                style={filter === c.key ? undefined : { borderColor: "var(--border)" }}
              >
                <Icon name={c.icon as IconName} size={12} /> {c.label}{count ? ` (${count})` : ""}
              </button>
            );
          })}
          <button onClick={() => openNew(filter === "all" ? "dream" : filter)} className="btn-primary ml-auto">
            + Add something
          </button>
        </div>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            icon="sparkle"
            title="Nothing here yet"
            hint="Even the smallest wish counts. Write one down — you can always change it later."
            action={<button onClick={() => openNew(filter === "all" ? "dream" : filter)} className="btn-primary">Write the first one</button>}
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((g, i) => {
            const meta = GOAL_CATEGORIES.find((c) => c.key === g.category) ?? GOAL_CATEGORIES[0];
            return (
              <div
                key={g.id}
                className="card animate-fade-up group flex flex-col p-4"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <Chip tone="lilac" icon={meta.icon as IconName}>{meta.label}</Chip>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(g)} className="muted text-[12px] hover:opacity-70">edit</button>
                    <button onClick={() => remove(g)} className="muted text-[12px] hover:text-blossom-500">delete</button>
                  </div>
                </div>
                <p className="display mt-2 text-[15px] font-semibold leading-snug">{g.title}</p>
                {g.description ? <p className="muted mt-1 text-[12.5px] leading-relaxed">{g.description}</p> : null}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="muted">{g.done ? "done" : "progress"}</span>
                    <span className="tabular-nums font-semibold">{g.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blossom-300 to-lilac-300 transition-all duration-500"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={g.progress}
                    onChange={(e) => setProgress(g, Number(e.target.value))}
                    className="mt-2 w-full accent-[#b79bf2]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit" : "Add something lovely"}>
        <div className="space-y-3">
          <Field label="What is it?">
            <input className="soft-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Learn to swim" />
          </Field>
          <Field label="A little more (optional)">
            <textarea className="soft-input min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Where does it belong?">
            <select className="soft-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {GOAL_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label={`Progress (${form.progress}%)`}>
            <input type="range" min={0} max={100} step={5} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-[#b79bf2]" />
          </Field>
          <button onClick={save} disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Save changes" : "Add it"}
          </button>
        </div>
      </Modal>
      <Toast message={message} show={show} />
    </div>
  );
}
