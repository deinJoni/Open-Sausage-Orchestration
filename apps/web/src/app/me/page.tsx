"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { ProfilePreview } from "@/components/profile-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
          <appkit-button size="md" />
        </Card>
      </div>
    );
  }

  // Loading state
  if (ownedProfile.isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4">
        <p className="text-zinc-400">Loading profile...</p>
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
        {/* Profile Preview */}
        <ProfilePreview ensName={ownedProfile.data?.ensName || ""} />

        {/* Edit Form - key prop ensures component remounts when profile changes */}
        {ownedProfile.data && (
          <ProfileEditForm
            key={ownedProfile.data?.ensName}
            profile={ownedProfile.data}
          />
        )}

        {/* Activity Feed */}
        {/* <ActivityFeed activities={activities} /> */}
      </div>
    </div>
  );
}
