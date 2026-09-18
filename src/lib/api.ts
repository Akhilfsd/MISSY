import { NextResponse } from "next/server";
import { getProfile, type Profile } from "@/lib/auth";

export async function withUser<T>(
  handler: (profile: Profile) => Promise<T>,
): Promise<NextResponse> {
  try {
    const profile = await getProfile();
    const data = await handler(profile);
    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export function badRequest(message: string): never {
  throw new Error(message);
}

export function str(value: unknown, field: string, max = 400, required = true): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (required && !v) badRequest(`${field} is required.`);
  if (v.length > max) badRequest(`${field} is too long.`);
  return v;
}

export function num(value: unknown, field: string, min: number, max: number, fallback?: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    if (fallback !== undefined) return fallback;
    badRequest(`${field} must be a number.`);
  }
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function dayKey(value: unknown, field: string): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) badRequest(`${field} must be a valid date.`);
  return v;
}
