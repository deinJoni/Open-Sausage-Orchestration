"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { BalanceHero } from "@/app/me/_components/balance-hero";
import { BroadcastControl } from "@/app/me/_components/broadcast-control";
import { ProfileEditForm } from "@/app/me/_components/profile-edit-form";
import { QuickActionsRow } from "@/app/me/_components/quick-actions-row";
import { SendMoneySheet } from "@/app/me/_components/send-money-sheet";
import { ShareLinkSheet } from "@/app/me/_components/share-link-sheet";
import { TransactionList } from "@/app/me/_components/transaction-list";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useEthPrice } from "@/hooks/use-eth-price";
import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { useWalletBalance } from "@/hooks/use-wallet-balance";

/**
 * Profile management page (/me)
 *
 * Digital tip jar - Shows balance, transactions, and quick actions
 * Profile editing is collapsible to keep focus on wallet functionality
 */
export default function MePage() {
  const { isConnected, address } = useAccount();
  const ownedProfile = useOwnedProfile();
  const ethPriceQuery = useEthPrice();
  const ethPrice = ethPriceQuery.ethPrice ?? 2000; // Fallback to $2000 if loading
  const balance = useWalletBalance(address, ethPrice);
  const transactions = useTransactionHistory(address);

  // Sheet visibility state
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSendSheet, setShowSendSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Derived values
  const ensName = ownedProfile.data?.subdomain?.name
    ? `${ownedProfile.data.subdomain.name}.catmisha.eth`
    : "";
  const giftUrl =
    typeof window !== "undefined" && ownedProfile.data?.subdomain?.name
      ? `${window.location.origin}/${ownedProfile.data.subdomain.name}/gift`
      : "";

  // No wallet connected
  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-border bg-card p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-foreground">
            Your Profile
          </h1>
          <p className="mb-6 text-muted-foreground">
            Connect your wallet to view and manage your profile
          </p>
          <PortoConnectButton />
        </Card>
      </div>
    );
  }

  // Loading state with skeleton matching the actual UI
  // Only show skeleton on initial load, not during background refetches
  if (ownedProfile.isLoading && !ownedProfile.hasProfile) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-12">
        <Skeleton className="mb-8 h-10 w-64" />

        <div className="grid gap-6">
          {/* Edit Form Skeleton */}
          <Card className="border-border bg-card p-6 backdrop-blur">
            <div className="mb-6">
              <div className="mb-3">
                <Skeleton className="h-7 w-48" />
              </div>
              <Skeleton className="h-9 w-40" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // No profile found
  if (!ownedProfile.hasProfile) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-border bg-card p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-foreground">
            No Profile Found
          </h1>
          <p className="mb-6 text-muted-foreground">
            You haven't created an artist profile yet. Get an invite code to get
            started!
          </p>
          <Link href="/onboarding">
            <Button>Create Profile</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Main view - Digital tip jar
  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-6 px-4 py-8 pb-safe">
      {/* Balance Hero */}
      <BalanceHero
        balanceETH={balance.formatted}
        balanceUSD={balance.balanceUSD}
        ensName={ensName}
        isLoading={balance.isLoading}
        onRefresh={balance.refetch}
        walletAddress={address ?? ""}
      />

      {/* Quick Actions */}
      <QuickActionsRow
        onSend={() => setShowSendSheet(true)}
        onSettings={() => setShowSettings((prev) => !prev)}
        onShare={() => setShowShareSheet(true)}
      />

      {/* Transaction History */}
      <TransactionList
        ethPriceUSD={ethPrice}
        isLoading={transactions.isLoading}
        transactions={transactions.transactions}
      />

      {/* Collapsible Settings Section */}
      <Collapsible onOpenChange={setShowSettings} open={showSettings}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger asChild>
            <button
              className="w-full p-4 text-left hover:bg-accent"
              type="button"
            >
              <h3 className="font-semibold text-foreground">
                {showSettings ? "Hide" : "Show"} Settings
              </h3>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-6 p-6 pt-0">
              {/* Profile Editing */}
              {ownedProfile.data && (
                <div>
                  <h4 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
                    Profile
                  </h4>
                  <ProfileEditForm
                    key={ownedProfile.data?.ensName}
                    profile={ownedProfile.data}
                  />
                </div>
              )}

              {/* Broadcast Control */}
              <div>
                <h4 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
                  Live Broadcast
                </h4>
                <BroadcastControl />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Bottom Sheets */}
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
