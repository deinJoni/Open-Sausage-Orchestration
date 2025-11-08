import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { ipfsToHttp } from "@/lib/utils";

type ProfilePreviewProps = {
  ensName: string;
};

/**
 * Profile preview card showing avatar, name, and bio
 * Displays read-only summary with link to public profile
 */
export function ProfilePreview({ ensName }: ProfilePreviewProps) {
  const { data: artist, isLoading } = useArtistProfile(ensName);

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (!artist) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
        <div className="text-zinc-400">No profile data found</div>
      </Card>
    );
  }

  const avatarRecord = artist.textRecords?.()?.find((record) => record.key === "avatar");
  const descriptionRecord = artist.textRecords?.()?.find((record) => record.key === "description");

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarRecord?.value ? (
            <Image
              alt={artist.subdomain || ensName}
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
            {artist.subdomain || ensName}
          </h3>
          {descriptionRecord?.value && (
            <p className="text-zinc-300">{descriptionRecord.value}</p>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href={`/artist/${ensName}`}>View Public Profile</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
