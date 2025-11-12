"use client";

import Link from "next/link";
import type { User } from "@/gqty";
import { getTextRecord } from "@/lib/utils";
import { ArtistAvatar } from "./artist-avatar";
import { TooltipProvider } from "./ui/tooltip";

type ArtistCardProps = {
  artist: User;
};

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const avatar = getTextRecord(artist.subdomain?.textRecords?.(), "avatar");
  const isLive = artist.activeBroadcast?.isLive;
  const description = getTextRecord(
    artist.subdomain?.textRecords?.(),
    "description"
  );
  const cardClassName = [
    "group relative flex h-full flex-col  overflow-hidden border-[1px] pb-4 rounded-md  bg-white px-6 pt-6 text-left",
    isLive
      ? "border-red-800  shadow-[0_3px_0_rgba(255,0,0,0.5)]"
      : "border-black   shadow-[0_3px_0_rgba(0,0,0,0.5)]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipProvider>
      <div className="h-full">
        <article className={cardClassName}>
          <Link
            className="flex h-full flex-col gap-4"
            href={`/${artist.subdomain?.name ?? ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div
                className={
                  "inline-flex size-12 items-center justify-center text-xl"
                }
              >
                <ArtistAvatar
                  avatarUrl={avatar}
                  className={`size-12 rounded-2xl border-2 ${
                    isLive ? "border-live" : "border-black"
                  }`}
                  name={artist.subdomain?.name ?? ""}
                  size="lg"
                />
              </div>
              <span
                className={`rounded-full border-2 px-3 py-1 font-semibold text-white text-xs uppercase tracking-[0.3em] ${
                  isLive ? "bg-red-500" : "bg-black"
                }`}
              >
                {isLive ? (
                  <span className="rounded-full py-1 font-semibold text-white text-xs uppercase tracking-[0.3em]">
                    LIVE
                  </span>
                ) : (
                  <span className="rounded-full py-1 font-semibold text-white text-xs uppercase tracking-[0.3em]">
                    OFFLINE
                  </span>
                )}
              </span>
            </div>
            <div>
              <h3 className="font-black text-gray-950 text-lg">
                {artist.subdomain?.name ?? ""}
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {description ? description : "No description"}
              </p>
            </div>
          </Link>
        </article>
      </div>
    </TooltipProvider>
  );
};
