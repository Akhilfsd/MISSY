import Link from "next/link";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--surface-sunk)", color: "var(--text-faint)" }}><Icon name="flower" size={22} /></span>
      <h1 className="display text-2xl font-semibold">This little page doesn&apos;t exist</h1>
      <p className="muted max-w-sm text-sm leading-relaxed">
        Nothing is broken — it just isn&apos;t here. Let&apos;s go back somewhere calm.
      </p>
      <Link href="/" className="btn-primary mt-2">Back home</Link>
    </main>
  );
}
