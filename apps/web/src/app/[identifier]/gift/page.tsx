import { notFound } from "next/navigation";
import { TipForm } from "@/app/[identifier]/gift/_components/tip-form";
import { getArtistProfileServer } from "@/lib/get-artist-profile-server";
import { getTextRecord } from "@/lib/utils";

type GiftPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

/**
 * Public gift/tip page for an artist
 * Server-rendered for fast initial load
 * Shareable link for receiving tips
 */
export default async function GiftPage({ params }: GiftPageProps) {
  const { identifier } = await params;

  // Fetch artist profile server-side
  const profile = await getArtistProfileServer(identifier);

  // 404 if artist not found
  if (!profile?.subdomain) {
    notFound();
  }

  const artistName = profile.subdomain.name;
  const ensName = `${artistName}.catmisha.eth`;
  const avatar = getTextRecord(profile.textRecords, "avatar");
  const bio = getTextRecord(profile.textRecords, "description");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <TipForm
        artistAddress={profile.address}
        artistAvatar={avatar}
        artistBio={bio}
        artistName={artistName}
        ensName={ensName}
      />
    </div>
  );
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: GiftPageProps) {
  const { identifier } = await params;
  const profile = await getArtistProfileServer(identifier);

  if (!profile?.subdomain) {
    return {
      title: "Artist Not Found",
    };
  }

  const artistName = profile.subdomain.name;

  return {
    title: `Send a tip to ${artistName}`,
    description: `Support ${artistName} with a tip on osopit`,
  };
}
