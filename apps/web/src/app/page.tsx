"use client";

import { useAccount } from "wagmi";
import { Dashboard } from "@/components/dashboard";
import { FeatureCards } from "@/components/feature-cards";
import { Hero } from "@/components/hero";
import { WelcomeCard } from "@/components/welcome-card";

export default function Home() {
  const { isConnected } = useAccount();

  // TODO: Check if user has a profile via API
  // For now, we'll simulate this - set to true to test Dashboard view
  const hasProfile = false;

  if (!isConnected) {
    return (
      <div className="space-y-16 pb-16">
        <Hero />
        <FeatureCards />
      </div>
    );
  }

  if (!hasProfile) {
    return <WelcomeCard />;
  }

  return <Dashboard />;
}
