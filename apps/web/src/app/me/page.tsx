"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { BalanceHero } from "@/app/me/_components/balance-hero";
import { GoLiveCta } from "@/app/me/_components/go-live-cta";
import { ProfileEditForm } from "@/app/me/_components/profile-edit-form";
import { SendMoneySheet } from "@/app/me/_components/send-money-sheet";
import { ShareLinkSheet } from "@/app/me/_components/share-link-sheet";
import { WalletActionsRow } from "@/app/me/_components/wallet-actions-row";
import { useEthPrice } from "@/hooks/use-eth-price";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { useWalletBalance } from "@/hooks/use-wallet-balance";

export default function MePage() {
  const account = useAccount();
  const ownedProfile = useOwnedProfile();
  const ethPriceQuery = useEthPrice();
  const ethPrice = ethPriceQuery.ethPrice;
  const balance = useWalletBalance(account.address, ethPrice);

  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSendSheet, setShowSendSheet] = useState(false);

  const subdomainName = ownedProfile.data?.subdomain?.name;
  const ensName = subdomainName ? `${subdomainName}.osopit.eth` : "";
  const giftUrl =
    typeof window !== "undefined" && subdomainName
      ? `${window.location.origin}/${subdomainName}/gift`
      : "";

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-6 p-4 pb-safe">
      <BalanceHero
        balanceETH={balance.formatted}
        balanceUSD={balance.balanceUSD}
        ensName={ensName}
        isLoading={balance.isLoading}
        onRefresh={balance.refetch}
        walletAddress={account.address ?? ""}
      />

      <GoLiveCta />

      <WalletActionsRow
        onSend={() => setShowSendSheet(true)}
        onShare={() => setShowShareSheet(true)}
      />

      {ownedProfile.data && (
        <div className="space-y-6 pt-0">
          <div>
            <h4 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Profile
            </h4>
            <ProfileEditForm
              key={ownedProfile.data.ensName}
              profile={ownedProfile.data}
            />
          </div>
        </div>
      )}

      <ShareLinkSheet
        ensName={ensName}
        giftUrl={giftUrl}
        onOpenChange={setShowShareSheet}
        open={showShareSheet}
      />

      <SendMoneySheet
        onOpenChange={setShowSendSheet}
        open={showSendSheet}
        userBalance={balance.balanceNum}
      />
    </div>
  );
}
