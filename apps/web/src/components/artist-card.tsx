"use client";

import { motion } from "framer-motion";
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
      <motion.div className="h-full">
        <article className={cardClassName}>
          <Link
            className="flex h-full flex-col gap-4"
            href={`/artist/${artist.subdomain?.name ?? ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div
                className={`inline-flex size-12 items-center justify-center  text-xl `}
              >
                <ArtistAvatar
                  avatarUrl={avatar}
                  className={`size-12 border-2 rounded-2xl ${
                    isLive ? "border-live" : "border-black"
                  }`}
                  name={artist.subdomain?.name ?? ""}
                  size="lg"
                />
              </div>
              <span
                className={`rounded-full border-2   px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white ${
                  isLive ? "bg-red-500" : "bg-black"
                }`}
              >
                {isLive ? (
                  <span className="rounded-full    py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    LIVE
                  </span>
                ) : (
                  <span className="rounded-full   py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    OFFLINE
                  </span>
                )}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-950">
                {artist.subdomain?.name ?? ""}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description ? description : "No description"}
              </p>
            </div>
            {/* <button className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 transition hover:-translate-y-[2px]">
              <span className="text-base leading-none">⇆</span>
              Manage
            </button> */}
          </Link>
          {/* {isLive ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden border-t border-live/50 bg-live">
              <motion.div
                aria-hidden="true"
                className="flex w-max items-center gap-6 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-live-foreground"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                {[...Array(2)].map((_, loopIndex) => (
                  <div
                    className="flex items-center gap-6"
                    key={`live-loop-${loopIndex}`}
                  >
                    {[...Array(6)].map((__, itemIndex) => {
                      const key = loopIndex * 6 + itemIndex;
                      return (
                        <span
                          className="flex items-center gap-3 whitespace-nowrap"
                          key={`live-item-${key}`}
                        >
                          <span className="relative flex size-2 items-center justify-center">
                            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-live-foreground/50" />
                            <span className="relative inline-flex size-2 rounded-full bg-live-foreground" />
                          </span>
                          Live
                        </span>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : null} */}
        </article>
      </motion.div>
    </TooltipProvider>
  );
};
