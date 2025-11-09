import Link from "next/link";
import { ArtistAvatar } from "@/components/artist-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { OwnedProfile } from "@/hooks/use-owned-profile";
import { getTextRecord } from "@/lib/utils";

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
  const avatar = getTextRecord(textRecords, "avatar");
  const description = getTextRecord(textRecords, "description");
  const subdomain = profile.subdomain?.name || profile.ensName?.split(".")[0];

  return (
    <Card className="border-border bg-card p-6 backdrop-blur">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <ArtistAvatar
            avatarUrl={avatar}
            className="border-4 border-border"
            name={subdomain || "Profile"}
            size="lg"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-foreground text-xl">
            {subdomain || "Anonymous"}
          </h3>
          {description && <p className="text-foreground">{description}</p>}
        
        </div>
      </div>
    </Card>
  );
}
