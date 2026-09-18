import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "sun"
  | "cake"
  | "moon"
  | "mind"
  | "sprout"
  | "calendar"
  | "settings"
  | "gem"
  | "heart"
  | "droplet"
  | "eye"
  | "wind"
  | "bowl"
  | "leaf"
  | "posture"
  | "check"
  | "plus"
  | "edit"
  | "trash"
  | "close"
  | "bell"
  | "star"
  | "sparkle"
  | "clock"
  | "flower"
  | "book"
  | "mug"
  | "briefcase"
  | "stethoscope"
  | "repeat"
  | "target"
  | "map"
  | "gift"
  | "compass"
  | "mirror"
  | "cloud"
  | "smile"
  | "shield"
  | "chevronLeft"
  | "chevronRight"
  | "arrowRight"
  | "pray"
  | "bed"
  | "walk"
  | "pad"
  | "sunrise"
  | "sunset";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

const PATHS: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 10.2 12 3.5l9 6.7" /><path d="M5.5 9.3V20a.8.8 0 0 0 .8.8h3.4v-5.2h4.6v5.2h3.4a.8.8 0 0 0 .8-.8V9.3" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" /></>,
  cake: <><path d="M4 20.5h16" /><path d="M5 20.5v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" /><path d="M5 16.2c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4" /><path d="M12 12.5V9.2" /><path d="M12 6.2c.9.7.9 1.9 0 2.6-.9-.7-.9-1.9 0-2.6Z" /></>,
  moon: <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />,
  mind: <><path d="M9.5 20.5v-2.2a5.6 5.6 0 0 1-3.2-4.1A4 4 0 0 1 5 7.4a3.6 3.6 0 0 1 3.1-3.6 3.4 3.4 0 0 1 6.3 0 3.6 3.6 0 0 1 3.1 3.6 4 4 0 0 1-1.3 6.8 5.6 5.6 0 0 1-3.2 4.1v2.2" /><path d="M9.5 20.5h5" /></>,
  sprout: <><path d="M12 20.5v-7.2" /><path d="M12 13.3C12 9.8 9.4 7.5 6 7.5c0 3.5 2.6 5.8 6 5.8Z" /><path d="M12.4 13.3c0-3 2.2-5 5.1-5 0 3-2.2 5-5.1 5Z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.2" /><path d="M3.5 9.8h17M8.5 3.5v3M15.5 3.5v3" /><circle cx="8.6" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" /></>,
  settings: <><circle cx="12" cy="12" r="2.9" /><path d="M19.2 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.5 1v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-2.6-1l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0-1-2.5h-.2a1.8 1.8 0 0 1 0-3.6h.1a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 2.5 1l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1 2.5h.2a1.8 1.8 0 0 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9Z" /></>,
  gem: <><path d="M6.2 3.8h11.6l3.2 5-9 11.4L3 8.8Z" /><path d="M3 8.8h18M8.6 8.8 12 20.2l3.4-11.4M6.2 3.8 8.6 8.8M17.8 3.8 15.4 8.8" /></>,
  heart: <path d="M12 20.3S3.8 15.6 3.8 9.9a4.4 4.4 0 0 1 8.2-2.3 4.4 4.4 0 0 1 8.2 2.3c0 5.7-8.2 10.4-8.2 10.4Z" />,
  droplet: <path d="M12 3.2s5.8 5.7 5.8 9.5a5.8 5.8 0 1 1-11.6 0C6.2 8.9 12 3.2 12 3.2Z" />,
  eye: <><path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></>,
  wind: <><path d="M3.5 8.5h9.2a2.6 2.6 0 1 0-2.6-2.6" /><path d="M3.5 12.5h13a2.6 2.6 0 1 1-2.6 2.6" /><path d="M3.5 16.5h6" /></>,
  bowl: <><path d="M3.2 11.2h17.6a8.8 8.8 0 0 1-8.8 8.2 8.8 8.8 0 0 1-8.8-8.2Z" /><path d="M8.5 7.8c0-1 .8-1.4.8-2.3S8.5 4 8.5 4M12 7.8c0-1 .8-1.4.8-2.3S12 4 12 4M15.5 7.8c0-1 .8-1.4.8-2.3S15.5 4 15.5 4" /></>,
  leaf: <><path d="M4.5 19.5c-1.5-5 1-13 14.5-15 1 7-3 16-11 16a5.4 5.4 0 0 1-3.5-1Z" /><path d="M8 16c1.5-4 4.5-7 8-8.5" /></>,
  posture: <><circle cx="12" cy="5" r="2.2" /><path d="M12 7.5v6M12 13.5 8.8 20M12 13.5 15.2 20M8.5 10h7" /></>,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M16.5 3.9a2 2 0 0 1 2.8 2.8L8.4 17.6l-3.7.9.9-3.7Z" /><path d="m14.8 5.6 3.1 3.1" /></>,
  trash: <><path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" /><path d="M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bell: <><path d="M18 9a6 6 0 1 0-12 0c0 5.2-2 6.8-2 6.8h16S18 14.2 18 9Z" /><path d="M13.7 19.2a2 2 0 0 1-3.4 0" /></>,
  star: <path d="m12 3.6 2.6 5.5 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.9l5.9-.8Z" />,
  sparkle: <><path d="m12 3.5 1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6-4.6-1.7 4.6-1.7Z" /><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" /></>,
  clock: <><circle cx="12" cy="12" r="8.6" /><path d="M12 7.2V12l3.2 1.9" /></>,
  flower: <><circle cx="12" cy="12" r="2.4" /><path d="M12 9.6c0-2.6.9-4.4 2.4-4.4S16.4 7 14.8 9.6M14.4 12c2.6 0 4.4.9 4.4 2.4S17 16.4 14.4 14.8M12 14.4c0 2.6-.9 4.4-2.4 4.4S7.6 17 9.2 14.4M9.6 12c-2.6 0-4.4-.9-4.4-2.4S7 7.6 9.6 9.2" /></>,
  book: <><path d="M4.5 4.8A1.8 1.8 0 0 1 6.3 3H19v15.5H6.3a1.8 1.8 0 0 0-1.8 1.8Z" /><path d="M4.5 18.5A1.8 1.8 0 0 1 6.3 16.7H19" /></>,
  mug: <><path d="M4.5 8.5h11v6.8a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4Z" /><path d="M15.5 10.2h1.8a2.6 2.6 0 0 1 0 5.2h-1.8" /><path d="M7 5.5c.8-.8-.5-1.6 0-2.5M11 5.5c.8-.8-.5-1.6 0-2.5" /></>,
  briefcase: <><rect x="3" y="7.2" width="18" height="12.5" rx="2" /><path d="M8.8 7.2V5.6a1.6 1.6 0 0 1 1.6-1.6h3.2a1.6 1.6 0 0 1 1.6 1.6v1.6M3 12.5h18" /></>,
  stethoscope: <><path d="M6 3.5v4.2a4 4 0 0 0 8 0V3.5" /><path d="M4.4 3.5h1.9M13.7 3.5h1.9" /><path d="M10 11.8v2.4a4.4 4.4 0 0 0 8.8 0v-1.3" /><circle cx="18.8" cy="10.8" r="2" /></>,
  repeat: <><path d="M4 9.5A4.5 4.5 0 0 1 8.5 5H18" /><path d="m15.5 2.5 3 2.5-3 2.5" /><path d="M20 14.5A4.5 4.5 0 0 1 15.5 19H6" /><path d="m8.5 21.5-3-2.5 3-2.5" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
  map: <><path d="m3.5 6.5 5.5-2.5 6 2.5 5.5-2.5v13.5L15 20l-6-2.5L3.5 20Z" /><path d="M9 4v13.5M15 6.5V20" /></>,
  gift: <><rect x="3.5" y="8.5" width="17" height="4.2" rx="1" /><path d="M5.2 12.7v6.2a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6v-6.2M12 8.5v12" /><path d="M12 8.5S10.8 4 8.6 4a2.2 2.2 0 0 0 0 4.5ZM12 8.5S13.2 4 15.4 4a2.2 2.2 0 0 1 0 4.5Z" /></>,
  compass: <><circle cx="12" cy="12" r="8.6" /><path d="m15.2 8.8-1.7 4.7-4.7 1.7 1.7-4.7Z" /></>,
  mirror: <><ellipse cx="12" cy="9.5" rx="6" ry="6.5" /><path d="M12 16v4.5M9 20.5h6" /></>,
  cloud: <path d="M7 18.5a4.2 4.2 0 0 1-.5-8.4 5.8 5.8 0 0 1 11-1.6 4 4 0 0 1 .3 8 Z" />,
  smile: <><circle cx="12" cy="12" r="8.6" /><path d="M8.6 14a4 4 0 0 0 6.8 0" /><circle cx="9.4" cy="9.8" r=".9" fill="currentColor" stroke="none" /><circle cx="14.6" cy="9.8" r=".9" fill="currentColor" stroke="none" /></>,
  shield: <><path d="M12 3.2 5 5.8v5.6c0 4.2 2.9 7.6 7 9.4 4.1-1.8 7-5.2 7-9.4V5.8Z" /><path d="m9.2 12 2 2 3.6-3.8" /></>,
  chevronLeft: <path d="m14.5 5.5-6 6.5 6 6.5" />,
  chevronRight: <path d="m9.5 5.5 6 6.5-6 6.5" />,
  arrowRight: <><path d="M4 12h15" /><path d="m13.5 6.5 5.5 5.5-5.5 5.5" /></>,
  pray: <><path d="M9.5 3.5v7.2a2 2 0 0 0 .6 1.4l2 2 2-2a2 2 0 0 0 .6-1.4V3.5" /><path d="M12 14.1v6.4M7.5 20.5h9" /></>,
  bed: <><path d="M3 19.5v-11M3 13.5h18v6M21 19.5v-4" /><path d="M7.2 13.5v-2.2a1.4 1.4 0 0 1 1.4-1.4h8.8a3.6 3.6 0 0 1 3.6 3.6" /><circle cx="7.2" cy="10.4" r="1.9" /></>,
  walk: <><circle cx="13" cy="4.4" r="1.9" /><path d="m10 20.5 2-5.4-2.2-2.2.8-4.3 3 1.6 1.8 2.6" /><path d="m12 15.1 2.6 2.1 1.2 3.3M9.6 8.6 7 10.4" /></>,
  pad: <><rect x="6" y="3.5" width="12" height="17" rx="4" /><path d="M6 8.2h12M6 15.8h12" /></>,
  sunrise: <><path d="M12 3.5v4M5.6 6.6l1.4 1.4M17 8l1.4-1.4M2.5 16h19M4.5 20h15" /><path d="M7.8 16a4.2 4.2 0 0 1 8.4 0" /></>,
  sunset: <><path d="M12 8V3.5M5.6 6.6 7 8M17 8l1.4-1.4M2.5 16h19M4.5 20h15" /><path d="M7.8 16a4.2 4.2 0 0 1 8.4 0" /></>,
};

export function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export default Icon;
