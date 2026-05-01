"use client";

import Link from "next/link";
import { ArtistAvatar } from "@/components/artist-avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { User } from "@/gqty";
import { buildProfile } from "@/lib/profile";

type ArtistCardProps = {
  artist: User;
  isLive?: boolean;
};

export const ArtistCard = ({ artist, isLive = false }: ArtistCardProps) => {
  const subdomain = artist.subdomain;
  const name = subdomain?.name ?? undefined;
  const node = subdomain?.node ?? undefined;
  const profile = buildProfile({
    ownerAddress: subdomain?.owner?.address ?? "",
    subdomain: name && node ? { name, node } : null,
    rawTextRecords: subdomain?.textRecords?.(),
  });

  const cardClassName = [
    "group relative flex h-full flex-col overflow-hidden rounded-md bg-card px-6 pb-6 pt-6 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-md",
    isLive ? "ring-1 ring-live/30" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipProvider>
      <div className="h-full">
        <article className={cardClassName}>
          <Link
            className="flex h-full flex-col gap-5"
            href={isLive ? `/${name ?? ""}/live` : `/${name ?? ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex size-16 items-center justify-center text-2xl">
                <ArtistAvatar
                  avatarUrl={profile.avatar}
                  className="size-16 rounded-md"
                  name={name ?? ""}
                  size="lg"
                />
              </div>
              <span
                className={`mu-eyebrow rounded-full px-2.5 py-1 ${
                  isLive
                    ? "bg-live text-live-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isLive ? "Live" : "Offline"}
              </span>
            </div>
            <div>
              <h3 className="text-3xl text-foreground">{name ?? ""}</h3>
              <p className="mt-3 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                {profile.description || "No description"}
              </p>
            </div>
          </Link>
        </article>
      </div>
    </TooltipProvider>
  );
};
