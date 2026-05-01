import {
  ArrowRight,
  Facebook,
  Gift,
  Github,
  Headphones,
  Instagram,
  Link2,
  Linkedin,
  type LucideIcon,
  MessageCircle,
  Music,
  Pin,
  Send,
  Tv,
  Twitter,
  User,
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
        <div className="mb-10 space-y-3">
          <div className="overflow-hidden rounded-md bg-card">
            <StreamEmbed
              artistName={displayName}
              streamUrl={artist.liveBroadcast.streamId}
              taggedArtists={artist.liveBroadcast.guests}
            />
          </div>
          <div className="flex justify-end">
            <Link
              className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-brand uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
              href={`/${displayName}/live`}
            >
              Watch fullscreen
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Profile section (server-rendered) */}
      <div className="mb-10 overflow-hidden rounded-md bg-card">
        {/* Main Profile Content */}
        <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-12 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              {artist.liveBroadcast?.isLive && (
                <div className="-inset-1 absolute animate-pulse rounded-full bg-live opacity-50" />
              )}
              {avatar ? (
                <Image
                  alt={displayName}
                  className="relative h-32 w-32 rounded-full"
                  height={128}
                  src={avatar}
                  width={128}
                />
              ) : (
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
                  <User className="size-12" strokeWidth={1.5} />
                </div>
              )}
              {artist.liveBroadcast?.isLive && (
                <div className="-bottom-1 -right-1 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-live">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-live-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Name, bio, and actions */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-5xl text-foreground sm:text-7xl">
                  {displayName}
                </h1>
                {artist.liveBroadcast?.isLive && (
                  <Link
                    aria-label="Watch fullscreen"
                    className="mu-eyebrow inline-flex items-center gap-1.5 rounded-full bg-live px-2.5 py-1 text-live-foreground"
                    href={`/${displayName}/live`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-foreground opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-live-foreground" />
                    </span>
                    Live
                  </Link>
                )}
              </div>
              {description && (
                <p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link href={`/${displayName}/gift`}>
                <Button className="gap-2" size="lg" variant="default">
                  <Gift className="h-4 w-4" />
                  Send Gift
                </Button>
              </Link>

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
      <div className="overflow-hidden rounded-md bg-card">
        <div className="border-border border-b bg-secondary px-6 py-5 sm:px-10">
          <p className="mu-eyebrow mb-1 text-muted-foreground">Profile</p>
          <h3 className="flex items-center gap-3 text-3xl text-foreground">
            <Link2 className="size-5" strokeWidth={1.5} />
            Connect &amp; Listen
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          {artist.textRecords
            .filter((record) => SocialKey.safeParse(record.key).success)
            .map((record) => {
              const Icon =
                SOCIAL_ICONS[SocialKey.parse(record.key)] || MessageCircle;
              const platformName = record.key.replace("com.", "");

              return (
                <a
                  className="group relative flex items-center gap-3 overflow-hidden rounded-md border border-border/60 bg-background px-4 py-3 transition-[color,background] duration-150 hover:bg-foreground hover:text-primary-foreground"
                  href={record.value}
                  key={`${record.key}-${record.value}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="relative flex flex-shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="relative flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
                    <div className="mu-eyebrow truncate text-foreground group-hover:text-primary-foreground">
                      {platformName}
                    </div>
                    <div className="truncate text-muted-foreground text-xs group-hover:text-primary-foreground/70">
                      {record.value}
                    </div>
                  </div>
                  <ArrowRight className="size-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
              );
            })}
        </div>
      </div>
    </Container>
  );
}
