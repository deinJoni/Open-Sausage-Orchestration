"use client";

import type { OwnedProfile } from "@/hooks/use-owned-profile";
import {
  getInitials,
  getTextRecord,
  ipfsToHttp,
  stringToColor,
} from "@/lib/utils";
import { ArtistQuickActions } from "./artist-quick-actions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
  };

  const sizePixels = {
    sm: { height: 32, width: 32 },
    md: { height: 40, width: 40 },
  };

  const fallbackTextSize = {
    sm: "text-sm",
    md: "text-md",
  };

  return (
    <div className="flex">
      {artists.map((artist, index) => {
        const name = artist?.subdomain?.name || "";
        const avatar = getTextRecord(
          artist?.subdomain?.textRecords?.(),
          "avatar"
        );
        const initials = getInitials(name);
        const bgColor = stringToColor(name);

        return (
          <Tooltip key={artist?.id}>
            <TooltipTrigger asChild>
              <ArtistQuickActions ensName={name}>
                <button className={index > 0 ? "-ml-2" : ""} type="button">
                  <Avatar
                    className={`${sizeClasses[size]} border border-brand transition-transform hover:z-10 hover:scale-110`}
                  >
                    {avatar ? (
                      <AvatarImage
                        alt={name}
                        height={sizePixels[size].height}
                        src={ipfsToHttp(avatar)}
                        width={sizePixels[size].width}
                      />
                    ) : null}
                    <AvatarFallback
                      className={`${fallbackTextSize[size]} font-semibold`}
                      style={{ backgroundColor: bgColor }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </ArtistQuickActions>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
