"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Chip, EmptyState, Field, ProgressRing, SectionTitle, Skeleton, Toast, useToast } from "@/components/ui";
import { MEDICAL_FLAGS, PERIOD_CARE_CHECKLIST, PERIOD_DAY_CARE, PHASE_CARE } from "@/lib/content";
import { addDays, computeCycle, diffDays, prettyDate, prettyShort } from "@/lib/dates";
import { apiFetch, useDayKey } from "@/lib/hooks";

type CycleRow = { id: number; startDate: string; endDate: string | null; notes: string };
type LogRow = {
  id: number;
  day: string;
  pain: number;
  energy: string;
  mood: string;
  symptoms: string;
  careDone: string;
  note: string;
};

const SYMPTOMS = ["Cramps", "Headache", "Back pain", "Bloating", "Fatigue", "Other"];
const MOODS = ["calm", "sad", "irritated", "happy", "tired", "other"];

export default function ComfortSection({
  initialSettings,
  initialCycles,
  initialLogs,
  nickname,
}: {
  initialSettings: { cycleLength: number; periodDuration: number; lastPeriodStart: string | null };
  initialCycles: CycleRow[];
  initialLogs: LogRow[];
  nickname: string;
}) {
  const today = useDayKey();
  const [cfg, setCfg] = useState(initialSettings);
  const [cycles, setCycles] = useState<CycleRow[]>(initialCycles);
  const [logs, setLogs] = useState<LogRow[]>(initialLogs);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [savingPeriod, setSavingPeriod] = useState(false);
  const { message, show, toast } = useToast();

  // today's log form
  const [pain, setPain] = useState(0);
  const [energy, setEnergy] = useState("medium");
  const [mood, setMood] = useState("calm");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [careDone, setCareDone] = useState<string[]>([]);
  const [logNote, setLogNote] = useState("");
  const [savingLog, setSavingLog] = useState(false);

  useEffect(() => {
    if (!today) return;
    setNewStart(today);
    const existing = logs.find((l) => l.day === today);
    if (existing) {
      setPain(existing.pain);
      setEnergy(existing.energy);
      setMood(existing.mood);
      setSymptoms(existing.symptoms ? existing.symptoms.split(",").filter(Boolean) : []);
      setCareDone(existing.careDone ? existing.careDone.split(",").filter(Boolean) : []);
      setLogNote(existing.note);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  if (!today) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const cycle = computeCycle(cfg.lastPeriodStart, cfg.cycleLength, cfg.periodDuration, today);

  async function saveConfig(patch: Partial<typeof cfg>) {
    const next = { ...cfg, ...patch };
    setCfg(next);
    try {
      await apiFetch("/api/settings", { method: "PATCH", body: JSON.stringify(patch) });
      toast("Saved.");
    } catch {
      toast("Couldn't save that.");
    }
  }

  async function logPeriodStart() {
    if (!newStart) return;
    setSavingPeriod(true);
    try {
      const data = await apiFetch<{ cycle: CycleRow }>("/api/period", {
        method: "PUT",
        body: JSON.stringify({ startDate: newStart, endDate: newEnd || undefined }),
      });
      setCycles([data.cycle, ...cycles.filter((c) => c.startDate !== newStart)]);
      const patch: Partial<typeof cfg> = { lastPeriodStart: newStart };
      if (newEnd) {
        const days = Math.round((new Date(newEnd).getTime() - new Date(newStart).getTime()) / 86400000) + 1;
        patch.periodDuration = Math.min(12, Math.max(1, days));
      }
      setCfg({ ...cfg, ...patch });
      toast("Saved. Be gentle with yourself.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setSavingPeriod(false);
    }
  }

  async function removeCycle(id: number) {
    setCycles(cycles.filter((c) => c.id !== id));
    try {
      await apiFetch(`/api/period?id=${id}`, { method: "DELETE" });
    } catch {
      toast("Couldn't remove that.");
    }
  }

  async function saveLog() {
    setSavingLog(true);
    try {
      const data = await apiFetch<{ log: LogRow }>("/api/period", {
        method: "POST",
        body: JSON.stringify({ day: today, pain, energy, mood, symptoms, careDone, note: logNote }),
      });
      setLogs([data.log, ...logs.filter((l) => l.day !== today)]);
      toast("Saved privately.");
    } catch {
      toast("Couldn't save that.");
    } finally {
      setSavingLog(false);
    }
  }

  function toggleFrom(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const phaseInfo = cycle ? PHASE_CARE[cycle.phase] : null;
  const careTips =
    cycle && cycle.isPeriodDay && PERIOD_DAY_CARE[cycle.periodDayNumber]
      ? PERIOD_DAY_CARE[cycle.periodDayNumber]
      : cycle && cycle.isPeriodDay
        ? PERIOD_DAY_CARE[5]
        : phaseInfo?.tips ?? [];

  return (
    <div className="space-y-4">
      {/* Prominent quick editor — set/change the last period any time */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blossom-100/60 via-transparent to-lilac-100/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border"
              style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
            >
              <Image
                src="/images/girl-rest.jpg"
                alt="Period tracking rest"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="display text-[17px] font-semibold sm:text-[19px]">When was your last period?</h2>
              <p className="muted mt-1 text-[13px] leading-relaxed">
                Add or change the dates any time — the whole tracker updates from this.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Started on">
            <input type="date" className="soft-input" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
          </Field>
          <Field label="Ended on (optional)">
            <input type="date" className="soft-input" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
          </Field>
          <button onClick={logPeriodStart} disabled={savingPeriod || !newStart} className="btn-primary h-[42px] disabled:opacity-60">
            {savingPeriod ? "Saving…" : "Save my period"}
          </button>
        </div>
        {cfg.lastPeriodStart ? (
          <p className="muted mt-3 text-[12px]">
            Currently tracking from <span className="font-semibold">{prettyDate(cfg.lastPeriodStart)}</span>
            {" · "}period length {cfg.periodDuration} days · cycle {cfg.cycleLength} days.
          </p>
        ) : null}
      </Card>

      <Card>
        <SectionTitle
          icon="moon"
          title={`${nickname}'s Comfort Calendar`}
          subtitle="Private, gentle cycle tracking. Everything here is an estimate, never a medical certainty."
          right={
            <div
              className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
              style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
              title="Comfort Teddy"
            >
              <Image
                src="/images/teddy-comfort.jpg"
                alt="Comfort Teddy Bear"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          }
        />

        {!cycle ? (
          <EmptyState
            icon="calendar"
            title="No cycle information yet"
            hint="Add the first day of your last period and a soft 28-day estimate will appear here."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <input type="date" className="soft-input w-auto" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                <button onClick={logPeriodStart} className="btn-primary">Save start date</button>
              </div>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex justify-center">
                <ProgressRing
                  value={(cycle.cycleDay / cycle.cycleLength) * 100}
                  size={120}
                  stroke={10}
                  label={`Day ${cycle.cycleDay}`}
                  sub={`of ~${cycle.cycleLength}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                <Info label="Phase" value={phaseInfo?.title ?? "—"} />
                <Info label="Est. next period" value={prettyShort(cycle.nextPeriod)} />
                <Info label="Days remaining" value={`${Math.max(0, cycle.daysUntilNext)} days`} />
                <Info label="This cycle began" value={prettyShort(cycle.periodStart)} />
              </div>
            </div>

            <div className="mt-5">
              <p className="muted mb-2 text-[11px] font-semibold uppercase tracking-wide">
                Your {cycle.cycleLength}-day timeline
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: cycle.cycleLength }, (_, i) => i + 1).map((d) => {
                  const isPeriod = d <= cycle.periodDuration;
                  const isToday = d === cycle.cycleDay;
                  const fertile =
                    d >= cycle.cycleLength - 19 && d <= cycle.cycleLength - 13 && !isPeriod;
                  return (
                    <div
                      key={d}
                      title={`Day ${d} · ${prettyShort(addDays(cycle.periodStart, d - 1))}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-semibold transition-all ${
                        isToday ? "scale-110 ring-2 ring-blossom-400" : ""
                      } ${
                        isPeriod
                          ? "bg-gradient-to-br from-blossom-300 to-blossom-400 text-white"
                          : fertile
                            ? "bg-lilac-100 text-lilac-500"
                            : ""
                      }`}
                      style={isPeriod || fertile ? undefined : { background: "var(--surface-solid)", border: "1px solid var(--border)" }}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="pink">Period days (est.)</Chip>
                <Chip tone="lilac">Mid-cycle window (est.)</Chip>
                <Chip tone="sky">Today is highlighted</Chip>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Field label="Cycle length">
                <input
                  type="number"
                  min={20}
                  max={45}
                  className="soft-input"
                  value={cfg.cycleLength}
                  onChange={(e) => setCfg({ ...cfg, cycleLength: Number(e.target.value) })}
                  onBlur={(e) => saveConfig({ cycleLength: Number(e.target.value) })}
                />
              </Field>
              <Field label="Period duration">
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="soft-input"
                  value={cfg.periodDuration}
                  onChange={(e) => setCfg({ ...cfg, periodDuration: Number(e.target.value) })}
                  onBlur={(e) => saveConfig({ periodDuration: Number(e.target.value) })}
                />
              </Field>
              <Field label="Log a new period start">
                <div className="flex gap-2">
                  <input type="date" className="soft-input" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                  <button onClick={logPeriodStart} className="btn-primary shrink-0 px-3">Save</button>
                </div>
              </Field>
            </div>
          </>
        )}
      </Card>

      {cycle ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle
              icon={cycle.isPeriodDay ? "heart" : "flower"}
              title={cycle.isPeriodDay ? `Day ${cycle.periodDayNumber} care` : `Gentle care · ${phaseInfo?.title}`}
              subtitle="Small, practical, kind. Nothing dramatic."
            />
            <ul className="space-y-2">
              {careTips.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)", opacity: 0.6 }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl border p-3 text-[12px] leading-relaxed" style={{ borderColor: "var(--border)" }}>
              <p className="display mb-1 font-semibold">When to seek medical advice</p>
              <ul className="muted space-y-1">
                {MEDICAL_FLAGS.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <p className="muted mt-2">
                These predictions are estimates only — they are not medical advice or certainty.
              </p>
            </div>
          </Card>

          <Card>
            <SectionTitle icon="edit" title="Today's comfort log" subtitle="Only if you feel like it." />
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2">
              {PERIOD_CARE_CHECKLIST.map((c) => {
                const active = careDone.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleFrom(careDone, c, setCareDone)}
                    className={`flex items-center gap-2 rounded-2xl border px-2.5 py-2 text-left text-[12px] transition-all ${
                      active ? "border-transparent bg-blossom-100 font-medium text-blossom-500" : ""
                    }`}
                    style={active ? undefined : { borderColor: "var(--border)" }}
                  >
                    <span className="text-[11px]">{active ? "✓" : "○"}</span>
                    <span className="leading-tight">{c}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="muted mb-1 text-[11px] font-semibold uppercase tracking-wide">Pain ({pain}/10)</p>
                <input type="range" min={0} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full accent-[#e96e97]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="muted mb-1 text-[11px] font-semibold uppercase tracking-wide">Energy</p>
                  <select className="soft-input" value={energy} onChange={(e) => setEnergy(e.target.value)}>
                    {["low", "medium", "high"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <p className="muted mb-1 text-[11px] font-semibold uppercase tracking-wide">Mood</p>
                  <select className="soft-input" value={mood} onChange={(e) => setMood(e.target.value)}>
                    {MOODS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <p className="muted mb-1 text-[11px] font-semibold uppercase tracking-wide">Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOMS.map((s) => {
                    const active = symptoms.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleFrom(symptoms, s, setSymptoms)}
                        className={`rounded-full border px-3 py-1 text-[12px] transition-all ${
                          active ? "border-transparent bg-lilac-100 font-medium text-lilac-500" : ""
                        }`}
                        style={active ? undefined : { borderColor: "var(--border)" }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <textarea
                className="soft-input min-h-[70px] resize-y"
                placeholder="Anything you want to remember about today…"
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
              />
              <button onClick={saveLog} disabled={savingLog} className="btn-primary w-full disabled:opacity-60">
                {savingLog ? "Saving…" : "Save today's log"}
              </button>
            </div>
          </Card>
        </div>
      ) : null}

      <Card>
        <SectionTitle icon="leaf" title="Cycle history" subtitle="A quiet record, kept only for you." />
        {cycles.length === 0 ? (
          <EmptyState
            icon="leaf"
            title="No cycles recorded yet"
            hint="Each time a new period starts, save the date and it will appear here."
          />
        ) : (
          <ol className="relative space-y-3 pl-5">
            <span className="absolute left-1.5 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-blossom-200 via-lilac-200 to-transparent" />
            {cycles.map((c, i) => {
              const nextOne = cycles[i - 1];
              const length = nextOne ? diffDays(c.startDate, nextOne.startDate) : null;
              return (
                <li key={c.id} className="relative">
                  <span className="absolute -left-[13px] top-2 h-2.5 w-2.5 rounded-full bg-blossom-300" />
                  <div className="flex items-start justify-between gap-3 rounded-2xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="text-[13px] font-semibold">{prettyDate(c.startDate)}</p>
                      <p className="muted text-[12px]">
                        {length ? `${length}-day cycle` : "current cycle"}
                        {c.notes ? ` · ${c.notes}` : ""}
                      </p>
                    </div>
                    <button onClick={() => removeCycle(c.id)} className="muted text-sm hover:text-blossom-500" aria-label="Remove">×</button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      {logs.length ? (
        <Card>
          <SectionTitle icon="book" title="Recent comfort logs" />
          <div className="grid gap-2 sm:grid-cols-2">
            {logs.slice(0, 6).map((l) => (
              <div key={l.id} className="rounded-2xl border p-3 text-[12px]" style={{ borderColor: "var(--border)" }}>
                <p className="font-semibold">{prettyShort(l.day)}</p>
                <p className="muted mt-0.5">Pain {l.pain}/10 · {l.energy} energy · {l.mood}</p>
                {l.symptoms ? <p className="muted mt-0.5">{l.symptoms.split(",").join(" · ")}</p> : null}
                {l.note ? <p className="mt-1 leading-snug">{l.note}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Toast message={message} show={show} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl px-3 py-2.5" style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}>
      <p className="muted text-[10px] uppercase tracking-wide">{label}</p>
      <p className="display mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
