"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";
import { DonationModal } from "./donation-modal";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Skeleton } from "./ui/skeleton";

type ArtistQuickActionsProps = {
  ensName: string;
  children: React.ReactNode;
};

function ArtistPreviewContent({ ensName }: { ensName: string }) {
  const { data: artist, isLoading } = useArtistProfile(ensName);
  const [showDonationModal, setShowDonationModal] = useState(false);

  if (isLoading) {
    return (
      <div className="w-72 p-4">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="w-72 p-4 text-center">
        <p className="text-muted-foreground text-sm">Artist not found</p>
      </div>
    );
  }

  const avatar = getTextRecord(
    artist.user?.subdomain?.textRecords?.(),
    "avatar"
  );
  const description = getTextRecord(
    artist.user?.subdomain?.textRecords?.(),
    "description"
  );

  return (
    <>
      <div className="w-72">
        <div className="mb-4 flex items-center gap-3">
          <Image
            alt={artist.subdomain ?? ""}
            className="h-12 w-12 rounded-full border-2 border-border"
            height={48}
            src={ipfsToHttp(avatar)}
            width={48}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">
                {artist.subdomain ?? ""}
              </h4>
              {artist.user?.activeBroadcast?.isLive && (
                <span className="rounded-full bg-live/20 px-2 py-0.5 text-live text-xs">
                  LIVE
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-muted-foreground text-sm">
          {description || "Description"}
        </p>

        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm" variant="outline">
            <Link href={`/artist/${artist.subdomain ?? ""}`}>View Profile</Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() => setShowDonationModal(true)}
            size="sm"
            variant="gradient"
          >
            Send Gift 💜
          </Button>
        </div>
      </div>

      {showDonationModal && (
        <DonationModal
          artistEnsName={artist.subdomain ?? ""}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </>
  );
}

const MOBILE_WIDTH = 768;

export function ArtistQuickActions({
  ensName,
  children,
}: ArtistQuickActionsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: use Sheet (drawer)
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="border-border bg-card">
          <SheetHeader>
            <SheetTitle className="text-white">Artist Profile</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ArtistPreviewContent ensName={ensName} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: use Popover
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="border-border bg-card p-4">
        <ArtistPreviewContent ensName={ensName} />
      </PopoverContent>
    </Popover>
  );
}
