import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import AgeCard from "@/components/home/AgeCard";
import BirthdayWish from "@/components/home/BirthdayWish";
import BirthdayExtras from "@/components/home/BirthdayExtras";
import BirthdayPiano from "@/components/birthday/BirthdayPiano";

export const dynamic = "force-dynamic";

export default async function BirthdayPage() {
  const { user } = await requireProfile();
  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-6">
      <PageHeader
        eyebrow="Your timeline"
        title={`Your journey, ${user.nickname}`}
        description="Every second here is one you actually lived. That is not a small thing."
      />
      <BirthdayPiano nickname={user.nickname} />
      <BirthdayWish birthday={user.birthday} nickname={user.nickname} />
      <AgeCard birthday={user.birthday} nickname={user.nickname} compact />
      <BirthdayExtras birthday={user.birthday} nickname={user.nickname} />
    </div>
  );
}
