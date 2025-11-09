"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useOwnedProfile } from "@/hooks/use-owned-profile";

export default function Footer() {
  const { isConnected, address } = useAccount();
  const { data: ownedProfile } = useOwnedProfile();
  const [profileLink, setProfileLink] = useState<string | null>(null);

  useEffect(() => {
    if (!(isConnected && address)) {
      setProfileLink(null);
      return;
    }

    if (ownedProfile?.subdomain?.name) {
      setProfileLink(`/profile/${ownedProfile.subdomain.name}`);
    } else {
      setProfileLink(`/profile/${address}`);
    }
  }, [isConnected, address, ownedProfile]);

  return (
    <footer className="bg-[#f8f4ff] ">
      <div className="flex flex-col gap-3 px-4 py-4 max-w-6xl mx-auto rounded-t-lg bg-white border border-b-0 border-black">
        <div className="flex flex-row items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link className="font-bold text-xl" href="/">
              osopit
            </Link>
          </nav>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} osopit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
