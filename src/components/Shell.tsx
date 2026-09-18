"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/today", label: "Today", icon: "sun" },
  { href: "/values", label: "Your Worth", icon: "gem" },
  { href: "/birthday", label: "Birthday", icon: "cake" },
  { href: "/comfort", label: "Comfort", icon: "moon" },
  { href: "/mind", label: "Mind", icon: "mind" },
  { href: "/life", label: "Life & Goals", icon: "sprout" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const MOBILE_NAV = NAV.filter((n) =>
  ["/", "/values", "/comfort", "/mind", "/life"].includes(n.href),
);

export default function Shell({
  children,
  nickname,
  name,
  initialTheme,
}: {
  children: ReactNode;
  nickname: string;
  name: string;
  initialTheme: string;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    void fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
      {/* Sidebar — tablet & desktop */}
      <aside
        className="sticky top-0 hidden h-screen w-[74px] shrink-0 flex-col gap-1 border-r px-2.5 py-5 md:flex xl:w-[244px] xl:px-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="mb-5 flex items-center gap-2.5 px-1 xl:px-1.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white"
            style={{ background: "var(--accent)" }}
          >
            <Icon name="flower" size={18} strokeWidth={1.7} />
          </div>
          <div className="hidden min-w-0 xl:block">
            <p className="display truncate text-[15px] font-semibold leading-tight">Pgl</p>
            <p className="faint truncate text-[11px]">A little reminder of you</p>
          </div>
        </div>

        <nav className="flex w-full flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className="group relative flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] transition-colors"
                style={{
                  background: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-soft)",
                  fontWeight: active ? 570 : 480,
                }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <Icon name={item.icon} size={18} strokeWidth={active ? 1.85 : 1.6} />
                </span>
                <span className="hidden truncate xl:inline">{item.label}</span>
                {active ? (
                  <span
                    className="absolute -left-2.5 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full"
                    style={{ background: "var(--accent)" }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex w-full flex-col gap-2">
          <div
            className="hidden items-center gap-2.5 rounded-[12px] border p-2.5 xl:flex"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              {name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold leading-tight">{name}</p>
              <p className="faint truncate text-[11px]">“{nickname}”</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 rounded-[10px] border px-2.5 py-2 text-[12.5px] transition-colors xl:justify-start"
            style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
            <span className="hidden xl:inline">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1 pb-24 md:pb-8">
        {/* Mobile header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur-xl md:hidden"
          style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surface) 88%, transparent)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
              style={{ background: "var(--accent)" }}
            >
              <Icon name="flower" size={15} strokeWidth={1.8} />
            </div>
            <span className="display text-[15px] font-semibold">Pgl</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/birthday" className="rounded-lg p-2 transition-colors" style={{ color: "var(--text-soft)" }} title="Birthday">
              <Icon name="cake" size={18} />
            </Link>
            <Link href="/calendar" className="rounded-lg p-2 transition-colors" style={{ color: "var(--text-soft)" }} title="Calendar">
              <Icon name="calendar" size={18} />
            </Link>
            <button onClick={toggleTheme} className="rounded-lg p-2" style={{ color: "var(--text-soft)" }} title="Theme">
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
          </div>
        </header>

        <main className="px-4 pb-6 pt-4 sm:px-6 md:px-8 md:pt-7">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl md:hidden"
        style={{ background: "color-mix(in srgb, var(--surface) 94%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {[...MOBILE_NAV, { href: "/settings", label: "Settings", icon: "settings" as IconName }].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-w-[56px] flex-col items-center gap-1 rounded-[10px] px-1.5 py-1.5 transition-colors"
                style={{ color: active ? "var(--accent)" : "var(--text-faint)" }}
              >
                <Icon name={item.icon} size={19} strokeWidth={active ? 1.9 : 1.6} />
                <span className="text-[10px]" style={{ fontWeight: active ? 600 : 500 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
