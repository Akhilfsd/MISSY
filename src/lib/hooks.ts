"use client";

import { useEffect, useState } from "react";
import { toDayKey } from "@/lib/dates";

/** Ticking clock, mount-safe (null until hydrated to avoid SSR mismatch). */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

/** Local day key (YYYY-MM-DD), null until mounted. */
export function useDayKey(): string | null {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    setKey(toDayKey(new Date()));
    const t = window.setInterval(() => setKey(toDayKey(new Date())), 60000);
    return () => window.clearInterval(t);
  }, []);
  return key;
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
