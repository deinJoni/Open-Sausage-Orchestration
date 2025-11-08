"use client";

import { useOwnedProfile } from "@/hooks/use-owned-profile";
import { StartBroadcastForm } from "./start-broadcast-form";
import { LiveBroadcastCard } from "./live-broadcast-card";

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
  if (!ownedProfile.hasProfile || !ownedProfile.data) {
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
