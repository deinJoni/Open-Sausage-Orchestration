import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveViewer } from "@/app/[identifier]/live/_components/live-viewer";
import { getEnsConfig } from "@/lib/ens-config";
import { getArtistProfileServer } from "@/lib/get-artist-profile-server";
import { createOgImageUrl } from "@/lib/og-utils";
import { formatAddress } from "@/lib/utils";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const profile = await getArtistProfileServer(identifier).catch(() => null);

  if (!profile) {
    return {
      title: "Artist not found - osopit",
      description: "This artist profile doesn't exist.",
    };
  }

  const envConfig = getEnsConfig();
  const displayName = profile.subdomain?.name || identifier;
  const fullDomain = profile.subdomain
    ? `${profile.subdomain.name}.${envConfig.domain}`
    : formatAddress(profile.address);
  const ogImageUrl = createOgImageUrl("/api/og/artist", { identifier });
  const isLive = profile.liveBroadcast?.isLive === true;
  const title = isLive
    ? `${displayName} is live - osopit`
    : `${displayName} - osopit`;
  const description = isLive
    ? `Watch ${displayName} (${fullDomain}) streaming live on osopit`
    : `${displayName} (${fullDomain}) is not live right now`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName} live`,
        },
      ],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ArtistLivePage({ params }: PageProps) {
  const { identifier } = await params;

  const artist = await getArtistProfileServer(identifier).catch(() => null);

  if (!artist) {
    notFound();
  }

  const displayName = artist.subdomain?.name || identifier;

  return (
    <LiveViewer
      avatar={artist.avatar}
      displayName={displayName}
      liveBroadcast={artist.liveBroadcast}
    />
  );
}
