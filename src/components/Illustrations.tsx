import type { ReactNode } from "react";

export type Pose =
  | "smile"
  | "water"
  | "sleep"
  | "study"
  | "work"
  | "rest"
  | "eat"
  | "tea"
  | "calendar"
  | "period"
  | "dream"
  | "breathe"
  | "birthday";

const SKIN = "#f7d7c4";
const SKIN_SHADE = "#efc3ab";
const HAIR = "#4b3a49";
const HAIR_LIGHT = "#5e4a5d";
const DRESS: Record<string, string> = {
  smile: "#f9b8cf",
  water: "#bcd9f7",
  sleep: "#cdbdf4",
  study: "#f9d3b0",
  work: "#b9e4d2",
  rest: "#f6c6d8",
  eat: "#fcd7a8",
  tea: "#d7c6f6",
  calendar: "#bfe0f7",
  period: "#f7b6c6",
  dream: "#cfc4f7",
  breathe: "#c7e8de",
  birthday: "#f9c0d8",
};

function Face({ eyes = "happy" }: { eyes?: "happy" | "closed" | "dot" | "sparkle" }) {
  return (
    <g>
      {/* hair back */}
      <path d="M22 30c0-13 8-22 20-22s20 9 20 22c0 6-1 10-2 13-1-8-5-12-7-13-4 2-9 3-13 3-6 0-11-1-15-3-2 2-3 6-3 13-1-4 0-9 0-13z" fill={HAIR} />
      {/* bun */}
      <circle cx="42" cy="6" r="6" fill={HAIR_LIGHT} />
      {/* face */}
      <ellipse cx="42" cy="34" rx="16" ry="17" fill={SKIN} />
      {/* fringe */}
      <path d="M26 30c1-11 8-17 16-17s15 6 16 17c-3-6-8-9-12-8-2 3-6 5-11 5-4 0-7 1-9 3z" fill={HAIR} />
      {/* blush */}
      <ellipse cx="31" cy="38" rx="4" ry="2.6" fill="#f7a6bd" opacity="0.55" />
      <ellipse cx="53" cy="38" rx="4" ry="2.6" fill="#f7a6bd" opacity="0.55" />
      {/* eyes */}
      {eyes === "closed" ? (
        <>
          <path d="M31 33q3 3 6 0" stroke="#3d2f3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M47 33q3 3 6 0" stroke="#3d2f3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      ) : eyes === "dot" ? (
        <>
          <circle cx="34" cy="33" r="1.8" fill="#3d2f3d" />
          <circle cx="50" cy="33" r="1.8" fill="#3d2f3d" />
        </>
      ) : eyes === "sparkle" ? (
        <>
          <circle cx="34" cy="33" r="2.6" fill="#3d2f3d" />
          <circle cx="50" cy="33" r="2.6" fill="#3d2f3d" />
          <circle cx="35" cy="32" r="0.9" fill="#fff" />
          <circle cx="51" cy="32" r="0.9" fill="#fff" />
          <path d="M28 27l1.2 2.4 2.4 1.2-2.4 1.2L28 34l-1.2-2.2-2.4-1.2 2.4-1.2z" fill="#ffd7ea" />
        </>
      ) : (
        <>
          <circle cx="34" cy="33" r="2.4" fill="#3d2f3d" />
          <circle cx="50" cy="33" r="2.4" fill="#3d2f3d" />
          <circle cx="34.8" cy="32.2" r="0.8" fill="#fff" />
          <circle cx="50.8" cy="32.2" r="0.8" fill="#fff" />
        </>
      )}
      {/* mouth */}
      <path d="M39 41q3 3 6 0" stroke="#b4677f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* flower clip */}
      <g>
        <circle cx="59" cy="24" r="2.1" fill="#ffd0e0" />
        <circle cx="62.4" cy="25.4" r="2.1" fill="#ffe0ec" />
        <circle cx="60.6" cy="28.4" r="2.1" fill="#ffd0e0" />
        <circle cx="60.7" cy="25.9" r="1.1" fill="#ffb8a0" />
      </g>
    </g>
  );
}

