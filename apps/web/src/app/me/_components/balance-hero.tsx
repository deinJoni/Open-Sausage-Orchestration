"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type BalanceHeroProps = {
  balanceUSD: string;
  balanceETH: string;
  ensName: string;
  isLoading: boolean;
  onRefresh: () => void;
};

export function BalanceHero({
  balanceUSD,
  balanceETH,
  ensName,
  isLoading,
  onRefresh,
}: BalanceHeroProps) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-brand/10 to-brand-secondary/10 p-8 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <Skeleton className="mx-auto h-6 w-32" />
          <Skeleton className="mx-auto h-16 w-48" />
          <Skeleton className="mx-auto h-5 w-24" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-brand/10 to-brand-secondary/10 p-8 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
            Your Balance
          </h2>
          <Button
            className="size-6"
            onClick={onRefresh}
            size="icon"
            variant="ghost"
          >
            <RefreshCw className="size-3" />
          </Button>
        </div>

        {/* USD Balance - Primary */}
        <div className="space-y-1">
          <p className="font-bold text-5xl text-foreground md:text-6xl">
            {balanceUSD}
          </p>
          <p className="text-muted-foreground text-sm">{balanceETH}</p>
        </div>

        {/* ENS Name */}
        <div className="rounded-full bg-background/50 px-4 py-2 font-medium text-brand text-sm">
          {ensName}
        </div>
      </div>
    </Card>
  );
}
