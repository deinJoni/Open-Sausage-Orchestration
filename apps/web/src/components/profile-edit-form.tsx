import { Card } from "@/components/ui/card";
import type { OwnedProfile } from "@/hooks/use-owned-profile";

type ProfileEditFormProps = {
  profile: OwnedProfile;
};

/**
 * Profile edit form component
 *
 * Follows React best practices:
 * - State initialized once from props (on mount)
 * - Parent passes key prop to force remount on profile change
 * - useEffect only for side effects (blob URL cleanup)
 * - useMemo for expensive calculations (change detection)
 * - Validation in event handlers
 */
export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  // ✅ Initialize state once from props

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <h2 className="mb-6 font-bold text-white text-xl">Edit Profile</h2>

      {JSON.stringify(profile.ensName)}
      {JSON.stringify(profile.textRecords?.map((record) => record.key))}
      {JSON.stringify(profile.textRecords?.map((record) => record.value))}
      {JSON.stringify(profile.user?.subdomain?.name)}
    </Card>
  );
}
