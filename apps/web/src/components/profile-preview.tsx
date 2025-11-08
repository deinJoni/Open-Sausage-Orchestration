import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { OwnedProfile } from "@/hooks/use-owned-profile";
import { ipfsToHttp } from "@/lib/utils";

type ProfilePreviewProps = {
  profile: OwnedProfile;
};

/**
 * Profile preview card showing avatar, name, and bio
 * Displays read-only summary with link to public profile
 * Now receives profile data directly to avoid duplicate queries
 */
export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const textRecords = profile.textRecords || [];
  const avatarRecord = textRecords.find((record) => record.key === "avatar");
  const descriptionRecord = textRecords.find(
    (record) => record.key === "description"
  );
  const subdomain = profile.subdomain?.name || profile.ensName?.split(".")[0];

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarRecord?.value ? (
            <Image
              alt={subdomain || "Profile"}
              className="h-24 w-24 rounded-full border-4 border-zinc-700"
              height={96}
              src={ipfsToHttp(avatarRecord.value)}
              width={96}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-zinc-700 bg-zinc-800 text-3xl">
              👤
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-white text-xl">
            {subdomain || "Anonymous"}
          </h3>
          {descriptionRecord?.value && (
            <p className="text-zinc-300">{descriptionRecord.value}</p>
          )}
          {profile.ensName && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/artist/${profile.ensName}`}>
                View Public Profile
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
