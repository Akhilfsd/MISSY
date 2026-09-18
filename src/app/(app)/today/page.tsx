import { requireProfile } from "@/lib/auth";
import Hero from "@/components/home/Hero";
import ChecklistCard from "@/components/home/ChecklistCard";
import { PauseCard, TodaysReminder } from "@/components/home/ReminderCards";
import DailyPack from "@/components/home/DailyPack";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { user } = await requireProfile();
  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <Hero nickname={user.nickname} />
      <TodaysReminder />
      <DailyPack nickname={user.nickname} />
      <ChecklistCard manage />
      <PauseCard />
    </div>
  );
}
