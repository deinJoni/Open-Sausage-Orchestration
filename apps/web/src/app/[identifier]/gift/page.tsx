import { notFound } from "next/navigation";
import { TipForm } from "@/app/[identifier]/gift/_components/tip-form";
import { getCurrentEnsEnvironment } from "@/lib/ens-environments";
import { getArtistProfileServer } from "@/lib/get-artist-profile-server";
import { createOgImageUrl } from "@/lib/og-utils";
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

  const profile = await getArtistProfileServer(identifier);

  if (!profile?.subdomain) {
    notFound();
  }

  const envConfig = getCurrentEnsEnvironment();
  const artistName = profile.subdomain.name;
  const ensName = `${artistName}.${envConfig.domain}`;
  const avatar = getTextRecord(profile.textRecords, "avatar");
  const bio = getTextRecord(profile.textRecords, "description");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary/20 p-4">
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

  const envConfig = getCurrentEnsEnvironment();
  const artistName = profile.subdomain.name;
  const fullDomain = `${artistName}.${envConfig.domain}`;
  const ogImageUrl = createOgImageUrl("/api/og/gift", { identifier });

  return {
    title: `Send a tip to ${artistName}`,
    description: `Support ${artistName} (${fullDomain}) with a tip`,
    openGraph: {
      title: `Send a tip to ${artistName}`,
      description: `Support ${artistName} (${fullDomain}) with a tip`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Send a tip to ${artistName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Send a tip to ${artistName}`,
      description: `Support ${artistName} (${fullDomain}) with a tip`,
      images: [ogImageUrl],
    },
  };
}
