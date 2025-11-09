"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { ModeToggle } from "./mode-toggle";
import { PortoConnectButton } from "./porto-connect-button";

export default function Header() {
  const { isConnected, address } = useAccount();
  const { data: ownedProfile } = useOwnedProfile();
  const [profileLink, setProfileLink] = useState<string | null>(null);

  // Determine profile link based on subdomain or address
  useEffect(() => {
    if (!(isConnected && address)) {
      setProfileLink(null);
      return;
    }

    // If user has a subdomain, use it
    if (ownedProfile?.subdomain?.name) {
      setProfileLink(`/profile/${ownedProfile.subdomain.name}`);
    } else {
      // Otherwise use address
      setProfileLink(`/profile/${address}`);
    }
  }, [isConnected, address, ownedProfile]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <Link className="font-bold text-xl" href="/">
            osopit
          </Link>
          <div className="flex gap-4 text-sm">
            <Link className="transition-colors hover:text-primary" href="/">
              Home
            </Link>
            {isConnected && profileLink && (
              <Link
                className="transition-colors hover:text-primary"
                href={profileLink as `/profile/${string}`}
              >
                Profile
              </Link>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <PortoConnectButton />
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
