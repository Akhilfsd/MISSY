"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

export function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={`card animate-fade-up p-5 sm:p-6 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  icon,
  title,
  subtitle,
  right,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="icon-tile mt-0.5" style={{ color: "var(--accent)" }}>
            <Icon name={icon} size={17} />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="display text-[16.5px] font-semibold leading-snug sm:text-[18px]">{title}</h2>
          {subtitle ? <p className="muted mt-1 text-[12.5px] leading-relaxed">{subtitle}</p> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="animate-fade-up mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h1 className="display text-[24px] font-semibold leading-tight sm:text-[30px]">{title}</h1>
        {description ? (
          <p className="muted mt-2 max-w-xl text-[13.5px] leading-relaxed">{description}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function EmptyState({
  icon = "flower",
  title,
  hint,
  action,
}: {
  icon?: IconName;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-[14px] border border-dashed px-6 py-9 text-center"
      style={{ borderColor: "var(--border-strong)" }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: "var(--surface-sunk)", color: "var(--text-faint)" }}
      >
        <Icon name={icon} size={20} />
      </span>
      <p className="display text-[15px] font-semibold">{title}</p>
      {hint ? <p className="muted max-w-xs text-[12.5px] leading-relaxed">{hint}</p> : null}
      {action ? <div className="mt-1.5">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-[12px] ${className}`} />;
}

export function ProgressRing({
  value,
  size = 84,
  stroke = 7,
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const id = `ring-${size}-${Math.round(pct)}`;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="#a294ca" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-sunk)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="display text-[15px] font-semibold tabular-nums">{label ?? `${Math.round(pct)}%`}</span>
        {sub ? <span className="faint mt-0.5 text-[9.5px] uppercase tracking-wide">{sub}</span> : null}
      </div>
    </div>
  );
}

const TONES: Record<string, { bg: string; fg: string }> = {
  blush: { bg: "var(--color-blossom-100)", fg: "var(--color-blossom-500)" },
  rose: { bg: "var(--color-blossom-100)", fg: "var(--color-blossom-500)" },
  lilac: { bg: "var(--color-lilac-100)", fg: "var(--color-lilac-500)" },
  sky: { bg: "var(--color-sky-100)", fg: "var(--color-sky-500)" },
  mint: { bg: "var(--color-mint-100)", fg: "#4b8268" },
  peach: { bg: "var(--color-peach-100)", fg: "#b5713f" },
  sand: { bg: "var(--color-sand-100)", fg: "#96743f" },
  neutral: { bg: "var(--surface-sunk)", fg: "var(--text-soft)" },
};

export type Tone = keyof typeof TONES;

export function Chip({
  children,
  tone = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: IconName;
  className?: string;
}) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span className={`chip ${className}`} style={{ background: t.bg, color: t.fg }}>
      {icon ? <Icon name={icon} size={11} strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

export function toneStyles(tone: Tone) {
  return TONES[tone] ?? TONES.neutral;
}

export function Toast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 sm:bottom-7">
      <div
        className="animate-pop flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium text-white shadow-lg"
        style={{ background: "var(--text)" }}
      >
        <Icon name="check" size={14} strokeWidth={2.4} />
        {message}
      </div>
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function toast(text: string) {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2300);
  }
  return { message, show: Boolean(message), toast };
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="card animate-pop max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-b-none p-5 sm:rounded-[18px] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="display text-[17px] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:opacity-70"
            style={{ color: "var(--text-faint)" }}
            aria-label="Close"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-semibold" style={{ color: "var(--text-soft)" }}>
        {label}
      </span>
      {children}
      {hint ? <span className="faint mt-1 block text-[11px]">{hint}</span> : null}
    </label>
  );
}

export function Tip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1 inline-flex cursor-help items-center align-middle">
      <span
        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold"
        style={{ background: "var(--surface-sunk)", color: "var(--text-faint)" }}
      >
        ?
      </span>
      <span
        className="card pointer-events-none absolute bottom-6 left-1/2 z-30 w-52 -translate-x-1/2 p-2.5 text-[11.5px] font-normal leading-snug opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: "var(--text-soft)" }}
      >
        {text}
      </span>
    </span>
  );
}

export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-flat px-2.5 py-2.5 text-center">
      <p className="display text-[17px] font-semibold tabular-nums leading-none sm:text-[19px]">{value}</p>
      <p className="faint mt-1.5 text-[9.5px] font-medium uppercase tracking-[0.07em]">{label}</p>
    </div>
  );
}

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-all"
      style={{
        borderColor: checked ? "var(--accent)" : "var(--border-strong)",
        background: checked ? "var(--accent)" : "transparent",
        color: "#fff",
      }}
    >
      {checked ? <Icon name="check" size={11} strokeWidth={3} /> : null}
    </span>
  );
}
