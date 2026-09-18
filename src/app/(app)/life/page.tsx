import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { capabilities, goals } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import GoalsSection from "@/components/life/GoalsSection";
import CapabilitiesSection from "@/components/life/CapabilitiesSection";

export const dynamic = "force-dynamic";

export default async function LifePage() {
  const { user } = await requireProfile();
  const [goalRows, capRows] = await Promise.all([
    db.select().from(goals).where(eq(goals.userId, user.id)).orderBy(desc(goals.createdAt)),
    db.select().from(capabilities).where(eq(capabilities.userId, user.id)).orderBy(desc(capabilities.createdAt)),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Your little future"
        title="Life & Goals"
        description={`Small steps, quiet wishes and the proof of who you already are, ${user.nickname}.`}
      />
      <CapabilitiesSection
        initial={capRows.map((c) => ({ id: c.id, text: c.text, category: c.category }))}
      />
      <GoalsSection
        initial={goalRows.map((g) => ({
          id: g.id,
          category: g.category,
          title: g.title,
          description: g.description,
          progress: g.progress,
          done: g.done,
        }))}
      />
    </div>
  );
}