function Body({ color, arms = "down" }: { color: string; arms?: "down" | "up" | "hold" | "hug" }) {
  return (
    <g>
      <path d="M42 50c-10 0-17 7-19 20-1 6-1 10-1 12h40c0-2 0-6-1-12-2-13-9-20-19-20z" fill={color} />
      <path d="M42 50c-4 0-7 1-10 3 3 3 6 4 10 4s7-1 10-4c-3-2-6-3-10-3z" fill="#fff" opacity="0.45" />
      {arms === "down" && (
        <>
          <path d="M25 60c-4 5-6 11-6 15" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M59 60c4 5 6 11 6 15" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {arms === "up" && (
        <>
          <path d="M25 60c-6 0-10-5-11-10" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M59 60c6 0 10-5 11-10" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {arms === "hold" && (
        <>
          <path d="M26 61c-2 6 2 10 7 11" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M58 61c2 6-2 10-7 11" stroke={SKIN} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {arms === "hug" && (
        <>
          <path d="M27 62c0 7 6 11 15 11s15-4 15-11" stroke={SKIN_SHADE} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  );
}

function Deco() {
  return (
    <g opacity="0.75">
      <circle cx="12" cy="18" r="1.6" fill="#ffc6dd" className="animate-twinkle" />
      <circle cx="74" cy="46" r="1.4" fill="#cbbcff" className="animate-twinkle" />
      <path d="M70 14l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="#ffd9a8" />
    </g>
  );
}

export function CuteGirl({ pose = "smile", size = 96, className = "" }: { pose?: Pose; size?: number; className?: string }) {
  const color = DRESS[pose] ?? DRESS.smile;
  let extras: ReactNode = null;
  let eyes: "happy" | "closed" | "dot" | "sparkle" = "happy";
  let arms: "down" | "up" | "hold" | "hug" = "down";

  switch (pose) {
    case "water":
      arms = "hold";
      extras = (
        <g>
          <path d="M33 66h12l-1.6 14a2 2 0 0 1-2 1.8h-4.8a2 2 0 0 1-2-1.8z" fill="#e8f4ff" stroke="#a9cdf0" strokeWidth="1.2" />
          <path d="M34 72h10l-1 8h-8z" fill="#8fc6f2" opacity="0.8" />
          <circle cx="39" cy="62" r="1.6" fill="#a9cdf0" className="animate-twinkle" />
        </g>
      );
      break;
    case "sleep":
      eyes = "closed";
      arms = "hug";
      extras = (
        <g>
          <path d="M14 70h56c3 0 5 2 5 5v8H9v-8c0-3 2-5 5-5z" fill="#e7dcff" />
          <text x="60" y="20" fontSize="10" fill="#b6a7d8" fontFamily="serif">z</text>
          <text x="66" y="12" fontSize="7" fill="#c8bce8" fontFamily="serif">z</text>
        </g>
      );
      break;
    case "study":
      eyes = "dot";
      arms = "hold";
      extras = (
        <g>
          <path d="M28 70h28v12H28z" fill="#fff3e2" stroke="#e8c9a3" strokeWidth="1.2" />
          <path d="M42 70v12" stroke="#e8c9a3" strokeWidth="1.2" />
          <path d="M32 74h8M46 74h6" stroke="#dcb896" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
      break;
    case "work":
      eyes = "dot";
      arms = "hold";
      extras = (
        <g>
          <rect x="27" y="68" width="30" height="16" rx="2.5" fill="#dff1ea" stroke="#9fd0bd" strokeWidth="1.2" />
          <rect x="31" y="72" width="22" height="8" rx="1.5" fill="#fff" opacity="0.8" />
        </g>
      );
      break;
    case "rest":
      eyes = "closed";
      arms = "hug";
      extras = (
        <g>
          <ellipse cx="42" cy="84" rx="30" ry="6" fill="#f6dbe6" opacity="0.7" />
          <path d="M66 58c4 0 7 3 7 6s-3 6-7 6" fill="#ffe0ec" />
        </g>
      );
      break;
    case "eat":
      arms = "hold";
      extras = (
        <g>
          <ellipse cx="42" cy="76" rx="14" ry="5" fill="#fff5e6" stroke="#eccfa5" strokeWidth="1.2" />
          <path d="M36 74q6-5 12 0" fill="#ffd3a1" />
        </g>
      );
      break;
    case "tea":
      eyes = "closed";
      arms = "hold";
      extras = (
        <g>
          <path d="M34 70h14v8a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4z" fill="#fff" stroke="#c9b6ee" strokeWidth="1.3" />
          <path d="M48 72h3a3 3 0 0 1 0 6h-3" fill="none" stroke="#c9b6ee" strokeWidth="1.3" />
          <path d="M38 65c2-2-2-4 0-6M43 65c2-2-2-4 0-6" stroke="#dcd0f2" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "calendar":
      arms = "hold";
      extras = (
        <g>
          <rect x="28" y="66" width="28" height="20" rx="3" fill="#fff" stroke="#9fc8ee" strokeWidth="1.3" />
          <path d="M28 72h28" stroke="#9fc8ee" strokeWidth="1.3" />
          <circle cx="36" cy="78" r="2" fill="#f9a8c4" />
          <circle cx="44" cy="78" r="2" fill="#cbbcff" />
        </g>
      );
      break;
    case "period":
      eyes = "closed";
      arms = "hug";
      extras = (
        <g>
          <ellipse cx="42" cy="70" rx="11" ry="7" fill="#ffd8e3" />
          <path d="M36 70q6-6 12 0" stroke="#f79fb8" strokeWidth="1.4" fill="none" />
          <path d="M70 34c0 5-4 9-9 9 2-2 3-5 3-9s-1-7-3-9c5 0 9 4 9 9z" fill="#ffe7b8" />
        </g>
      );
      break;
    case "dream":
      eyes = "sparkle";
      arms = "up";
      extras = (
        <g>
          <path d="M16 20c3 0 5-2 5-5s2-5 5-5" stroke="#e3d6ff" strokeWidth="1.4" fill="none" />
          <circle cx="16" cy="44" r="2" fill="#ffd0e0" className="animate-twinkle" />
          <path d="M68 60l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4z" fill="#ffe0b8" />
        </g>
      );
      break;
    case "breathe":
      eyes = "closed";
      arms = "up";
      extras = (
        <g>
          <circle cx="42" cy="34" r="27" fill="none" stroke="#bfe3d6" strokeWidth="1.2" opacity="0.8" className="animate-twinkle" />
          <circle cx="16" cy="60" r="2.2" fill="#cfeee2" />
        </g>
      );
      break;
    case "birthday":
      eyes = "sparkle";
      arms = "hold";
      extras = (
        <g>
          <rect x="29" y="70" width="26" height="14" rx="3" fill="#fff0f6" stroke="#f3aecb" strokeWidth="1.3" />
          <rect x="29" y="76" width="26" height="8" fill="#ffd9e8" />
          <path d="M42 62v8" stroke="#f9c0d8" strokeWidth="2" />
          <path d="M42 56c2 2 2 5 0 6-2-1-2-4 0-6z" fill="#ffc06a" />
          <path d="M10 22l1.6 3.4 3.4 1.6-3.4 1.6L10 32l-1.6-3.4L5 27l3.4-1.6z" fill="#ffd0e0" />
        </g>
      );
      break;
    default:
      extras = null;
  }

  return (
    <svg viewBox="0 0 84 90" width={size} height={size} className={className} role="img" aria-hidden="true">
      <Deco />
      <Body color={color} arms={arms} />
      <Face eyes={eyes} />
      {extras}
    </svg>
  );
}

export function Flower({ className = "", size = 20, color = "#ffd0e0" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="6" r="4" fill={color} />
      <circle cx="18" cy="12" r="4" fill={color} />
      <circle cx="12" cy="18" r="4" fill={color} />
      <circle cx="6" cy="12" r="4" fill={color} />
      <circle cx="12" cy="12" r="3" fill="#ffd8a8" />
    </svg>
  );
}

export function Cloud({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 32" width={size} height={size / 2} className={className} aria-hidden="true">
      <path d="M14 26a9 9 0 0 1 1-18 12 12 0 0 1 22-3 10 10 0 0 1 14 12 7 7 0 0 1-3 9z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function Star({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="currentColor" />
    </svg>
  );
}

export function Butterfly({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 24" width={size} height={size * 0.75} className={className} aria-hidden="true">
      <path d="M16 12C13 4 6 2 4 6s2 10 12 6z" fill="#ffc6dd" />
      <path d="M16 12c3-8 10-10 12-6s-2 10-12 6z" fill="#cbbcff" />
      <rect x="15.2" y="6" width="1.6" height="12" rx="0.8" fill="#6d5a70" />
    </svg>
  );
}

export function SoftDivider() {
  return (
    <div className="flex items-center gap-3 py-1 opacity-60">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blossom-200 to-transparent" />
      <Flower size={14} />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-lilac-200 to-transparent" />
    </div>
  );
}
