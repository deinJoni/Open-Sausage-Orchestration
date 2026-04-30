"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { BalanceHero } from "@/app/me/_components/balance-hero";
import { BroadcastSheet } from "@/app/me/_components/broadcast-sheet";
import { LiveBroadcastCard } from "@/app/me/_components/live-broadcast-card";
import { LiveStatusBanner } from "@/app/me/_components/live-status-banner";
import { ProfileEditForm } from "@/app/me/_components/profile-edit-form";
import { QuickActionsRow } from "@/app/me/_components/quick-actions-row";
import { SendMoneySheet } from "@/app/me/_components/send-money-sheet";
import { ShareLinkSheet } from "@/app/me/_components/share-link-sheet";
import { TransactionList } from "@/app/me/_components/transaction-list";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveBroadcast } from "@/hooks/use-active-broadcast";
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
  const activeBroadcast = useActiveBroadcast(address);
  const ethPriceQuery = useEthPrice();
  const ethPrice = ethPriceQuery.ethPrice;
  const balance = useWalletBalance(address, ethPrice);
  const transactions = useTransactionHistory(address);

  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSendSheet, setShowSendSheet] = useState(false);
  const [showBroadcastSheet, setShowBroadcastSheet] = useState(false);
  const broadcastCardRef = useRef<HTMLDivElement>(null);

  const ensName = ownedProfile.data?.subdomain?.name
    ? `${ownedProfile.data.subdomain.name}.osopit.eth`
    : "";
  const giftUrl =
    typeof window !== "undefined" && ownedProfile.data?.subdomain?.name
      ? `${window.location.origin}/${ownedProfile.data.subdomain.name}/gift`
      : "";

  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-border bg-background/80 p-8 backdrop-blur">
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-bold text-2xl text-foreground">
              Member Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              For existing osopit.eth members only
            </p>
          </div>

          <div className="mb-6 space-y-3 rounded-lg border border-border bg-background/50 p-4">
            <p className="text-foreground text-sm">
              <strong>New to Osopit?</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              You need an invitation from an existing member to create your
              profile. Once invited, you'll receive an osopit.eth subdomain and
              can manage your identity, go live, and receive tips.
            </p>
            <Link href="/">
              <Button className="h-auto p-0 text-sm" variant="link">
                Browse existing artists →
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <p className="text-center text-foreground text-sm">
              <strong>Already have an account?</strong>
            </p>
            <p className="text-center text-muted-foreground text-xs">
              Connect your Porto smart wallet to access your dashboard
            </p>
            <div className="flex justify-center">
              <PortoConnectButton />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (ownedProfile.isLoading && !ownedProfile.hasProfile) {
    return (
      <div className="mx-auto h-full max-w-4xl px-4 py-4 md:py-12">
        <Skeleton className="mb-8 h-10 w-64" />

        <div className="grid gap-6">
          <Card className="border-border bg-background/80 p-6 backdrop-blur">
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

  if (!ownedProfile.hasProfile) {
    return (
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-4 md:py-12">
        <Card className="w-full border-border bg-background/80 p-8 backdrop-blur">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              Welcome to Osopit
            </h1>
            <p className="text-lg text-muted-foreground">
              A platform for creators to build identity, go live, and receive
              tips
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-2 text-2xl">🎭</div>
              <h3 className="mb-1 font-semibold text-foreground">
                Own Your Identity
              </h3>
              <p className="text-muted-foreground text-sm">
                Decentralized ENS subdomain on Base blockchain
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-2 text-2xl">🎤</div>
              <h3 className="mb-1 font-semibold text-foreground">Go Live</h3>
              <p className="text-muted-foreground text-sm">
                Stream to your fans in real-time
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-2 text-2xl">💰</div>
              <h3 className="mb-1 font-semibold text-foreground">
                Receive Tips
              </h3>
              <p className="text-muted-foreground text-sm">
                Digital tip jar for direct fan support
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="mb-2 text-2xl">🔗</div>
              <h3 className="mb-1 font-semibold text-foreground">
                Connect Platforms
              </h3>
              <p className="text-muted-foreground text-sm">
                Link all your socials in one place
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto" size="lg">
                Browse Artists
              </Button>
            </Link>
            <PortoConnectButton />
          </div>
        </Card>
      </div>
    );
  }

  const isLive = activeBroadcast.isLive;
  const liveBroadcast = activeBroadcast.data;

  const handleGoLive = () => {
    if (isLive && broadcastCardRef.current) {
      // If already live, scroll to broadcast card
      broadcastCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      // Open broadcast sheet to start streaming
      setShowBroadcastSheet(true);
    }
  };

  const handleViewBroadcastDetails = () => {
    if (broadcastCardRef.current) {
      broadcastCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-6 p-4 pb-safe">
      {/* Live Status Banner - Only show when streaming */}
      {isLive && liveBroadcast && (
        <LiveStatusBanner
          broadcast={liveBroadcast}
          onViewDetails={handleViewBroadcastDetails}
        />
      )}

      <BalanceHero
        balanceETH={balance.formatted}
        balanceUSD={balance.balanceUSD}
        ensName={ensName}
        isLoading={balance.isLoading}
        onRefresh={balance.refetch}
        walletAddress={address ?? ""}
      />

      <QuickActionsRow
        isLive={isLive}
        onGoLive={handleGoLive}
        onSend={() => setShowSendSheet(true)}
        onShare={() => setShowShareSheet(true)}
      />

      {/* Live Broadcast Card - Only show when streaming */}
      {isLive && liveBroadcast && (
        <div ref={broadcastCardRef}>
          <h4 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
            Live Broadcast
          </h4>
          <LiveBroadcastCard broadcast={liveBroadcast} />
        </div>
      )}

      {/* Profile Section */}
      <div className="space-y-6 pt-0">
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
      </div>

      {/* Transactions - now at bottom */}
      <div>
        <h4 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
          Recent Activity
        </h4>
        <TransactionList
          ethPriceUSD={ethPrice}
          isLoading={transactions.isLoading || ethPriceQuery.isLoading}
          transactions={transactions.transactions}
        />
      </div>

      {/* Sheets/Drawers */}
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

      <BroadcastSheet
        onOpenChange={setShowBroadcastSheet}
        open={showBroadcastSheet}
      />
    </div>
  );
}
