"use client";

import type { OwnedProfile } from "@/hooks/use-owned-profile";
import { buildProfile } from "@/lib/profile";
import { ArtistAvatar } from "./artist-avatar";
import { ArtistQuickActions } from "./artist-quick-actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type AvatarGroupProps = {
  artists: OwnedProfile["user"][];
  size?: "sm" | "md";
};

/**
 * Display a group of overlapping artist avatars with tooltips and click-to-view-profile
 */
export function AvatarGroup({ artists, size = "sm" }: AvatarGroupProps) {
  if (artists.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      {artists.map((artist, index) => {
        const subdomain = artist?.subdomain;
        const name = subdomain?.name ?? undefined;
        const node = subdomain?.node ?? undefined;
        const profile = buildProfile({
          ownerAddress: subdomain?.owner?.address ?? "",
          subdomain: name && node ? { name, node } : null,
          rawTextRecords: subdomain?.textRecords?.(),
        });
        const displayName = name ?? "";

        return (
          <Tooltip key={artist?.id}>
            <TooltipTrigger asChild>
              <ArtistQuickActions ensName={displayName}>
                <button className={index > 0 ? "-ml-2" : ""} type="button">
                  <ArtistAvatar
                    avatarUrl={profile.avatar}
                    className="border border-brand transition-transform hover:z-10 hover:scale-110"
                    name={displayName}
                    size={size === "sm" ? "sm" : "md"}
                  />
                </button>
              </ArtistQuickActions>
            </TooltipTrigger>
            <TooltipContent>
              <p>{displayName}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
