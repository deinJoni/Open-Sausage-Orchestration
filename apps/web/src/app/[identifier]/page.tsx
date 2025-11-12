"use client";

import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DonationPopover } from "@/components/donation-modal";
import { StreamEmbed } from "@/components/stream-embed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { SocialKey } from "@/lib/constants";
import {
  PAGE_CONTENT_CLASS,
  PANEL_CLASS,
  SECTION_HEADING_CLASS,
} from "@/lib/page-styles";
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
  const identifier = params.identifier as string;
  const { data: artist, isLoading } = useArtistProfile(identifier);

  if (isLoading) {
    return (
      <div className={`${PAGE_CONTENT_CLASS} py-12`}>
        <div className="mb-8 space-y-4">
          <Skeleton className={`${PANEL_CLASS} h-64 w-full rounded-3xl`} />
          <div className="flex items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full border border-black/30 border-dashed" />
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
      <div className={`${PAGE_CONTENT_CLASS} max-w-4xl py-16 text-center`}>
        <div className={`${PANEL_CLASS} space-y-4 p-10`}>
          <div className="text-5xl">🤔</div>
          <h2 className={`${SECTION_HEADING_CLASS} text-2xl`}>
            Artist not found
          </h2>
          <p className="text-gray-600">
            This artist profile doesn't exist or hasn't been created yet.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const avatar = getTextRecord(artist.textRecords?.(), "avatar");
  const description = getTextRecord(artist.textRecords?.(), "description");

  return (
    <div className={`${PAGE_CONTENT_CLASS} py-12`}>
      <div className="mb-6 flex items-center justify-between">
        <Button asChild size="sm" variant="ghost">
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>

      {artist.isStreaming && artist.streamUrl && artist.streamPlatform && (
        <div className={`${PANEL_CLASS} mb-8 overflow-hidden p-0`}>
          <StreamEmbed
            artistName={artist.subdomain || identifier}
            streamPlatform={artist.streamPlatform}
            streamUrl={artist.streamUrl}
            taggedArtists={artist.taggedArtists || []}
            walletAddress={artist.user?.address}
          />
        </div>
      )}

      <div
        className={`${PANEL_CLASS} mb-8 flex flex-col gap-6 px-8 py-10 md:flex-row md:items-start`}
      >
        <div className="flex-shrink-0">
          {avatar ? (
            <Image
              alt={artist.subdomain || identifier}
              className={`h-32 w-32 rounded-full border-4 ${
                artist.isStreaming ? "border-live" : "border-black"
              }`}
              height={128}
              src={ipfsToHttp(avatar)}
              width={128}
            />
          ) : (
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                artist.isStreaming ? "border-live" : "border-black"
              } bg-white text-4xl`}
            >
              👤
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1 className={`${SECTION_HEADING_CLASS} text-4xl`}>
              {artist.subdomain || identifier}
            </h1>
            {description && (
              <p className="text-gray-700 text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <DonationPopover
            ensName={artist.subdomain ?? ""}
            walletAddress={artist.user?.address}
          >
            <Button size="lg">
              <Gift className="h-3 w-3" />
            </Button>
          </DonationPopover>
        </div>
      </div>

      <div className={`${PANEL_CLASS} px-8 py-10`}>
        <h3 className={`${SECTION_HEADING_CLASS} mb-6 text-2xl`}>
          🔗 Connect & Listen
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artist
            .textRecords?.()
            ?.filter((x) => SocialKey.safeParse(x.key).success)
            .map((record) => (
              <a
                className="hover:-translate-y-1 flex items-center gap-3 rounded-2xl border border-black bg-white px-4 py-3 transition-transform duration-200 hover:shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                href={record.value}
                key={record.value}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-2xl">
                  {SOCIAL_ICONS[SocialKey.parse(record.key)] || "🔗"}
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-gray-900 capitalize">
                    {record.key}
                  </div>
                  <div className="truncate text-gray-500 text-xs">
                    {record.value}
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
