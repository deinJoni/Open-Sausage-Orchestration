"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DonationModal } from "@/components/donation-modal";
import { StreamEmbed } from "@/components/stream-embed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { SocialKey } from "@/lib/constants";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";

const SOCIAL_ICONS: Record<SocialKey, string> = {
  "com.spotify": "🎵",
  "com.soundcloud": "🎧",
  "com.twitch": "📺",
  "com.youtube": "▶️",
  "com.twitter": "🐦",
  "com.instagram": "📷",
  "com.github": "🔧",
  "com.discord": "🔗",
  "com.telegram": "🔗",
  "com.tiktok": "🔗",
  "com.facebook": "🔗",
  "com.linkedin": "🔗",
  "com.pinterest": "🔗",
  "com.reddit": "🔗",
};

export default function ArtistProfilePage() {
  const params = useParams();
  const ensName = params.ensName as string;
  const { data: artist, isLoading } = useArtistProfile(ensName);
  const [showDonationModal, setShowDonationModal] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="mb-4 text-5xl">🤔</div>
        <h2 className="mb-2 font-bold text-2xl text-white">Artist not found</h2>
        <p className="mb-6 text-muted-foreground">
          This artist profile doesn't exist or hasn't been created yet.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const avatar = getTextRecord(artist.textRecords?.(), "avatar");
  const description = getTextRecord(artist.textRecords?.(), "description");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild size="sm" variant="ghost">
          <Link href="/artists">← Back to Artists</Link>
        </Button>
      </div>

      {/* Stream Embed - Show if artist is currently streaming */}
      {artist.isStreaming && artist.streamUrl && artist.streamPlatform && (
        <div className="mb-8">
          <StreamEmbed
            artistName={artist.subdomain || ensName}
            streamPlatform={artist.streamPlatform}
            streamUrl={artist.streamUrl}
            taggedArtists={artist.taggedArtists || []}
          />
        </div>
      )}

      {/* Profile Header - Compact */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <Image
              alt={artist.subdomain || ensName}
              className={`h-32 w-32 rounded-full border-4 ${
                artist.isStreaming ? "border-live" : "border-border"
              }`}
              height={128}
              src={ipfsToHttp(avatar)}
              width={128}
            />
          ) : (
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                artist.isStreaming ? "border-live" : "border-border"
              } bg-surface-elevated text-4xl`}
            >
              👤
            </div>
          )}
        </div>

        {/* Name + Bio + Action */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="mb-2 font-bold text-4xl text-white">
              {artist.subdomain || ensName}
            </h1>
            {description && (
              <p className="text-foreground text-lg">{description}</p>
            )}
          </div>

          <Button
            onClick={() => setShowDonationModal(true)}
            size="lg"
            variant="gradient"
          >
            💜 Send Gift
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="mb-4 font-semibold text-white text-xl">
          🔗 Connect & Listen
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {artist
            .textRecords?.()
            ?.filter((record) => SocialKey.safeParse(record.key).success)
            .map((record) => (
              <a
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50 hover:bg-card/80"
                href={record.value}
                key={record.value}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-2xl">
                  {SOCIAL_ICONS[SocialKey.parse(record.key)] || "🔗"}
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-white capitalize">
                    {record.key}
                  </div>
                  <div className="truncate text-muted-foreground text-xs">
                    {record.value}
                  </div>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
            ))}
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          artistEnsName={artist.subdomain ?? ""}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </div>
  );
}
