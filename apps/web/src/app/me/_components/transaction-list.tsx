"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/hooks/use-transaction-history";
import { formatAddress } from "@/lib/utils";

type TransactionListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  ethPriceUSD?: number;
};

// Generate stable keys for skeleton loader
const SKELETON_KEYS = Array.from({ length: 5 }, (_, _i) => crypto.randomUUID());

export function TransactionList({
  transactions,
  isLoading,
  ethPriceUSD = 2000,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-foreground text-lg">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {SKELETON_KEYS.map((key) => (
            <div className="flex items-center justify-between" key={key}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Your transaction history will appear here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-foreground text-lg">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionRow
            ethPriceUSD={ethPriceUSD}
            key={tx.hash}
            transaction={tx}
          />
        ))}
      </div>
    </Card>
  );
}

function TransactionRow({
  transaction,
  ethPriceUSD,
}: {
  transaction: Transaction;
  ethPriceUSD: number;
}) {
  const isIncoming = transaction.direction === "incoming";
  const otherAddress = isIncoming ? transaction.from : transaction.to;
  const usdValue = transaction.valueETHNum * ethPriceUSD;

  // Format timestamp to relative time
  const timestamp = new Date(transaction.timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  let timeAgo: string;
  if (diffMins < 1) {
    timeAgo = "Just now";
  } else if (diffMins < 60) {
    timeAgo = `${diffMins}m ago`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours}h ago`;
  } else if (diffDays === 1) {
    timeAgo = "Yesterday";
  } else {
    timeAgo = `${diffDays}d ago`;
  }

  return (
    <Link
      className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent"
      href={`https://basescan.org/tx/${transaction.hash}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium text-sm ${isIncoming ? "text-success" : "text-foreground"}`}
          >
            {isIncoming ? "Received" : "Sent"}
          </span>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <span>
            {isIncoming ? "from" : "to"} {formatAddress(otherAddress)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-right">
        <div>
          <p
            className={`font-semibold text-sm ${isIncoming ? "text-success" : "text-foreground"}`}
          >
            {isIncoming ? "+" : "-"}${usdValue.toFixed(2)}
          </p>
          <p className="text-muted-foreground text-xs">
            {transaction.valueETH.substring(0, 8)} ETH
          </p>
        </div>
        <ExternalLink className="size-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
