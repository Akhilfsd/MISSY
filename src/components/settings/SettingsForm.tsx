"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, Chip, Field, SectionTitle, Toast, useToast } from "@/components/ui";
import { apiFetch } from "@/lib/hooks";

type SettingsRow = {
  cycleLength: number;
  periodDuration: number;
  lastPeriodStart: string | null;
  remindersEnabled: boolean;
  reminderIntervalMinutes: number;
  quietStart: string;
  quietEnd: string;
  theme: string;
  reminderCategories: string;
  notifyBrowser: boolean;
};

type Reminder = { id: number; text: string; enabled: boolean };

const CATEGORY_OPTIONS = [
  { key: "water", label: "Water" },
  { key: "eyes", label: "Eye rest" },
  { key: "posture", label: "Posture" },
  { key: "breathe", label: "Breathe" },
  { key: "food", label: "Food" },
  { key: "rest", label: "Slow down" },
];

export default function SettingsForm({
  user,
  settings,
  reminders: initialReminders,
}: {
  user: { name: string; nickname: string; birthday: string; email: string };
  settings: SettingsRow;
  reminders: Reminder[];
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(user);
  const [s, setS] = useState(settings);
  const [cats, setCats] = useState<string[]>(settings.reminderCategories.split(",").filter(Boolean));
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [newReminder, setNewReminder] = useState("");
  const [busy, setBusy] = useState(false);
  const { message, show, toast } = useToast();

  async function save(patch: Record<string, unknown>, quiet = false) {
    setBusy(true);
    try {
      await apiFetch("/api/settings", { method: "PATCH", body: JSON.stringify(patch) });
      if (!quiet) toast("Saved");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  function toggleCat(key: string) {
    const next = cats.includes(key) ? cats.filter((c) => c !== key) : [...cats, key];
    setCats(next);
    void save({ reminderCategories: next }, true);
  }

  async function addReminder() {
    const text = newReminder.trim();
    if (!text) return;
    setNewReminder("");
    try {
      const data = await apiFetch<{ reminder: Reminder }>("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ text }),
      });
      setReminders([...reminders, data.reminder]);
      toast("Added your own gentle line.");
    } catch {
      toast("Couldn't add that.");
    }
  }

  async function removeReminder(id: number) {
    setReminders(reminders.filter((r) => r.id !== id));
    try {
      await apiFetch(`/api/settings?id=${id}`, { method: "DELETE" });
    } catch {
      toast("Couldn't remove that.");
    }
  }

  async function askNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast("This browser doesn't support notifications.");
      return;
    }
    const perm = await Notification.requestPermission();
    const granted = perm === "granted";
    setS({ ...s, notifyBrowser: granted });
    void save({ notifyBrowser: granted }, true);
    toast(granted ? "Notifications allowed." : "Staying quiet then.");
  }

  function setTheme(theme: string) {
    setS({ ...s, theme });
    document.documentElement.setAttribute("data-theme", theme);
    void save({ theme }, true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          icon="smile"
          title="About you"
          subtitle="This is how the app will greet you every morning."
          right={
            <div
              className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border sm:block"
              style={{ borderColor: "var(--border)", background: "var(--surface-sunk)" }}
              title="Profile"
            >
              <Image
                src="/images/girl-precious.jpg"
                alt="Profile portrait"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          }
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Name">
            <input className="soft-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </Field>
          <Field label="Nickname">
            <input className="soft-input" value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} />
          </Field>
          <Field label="Birthday">
            <input type="date" className="soft-input" value={profile.birthday} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} />
          </Field>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="muted text-[12px]">Signed in as {profile.email}</p>
          <button
            onClick={() => save({ name: profile.name, nickname: profile.nickname, birthday: profile.birthday })}
            disabled={busy}
            className="btn-primary disabled:opacity-60"
          >
            Save profile
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="moon" title="Comfort calendar" subtitle="Used only to make soft estimates — never medical advice." />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Cycle length (days)">
            <input type="number" min={20} max={45} className="soft-input" value={s.cycleLength}
              onChange={(e) => setS({ ...s, cycleLength: Number(e.target.value) })}
              onBlur={(e) => save({ cycleLength: Number(e.target.value) }, true)} />
          </Field>
          <Field label="Period duration (days)">
            <input type="number" min={1} max={12} className="soft-input" value={s.periodDuration}
              onChange={(e) => setS({ ...s, periodDuration: Number(e.target.value) })}
              onBlur={(e) => save({ periodDuration: Number(e.target.value) }, true)} />
          </Field>
          <Field label="Last period start">
            <input type="date" className="soft-input" value={s.lastPeriodStart ?? ""}
              onChange={(e) => { setS({ ...s, lastPeriodStart: e.target.value }); void save({ lastPeriodStart: e.target.value }, true); }} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="bell" title="Gentle reminders" subtitle="Soft nudges while the app is open. Never loud, never nagging." />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              className="accent-[#e96e97]"
              checked={s.remindersEnabled}
              onChange={(e) => { setS({ ...s, remindersEnabled: e.target.checked }); void save({ remindersEnabled: e.target.checked }, true); }}
            />
            Reminders on
          </label>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="muted">Every</span>
            <select
              className="soft-input w-auto"
              value={s.reminderIntervalMinutes}
              onChange={(e) => { setS({ ...s, reminderIntervalMinutes: Number(e.target.value) }); void save({ reminderIntervalMinutes: Number(e.target.value) }, true); }}
            >
              {[30, 60, 90, 120, 180, 240].map((m) => (
                <option key={m} value={m}>{m >= 60 ? `${m / 60} hour${m > 60 ? "s" : ""}` : `${m} minutes`}</option>
              ))}
            </select>
          </div>
          <button onClick={askNotifications} className="btn-ghost">
            {s.notifyBrowser ? "Browser notifications allowed" : "Allow browser notifications"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Quiet hours start">
            <input type="time" className="soft-input" value={s.quietStart}
              onChange={(e) => { setS({ ...s, quietStart: e.target.value }); void save({ quietStart: e.target.value }, true); }} />
          </Field>
          <Field label="Quiet hours end">
            <input type="time" className="soft-input" value={s.quietEnd}
              onChange={(e) => { setS({ ...s, quietEnd: e.target.value }); void save({ quietEnd: e.target.value }, true); }} />
          </Field>
        </div>

        <p className="muted mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wide">Reminder kinds</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => toggleCat(c.key)}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                cats.includes(c.key) ? "border-transparent bg-gradient-to-r from-blossom-100 to-lilac-100 font-semibold" : ""
              }`}
              style={cats.includes(c.key) ? undefined : { borderColor: "var(--border)" }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="muted mt-5 mb-2 text-[11px] font-semibold uppercase tracking-wide">Your own reminder lines</p>
        <div className="flex gap-2">
          <input
            className="soft-input"
            value={newReminder}
            placeholder="e.g. Step away from the screen for a minute."
            onChange={(e) => setNewReminder(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void addReminder(); }}
          />
          <button onClick={addReminder} className="btn-primary shrink-0">Add</button>
        </div>
        {reminders.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {reminders.map((r) => (
              <span key={r.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px]" style={{ borderColor: "var(--border)" }}>
                {r.text}
                <button onClick={() => removeReminder(r.id)} className="muted hover:text-blossom-500">×</button>
              </span>
            ))}
          </div>
        ) : (
          <p className="muted mt-2 text-[12px]">No custom lines yet — the built-in gentle ones are used.</p>
        )}
      </Card>

      <Card>
        <SectionTitle icon="sparkle" title="Look & feel" />
        <div className="flex flex-wrap gap-2">
          {[
            { key: "light", label: "Soft daylight" },
            { key: "dark", label: "Quiet night" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`rounded-2xl border px-4 py-2.5 text-[13px] transition-all ${
                s.theme === t.key ? "border-transparent bg-gradient-to-r from-blossom-100 to-lilac-100 font-semibold" : ""
              }`}
              style={s.theme === t.key ? undefined : { borderColor: "var(--border)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon="shield" title="Privacy" />
        <p className="muted text-[13px] leading-relaxed">
          Everything here — your journal, your moods, your cycle, your dreams — lives quietly in your own
          private space. Nothing is shown publicly and the pages are not indexed by search engines.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone="mint">private by design</Chip>
          <Chip tone="lilac">no public pages</Chip>
          <Chip tone="pink">yours only</Chip>
        </div>
      </Card>

      <Toast message={message} show={show} />
    </div>
  );
}
