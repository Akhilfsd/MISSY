import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import MindPageClient from "@/components/mind/MindPageClient";

export const dynamic = "force-dynamic";

export default async function MindPage() {
  const { user } = await requireProfile();
  const noteRows = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.createdAt));

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Private to you"
        title={`Your mind, ${user.nickname}`}
        description="A private place to say how you actually are — not how you're supposed to be."
      />
      <MindPageClient
        notes={noteRows.map((n) => ({ id: n.id, category: n.category, body: n.body, author: n.author }))}
      />
    </div>
  );
}
