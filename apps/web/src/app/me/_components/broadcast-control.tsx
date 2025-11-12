"use client";

import { LiveBroadcastCard } from "@/app/me/_components/live-broadcast-card";
import { StartBroadcastForm } from "@/app/me/_components/start-broadcast-form";
import { useOwnedProfile } from "@/hooks/use-owned-profile";

/**
 * Main broadcast control component
 * Orchestrates streaming state and UI
 *
 * Shows StartBroadcastForm when offline
 * Shows LiveBroadcastCard when streaming
 */
export function BroadcastControl() {
  const ownedProfile = useOwnedProfile();

  // Loading state
  if (ownedProfile.isLoading) {
    return null;
  }

  // No profile found
  if (!(ownedProfile.hasProfile && ownedProfile.data)) {
    return null;
  }

  const activeBroadcast = ownedProfile.data.user?.activeBroadcast;
  const isLive = activeBroadcast?.isLive;

  return (
    <div>
      {isLive ? (
        <LiveBroadcastCard profile={ownedProfile.data} />
      ) : (
        <StartBroadcastForm />
      )}
    </div>
  );
}
