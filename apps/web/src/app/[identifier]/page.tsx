import {
  Facebook,
  Gift,
  Github,
  Headphones,
  Instagram,
  Linkedin,
  type LucideIcon,
  MessageCircle,
  Music,
  Pin,
  Send,
  Tv,
  Twitter,
  Youtube,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileQrCode } from "@/app/[identifier]/_components/profile-qr-code";
import { StreamEmbed } from "@/components/stream-embed";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { env } from "@/env";
import { APP_URLS, SocialKey } from "@/lib/constants";
import { getEnsConfig } from "@/lib/ens-config";
import { getArtistProfileServer } from "@/lib/get-artist-profile-server";
import { createOgImageUrl } from "@/lib/og-utils";
import { formatAddress } from "@/lib/utils";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

const SOCIAL_ICONS: Record<SocialKey, LucideIcon> = {
  "com.spotify": Music,
  "com.soundcloud": Headphones,
  "com.twitch": Tv,
  "com.youtube": Youtube,
  "com.twitter": Twitter,
  "com.instagram": Instagram,
  "com.github": Github,
  "com.discord": MessageCircle,
  "com.telegram": Send,
  "com.tiktok": Music,
  "com.facebook": Facebook,
  "com.linkedin": Linkedin,
  "com.pinterest": Pin,
  "com.reddit": MessageCircle,
};

/**
 * Generate metadata for artist profile page
 * Runs server-side for proper SEO and social media previews
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const profile = await getArtistProfileServer(identifier);

  if (!profile) {
    return {
      title: "Artist not found - osopit",
      description: "This artist profile doesn't exist.",
    };
  }

  const envConfig = getEnsConfig();
  const displayName = profile.subdomain?.name || identifier;
  const description = profile.description;
  const fullDomain = profile.subdomain
    ? `${profile.subdomain.name}.${envConfig.domain}`
    : formatAddress(profile.address);

  const ogImageUrl = createOgImageUrl("/api/og/artist", { identifier });

  return {
    title: `${displayName} - osopit`,
    description:
      description || `View ${displayName}'s profile on osopit - ${fullDomain}`,
    openGraph: {
      title: displayName,
      description:
        description ||
        `Check out ${displayName}'s profile on osopit - ${fullDomain}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName}'s profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: displayName,
      description:
        description ||
        `Check out ${displayName}'s profile on osopit - ${fullDomain}`,
      images: [ogImageUrl],
    },
  };
}

/**
 * Artist profile page - server component
 * Fetches data once and renders directly (no client wrapper)
 */
export default async function ArtistProfilePage({ params }: PageProps) {
  const { identifier } = await params;

  // Fetch artist data server-side
  const artist = await getArtistProfileServer(identifier);

  // Show 404 if artist not found
  if (!artist) {
    notFound();
  }

  // Extract profile data
  const avatar = artist.avatar;
  const description = artist.description;
  const displayName = artist.subdomain?.name || identifier;

  return (
    <Container>
      {/* Stream embed (only if streaming via embeddable iframe provider) */}
      {artist.liveBroadcast?.playback?.type === "iframe" && (
        <div className="mb-8 overflow-hidden rounded-lg border border-border bg-primary/20 p-0 shadow-md">
          <StreamEmbed
            artistName={displayName}
            streamUrl={artist.liveBroadcast.streamId}
            taggedArtists={artist.liveBroadcast.guests}
          />
        </div>
      )}

      {/* Profile section (server-rendered) */}
      <div className="mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-b from-primary/30 to-primary/10 shadow-lg">
        {/* Main Profile Content */}
        <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              {artist.liveBroadcast?.isLive && (
                <div className="-inset-1 absolute animate-pulse rounded-full bg-gradient-to-r from-live via-brand to-live opacity-75 blur" />
              )}
              {avatar ? (
                <Image
                  alt={displayName}
                  className={`relative h-32 w-32 rounded-full border-3 ${
                    artist.liveBroadcast?.isLive
                      ? "border-live shadow-live/20 shadow-xl"
                      : "border-border shadow-lg"
                  }`}
                  height={128}
                  src={avatar}
                  width={128}
                />
              ) : (
                <div
                  className={`relative flex h-32 w-32 items-center justify-center rounded-full border-3 ${
                    artist.liveBroadcast?.isLive
                      ? "border-live shadow-live/20 shadow-xl"
                      : "border-border shadow-lg"
                  } bg-gradient-to-br from-background to-muted text-4xl`}
                >
                  👤
                </div>
              )}
              {artist.liveBroadcast?.isLive && (
                <div className="-bottom-1 -right-1 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-live">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name, bio, and actions */}
          <div className="flex-1 space-y-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <h1 className="font-black text-3xl text-foreground leading-tight sm:text-4xl">
                  {displayName}
                </h1>
                {artist.liveBroadcast?.isLive && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 font-medium text-white text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    LIVE
                  </span>
                )}
              </div>
              {description && (
                <p className="max-w-2xl text-base text-foreground/80 leading-relaxed sm:text-lg">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/${displayName}/gift`}>
                <Button className="gap-2 shadow-md" size="lg" variant="default">
                  <Gift className="h-4 w-4" />
                  Send Gift
                </Button>
              </Link>

              {/* Additional stats/info could go here */}
              {artist.liveBroadcast?.isLive && (
                <span className="text-muted-foreground text-sm">
                  Streaming now via {artist.liveBroadcast.provider}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Section - Now separated */}
        <ProfileQrCode
          artistName={displayName}
          giftUrl={`${APP_URLS[env.NEXT_PUBLIC_APP_ENV]}/${displayName}/gift`}
        />
      </div>

      {/* Social links (server-rendered) */}
      <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-b from-primary/20 to-primary/5 shadow-lg">
        <div className="border-border/30 border-b bg-muted/10 px-6 py-4">
          <h3 className="flex items-center gap-2 font-black text-foreground text-xl">
            <span className="text-2xl">🔗</span>
            Connect & Listen
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {artist.textRecords
            .filter((record) => SocialKey.safeParse(record.key).success)
            .map((record) => {
              const Icon =
                SOCIAL_ICONS[SocialKey.parse(record.key)] || MessageCircle;
              const platformName = record.key.replace("com.", "");

              return (
                <a
                  className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border/50 bg-gradient-to-r from-background/50 to-muted/30 px-4 py-3 transition-all duration-200 hover:border-brand/50 hover:shadow-brand/5 hover:shadow-md"
                  href={record.value}
                  key={`${record.key}-${record.value}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand/0 via-brand/5 to-brand/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex flex-shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5 text-brand transition-transform group-hover:scale-110" />
                  </div>
                  <div className="relative flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
                    <div className="truncate font-semibold text-foreground text-sm capitalize">
                      {platformName}
                    </div>
                    <div className="truncate text-muted-foreground text-xs">
                      {record.value}
                    </div>
                  </div>
                  <span className="relative flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              );
            })}
        </div>
      </div>
    </Container>
  );
}
