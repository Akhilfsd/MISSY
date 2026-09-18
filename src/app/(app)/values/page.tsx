import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import ValueBoard from "@/components/values/ValueBoard";

export const dynamic = "force-dynamic";

export default async function ValuesPage() {
  const { user } = await requireProfile();
  return (
    <div className="mx-auto max-w-6xl pb-6">
      <PageHeader
        eyebrow="Just a little reminder"
        title={`How precious you are, ${user.nickname}`}
        description="Not because of what you do, but simply because you exist. Come back to this page whenever you forget."
      />
      <ValueBoard nickname={user.nickname} />
    </div>
  );
}
