import Image from "next/image";

export type ArtScene =
  | "evening"
  | "morning"
  | "rest"
  | "birthday"
  | "teddy"
  | "dairymilk"
  | "precious";

const SCENE_MAP: Record<ArtScene, { src: string; alt: string }> = {
  evening: {
    src: "/images/girl-cozy-evening.jpg",
    alt: "Young woman cozy on couch with warm tea at sunset",
  },
  morning: {
    src: "/images/girl-morning.jpg",
    alt: "Young woman peacefully enjoying morning light with fresh water",
  },
  rest: {
    src: "/images/girl-rest.jpg",
    alt: "Young woman resting peacefully under a warm duvet with hot water bottle",
  },
  birthday: {
    src: "/images/girl-birthday.jpg",
    alt: "Cozy celebration with a birthday cake and glowing candle",
  },
  teddy: {
    src: "/images/teddy-comfort.jpg",
    alt: "Vintage soft teddy bear with a warm cup on a knitted blanket",
  },
  dairymilk: {
    src: "/images/dairy-milk.jpg",
    alt: "Cadbury Dairy Milk chocolate and warm cocoa on cozy blanket",
  },
  precious: {
    src: "/images/girl-precious.jpg",
    alt: "Warm portrait of woman smiling peacefully with chin in hands",
  },
};

export function ArtPortrait({
  scene,
  size = 96,
  rounded = "rounded-[16px]",
  className = "",
  aspect = "aspect-square",
}: {
  scene: ArtScene;
  size?: number;
  rounded?: string;
  className?: string;
  aspect?: string;
}) {
  const item = SCENE_MAP[scene] || SCENE_MAP.evening;
  return (
    <div
      className={`relative overflow-hidden border shadow-sm ${rounded} ${aspect} ${className}`}
      style={{
        width: size,
        minWidth: size,
        borderColor: "var(--border)",
        background: "var(--surface-sunk)",
      }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={`${size}px`}
        className="object-cover transition-transform duration-700 hover:scale-105"
        priority={scene === "morning" || scene === "evening"}
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5"
        style={{ borderRadius: "inherit" }}
      />
    </div>
  );
}

export default ArtPortrait;
