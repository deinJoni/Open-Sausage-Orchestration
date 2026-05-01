"use client";

import { Gem } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useEthPrice } from "@/hooks/use-eth-price";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { useWalletBalance } from "@/hooks/use-wallet-balance";

export function ArtistBottomBar() {
  const { isConnected, address } = useAccount();
  const ownedProfile = useOwnedProfile();
  const { ethPrice } = useEthPrice();
  const balance = useWalletBalance(address, ethPrice);

  // State 1: No wallet connected
  if (!isConnected) {
    return (
      <div className="border-border border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4">
          <Link
            className="mu-eyebrow text-muted-foreground transition-opacity hover:opacity-70"
            href="/me"
          >
            Artist?
          </Link>
        </div>
      </div>
    );
  }

  // State 2: Wallet connected but no profile
  if (!ownedProfile.hasProfile) {
    return (
      <div className="border-border border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4">
          <Link
            className="mu-eyebrow text-muted-foreground transition-opacity hover:opacity-70"
            href="/me"
          >
            Artist? Join
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border border-t bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4">
        <Link
          className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
          href="/me"
        >
          <Gem className="size-3.5 text-brand" strokeWidth={1.5} />
          <span className="font-medium text-foreground">
            {balance.isLoading ? "..." : balance.formatted}
          </span>
          {!balance.isLoading && balance.balanceUSD && (
            <span className="text-muted-foreground text-xs">
              {balance.balanceUSD}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
