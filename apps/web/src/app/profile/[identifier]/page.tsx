"use client";

import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { BroadcastControl } from "@/components/broadcast-control";
import { DonationPopover } from "@/components/donation-modal";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { StreamEmbed } from "@/components/stream-embed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { ENS, SocialKey } from "@/lib/constants";
import {
  PAGE_CONTENT_CLASS,
  PANEL_CLASS,
  SECTION_HEADING_CLASS,
  SECTION_SUBHEADING_CLASS,
  SOFT_PANEL_CLASS,
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

/**
 * Profile page that handles both subdomain names and addresses
 * - If viewing own profile with subdomain: show edit form
 * - If viewing own profile without subdomain: show "request subdomain" message
 * - If viewing someone else's profile: show public artist profile
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <TODO>
export default function ProfilePage() {
  const params = useParams();
  const { address: connectedAddress, isConnected } = useAccount();
  const identifier = params.identifier as string;
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Check if identifier is an Ethereum address
  const isEthAddress = isAddress(identifier);

  // Get owned profile data
  const ownedProfile = useOwnedProfile();

  // If it's a subdomain name, construct full ENS name and use artist profile hook
  const fullEnsName = isEthAddress
    ? null
    : `${identifier}.${ENS.PARENT_DOMAIN}`;
  const { data: artist, isLoading: artistLoading } = useArtistProfile(
    fullEnsName || ""
  );

  // Determine if this is the owner's profile
  const isOwner = isEthAddress
    ? connectedAddress?.toLowerCase() === identifier.toLowerCase()
    : artist?.user?.address?.toLowerCase() === connectedAddress?.toLowerCase();

  // Loading state
  if (artistLoading || (isOwner && ownedProfile.isLoading)) {
    return (
      <div className={`${PAGE_CONTENT_CLASS} py-12`}>
        <div className="mb-8 space-y-4">
          <Skeleton className={`${PANEL_CLASS} h-64 w-full rounded-3xl`} />
          <div className="flex items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full border border-dashed border-black/30" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle address-based profile
  if (isEthAddress) {
    // If viewing own address without connection, show connect prompt
    if (!isConnected) {
      return (
        <div
          className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-2xl items-center justify-center`}
        >
          <Card className={`${SOFT_PANEL_CLASS} w-full p-10 text-center`}>
            <h1 className={`${SECTION_HEADING_CLASS} mb-4 text-3xl`}>
              Your Profile
            </h1>
            <p className="mb-6 text-gray-600">
              Connect your wallet to view and manage your profile
            </p>
            <PortoConnectButton />
          </Card>
        </div>
      );
    }

    // If it's the owner viewing their own address
    if (isOwner && connectedAddress) {
      // Check if they have a profile/subdomain
      if (ownedProfile.hasProfile && ownedProfile.data) {
        // Show edit form
        return (
          <div className={`${PAGE_CONTENT_CLASS} max-w-4xl py-12`}>
            <h1 className={`${SECTION_HEADING_CLASS} mb-8`}>Your Profile</h1>
            <div className="grid gap-6">
              <ProfileEditForm
                key={ownedProfile.data?.ensName}
                profile={ownedProfile.data}
              />
              <BroadcastControl />
            </div>
          </div>
        );
      }

      // No subdomain - show request message
      return (
        <div
          className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-2xl items-center justify-center`}
        >
          <Card
            className={`${SOFT_PANEL_CLASS} w-full space-y-4 p-10 text-center`}
          >
            <div className="text-5xl">👤</div>
            <h1 className={`${SECTION_HEADING_CLASS} text-2xl`}>
              No Profile Found
            </h1>
            <p className="mb-4 break-all font-mono text-sm text-gray-500">
              {identifier}
            </p>
            <p className="mb-6 text-gray-600">
              You need a subdomain to edit your profile. Get an invite code to
              get started!
            </p>
            <div className="flex justify-center gap-4">
              <Button disabled variant="outline">
                Request Subdomain
              </Button>
              <Link href="/onboarding">
                <Button>Get Invite Code</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    // Viewing someone else's address - not allowed
    return (
      <div className={`${PAGE_CONTENT_CLASS} max-w-4xl py-16 text-center`}>
        <Card className={`${SOFT_PANEL_CLASS} space-y-4 p-10`}>
          <div className="text-5xl">🔒</div>
          <h2 className={`${SECTION_HEADING_CLASS} text-2xl`}>
            Private Profile
          </h2>
          <p className="mb-6 text-gray-600">This profile is private.</p>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Handle subdomain-based profile
  if (!artist) {
    return (
      <div className={`${PAGE_CONTENT_CLASS} max-w-4xl py-16 text-center`}>
        <Card className={`${SOFT_PANEL_CLASS} space-y-4 p-10`}>
          <div className="text-5xl">🤔</div>
          <h2 className={`${SECTION_HEADING_CLASS} text-2xl`}>
            Profile not found
          </h2>
          <p className="mb-6 text-gray-600">
            The profile "{identifier}" doesn't exist or hasn't been created yet.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // If owner is viewing their own subdomain profile, show edit form
  if (isOwner && ownedProfile.data) {
    return (
      <div className={`${PAGE_CONTENT_CLASS} max-w-4xl py-12`}>
        <h1 className={`${SECTION_HEADING_CLASS} mb-8`}>Your Profile</h1>
        <div className="grid gap-6">
          <ProfileEditForm
            key={ownedProfile.data?.ensName}
            profile={ownedProfile.data}
          />
          <BroadcastControl />
        </div>
      </div>
    );
  }

  // Show public artist profile
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
            artistName={artist.subdomain || fullEnsName || ""}
            streamPlatform={artist.streamPlatform}
            streamUrl={artist.streamUrl}
            taggedArtists={artist.taggedArtists || []}
          />
        </div>
      )}

      <div
        className={`${PANEL_CLASS} mb-8 flex flex-col gap-6 px-8 py-10 md:flex-row md:items-start`}
      >
        <div className="flex-shrink-0">
          {avatar ? (
            <Image
              alt={artist.subdomain || fullEnsName || "Artist"}
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
              {artist.subdomain || fullEnsName}
            </h1>
            {description && (
              <p className="text-lg leading-relaxed text-gray-700">
                {description}
              </p>
            )}
          </div>

          <Button
            className="w-fit"
            onClick={() => setShowDonationModal(true)}
            size="lg"
          >
            💜 Send Gift
          </Button>
        </div>
      </div>

      <div className={`${PANEL_CLASS} px-8 py-10`}>
        <h3 className={`${SECTION_HEADING_CLASS} mb-6 text-2xl`}>
          🔗 Connect & Listen
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artist
            .textRecords?.()
            ?.filter((record) => SocialKey.safeParse(record.key).success)
            .map((record) => (
              <a
                className="flex items-center gap-3 rounded-2xl border border-black bg-white px-4 py-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                href={record.value}
                key={record.value}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-2xl">
                  {SOCIAL_ICONS[SocialKey.parse(record.key)] || "🔗"}
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold capitalize text-gray-900">
                    {record.key}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {record.value}
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            ))}
        </div>
      </div>

      {showDonationModal && (
        <DonationPopover
          ensName={artist.subdomain ?? ""}
          walletAddress={artist.user?.address}
        >
          <Button size="sm">
            <Gift className="h-3 w-3" />
          </Button>
        </DonationPopover>
      )}
    </div>
  );
}
