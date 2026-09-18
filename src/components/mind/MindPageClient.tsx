"use client";

import { useState } from "react";
import CheckinCard from "@/components/home/CheckinCard";
import CheckinTimeline from "@/components/mind/CheckinTimeline";
import NotesSection, { type NoteRow } from "@/components/mind/NotesSection";

export default function MindPageClient({ notes }: { notes: NoteRow[] }) {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="space-y-4">
      <CheckinCard onSaved={() => setRefreshKey((k) => k + 1)} />
      <NotesSection initial={notes} />
      <CheckinTimeline refreshKey={refreshKey} />
    </div>
  );
}
