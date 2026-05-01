"use client";

import { Gift } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveBroadcast } from "@/hooks/use-active-broadcast";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { ArtistAvatar } from "./artist-avatar";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

type ArtistQuickActionsProps = {
  ensName: string;
  children: React.ReactNode;
};

function ArtistPreviewContent({ ensName }: { ensName: string }) {
  const { data: artist, isLoading } = useArtistProfile(ensName);
  const liveBroadcast = useActiveBroadcast(artist?.address);

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
        <p className="text-md text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  const name = artist.subdomain?.name ?? "";

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <ArtistAvatar avatarUrl={artist.avatar} name={name} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-2xl text-foreground italic">
              {name}
            </h4>
            {liveBroadcast.isLive && (
              <span className="mu-eyebrow inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-live-foreground">
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-muted-foreground text-sm">
        {artist.description || "Description"}
      </p>

      <div className="flex items-center gap-3">
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link href={`/${name}`}>View profile</Link>
        </Button>
        <Link href={`/${name}/gift`}>
          <Button size="sm">
            <Gift className="h-3 w-3" />
          </Button>
        </Link>
      </div>
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

  // Mobile: use Drawer
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-display text-2xl italic">
              Artist Profile
            </DrawerTitle>
          </DrawerHeader>
          <div className="mt-4 px-4 pb-4">
            <ArtistPreviewContent ensName={ensName} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: use Popover
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-4">
        <ArtistPreviewContent ensName={ensName} />
      </PopoverContent>
    </Popover>
  );
}
