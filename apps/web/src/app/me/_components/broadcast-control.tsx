"use client";

import { useAccount } from "wagmi";
import { LiveBroadcastCard } from "@/app/me/_components/live-broadcast-card";
import { StartBroadcastForm } from "@/app/me/_components/start-broadcast-form";
import { useActiveBroadcast } from "@/hooks/use-active-broadcast";

export function BroadcastControl() {
  const account = useAccount();
  const active = useActiveBroadcast(account.address);

  if (active.isLoading) {
    return null;
  }

  if (active.data) {
    return (
      <div>
        <LiveBroadcastCard broadcast={active.data} />
      </div>
    );
  }

  return (
    <div>
      <StartBroadcastForm />
    </div>
  );
}
