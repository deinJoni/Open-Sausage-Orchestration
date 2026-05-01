"use client";

import { Coins, Link2, Mic, VenetianMask } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOwnedProfile } from "@/hooks/use-owned-profile";

type MeLayoutProps = {
  children: ReactNode;
};

export default function MeLayout({ children }: MeLayoutProps) {
  const account = useAccount();
  const ownedProfile = useOwnedProfile();

  if (!account.isConnected) {
    return <DisconnectedGate />;
  }

  if (!ownedProfile.hasProfile) {
    return <NoProfileGate />;
  }

  return <>{children}</>;
}

function DisconnectedGate() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
      <Card className="w-full">
        <div className="mb-6 text-center">
          <p className="mu-eyebrow mb-3 text-muted-foreground">Members only</p>
          <h1 className="mb-2 text-4xl">Member Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            For existing osopit.eth members only
          </p>
        </div>

        <div className="mb-6 space-y-3 rounded-md bg-secondary p-5">
          <p className="font-display text-xl italic">New to Osopit?</p>
          <p className="text-muted-foreground text-sm">
            You need an invitation from an existing member to create your
            profile. Once invited, you'll receive an osopit.eth subdomain and
            can manage your identity, go live, and receive tips.
          </p>
          <Link href="/">
            <Button variant="link">Browse existing artists →</Button>
          </Link>
        </div>

        <div className="space-y-3">
          <p className="mu-eyebrow text-center text-foreground">
            Already have an account?
          </p>
          <p className="text-center text-muted-foreground text-xs">
            Connect your wallet to access your dashboard
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </Card>
    </div>
  );
}

function NoProfileGate() {
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-4 md:py-12">
      <Card className="w-full">
        <div className="mb-8 text-center">
          <p className="mu-eyebrow mb-3 text-muted-foreground">Welcome</p>
          <h1 className="mb-3 text-5xl">Welcome to Osopit</h1>
          <p className="text-lg text-muted-foreground">
            A platform for creators to build identity, go live, and receive tips
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-background p-5">
            <VenetianMask className="mb-3 size-6" strokeWidth={1.5} />
            <h3 className="mb-1 text-xl">Own Your Identity</h3>
            <p className="text-muted-foreground text-sm">
              Decentralized ENS subdomain on Base blockchain
            </p>
          </div>

          <div className="rounded-md bg-background p-5">
            <Mic className="mb-3 size-6" strokeWidth={1.5} />
            <h3 className="mb-1 text-xl">Go Live</h3>
            <p className="text-muted-foreground text-sm">
              Stream to your fans in real-time
            </p>
          </div>

          <div className="rounded-md bg-background p-5">
            <Coins className="mb-3 size-6" strokeWidth={1.5} />
            <h3 className="mb-1 text-xl">Receive Tips</h3>
            <p className="text-muted-foreground text-sm">
              Digital tip jar for direct fan support
            </p>
          </div>

          <div className="rounded-md bg-background p-5">
            <Link2 className="mb-3 size-6" strokeWidth={1.5} />
            <h3 className="mb-1 text-xl">Connect Platforms</h3>
            <p className="text-muted-foreground text-sm">
              Link all your socials in one place
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto" size="lg">
              Browse Artists
            </Button>
          </Link>
          <ConnectButton />
        </div>
      </Card>
    </div>
  );
}
