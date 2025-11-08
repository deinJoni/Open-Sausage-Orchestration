"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { BroadcastControl } from "@/components/broadcast-control";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwnedProfile } from "@/hooks/use-owned-profile";

/**
 * Profile management page (/me)
 *
 * Orchestrates profile display and editing using extracted components
 * Uses key prop on ProfileEditForm to reset form when profile changes
 */
export default function MePage() {
  const { isConnected } = useAccount();
  const ownedProfile = useOwnedProfile();

  // No wallet connected
  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">Your Profile</h1>
          <p className="mb-6 text-zinc-400">
            Connect your wallet to view and manage your profile
          </p>
          <PortoConnectButton />
        </Card>
      </div>
    );
  }

  // Loading state with skeleton matching the actual UI
  if (ownedProfile.isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-12">
        <Skeleton className="mb-8 h-10 w-64" />

        <div className="grid gap-6">
          {/* Edit Form Skeleton */}
          <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
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
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">
            No Profile Found
          </h1>
          <p className="mb-6 text-zinc-400">
            You haven't created an artist profile yet. Get an invite code to get
            started!
          </p>
          <Link href="/onboarding">
            <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
              Create Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-bold text-3xl text-white">Your Profile</h1>

      <div className="grid gap-6">
        {/* Edit Form - key prop ensures component remounts when profile changes */}
        {ownedProfile.data && (
          <ProfileEditForm
            key={ownedProfile.data?.ensName}
            profile={ownedProfile.data}
          />
        )}

        {/* Broadcast Control */}
        <BroadcastControl />

        {/* Activity Feed */}
        {/* <ActivityFeed activities={activities} /> */}
      </div>
    </div>
  );
}
