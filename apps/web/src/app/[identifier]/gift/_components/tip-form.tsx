"use client";

import { AppKitButton } from "@reown/appkit/react";
import { Cuer } from "cuer";
import { Check, Copy, ExternalLink, QrCode, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ArtistAvatar } from "@/components/artist-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useEthPrice } from "@/hooks/use-eth-price";
import { useSendEth } from "@/hooks/use-send-eth";
import { formatAddress } from "@/lib/utils";

type TipFormProps = {
  artistName: string;
  ensName: string;
  artistAvatar: string;
  artistBio: string;
  artistAddress: string;
};

// ETH preset amounts from small to large donations
const PRESET_AMOUNTS = [
  0.001, // ~$3-4
  0.002, // ~$6-8
  0.005, // ~$15-20
  0.01, // ~$30-40
  0.02, // ~$60-80
  0.05, // ~$150-200
  0.1, // ~$300-400
  0.5, // ~$1500-2000
];

// Regex patterns for formatting
const TRAILING_ZEROS_REGEX = /0+$/;
const TRAILING_DOT_REGEX = /\.$/;

// Format ETH amount (remove trailing zeros)
const formatEth = (amount: number) => {
  if (amount >= 0.1) {
    return amount
      .toFixed(2)
      .replace(TRAILING_ZEROS_REGEX, "")
      .replace(TRAILING_DOT_REGEX, "");
  }
  if (amount >= 0.01) {
    return amount
      .toFixed(3)
      .replace(TRAILING_ZEROS_REGEX, "")
      .replace(TRAILING_DOT_REGEX, "");
  }
  return amount
    .toFixed(4)
    .replace(TRAILING_ZEROS_REGEX, "")
    .replace(TRAILING_DOT_REGEX, "");
};

// Format USD amount
const formatUsd = (amount: number) => {
  if (amount < 1) {
    return amount.toFixed(2);
  }
  if (amount < 10) {
    return amount.toFixed(1);
  }
  return Math.round(amount).toString();
};

export function TipForm({
  artistName,
  ensName,
  artistAvatar,
  artistBio,
  artistAddress,
}: TipFormProps) {
  const { address: userAddress } = useAccount();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    PRESET_AMOUNTS[3] // Default to 0.01 ETH
  );
  const [customAmount, setCustomAmount] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const { ethPrice, isLoading: isPriceLoading } = useEthPrice();
  const { sendEth, isPending, isSuccess, hash } = useSendEth({
    onSuccess: () => {
      toast.success(`Tip sent to ${artistName}!`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send tip");
    },
  });

  // Calculate ETH amount based on selection
  const ethAmount = customAmount || selectedPreset?.toString() || "0";
  const ethAmountNum = Number.parseFloat(ethAmount);
  const usdAmount = ethAmountNum * (ethPrice ?? 0);

  // EIP-681 format: ethereum:<address>@<chainId>
  // ChainId 8453 = Base mainnet
  const qrValue = `ethereum:${artistAddress}@8453`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(artistAddress);
      setCopiedAddress(true);
      toast.success("Address copied!");
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy");
    }
  };

  const handleSend = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (ethAmountNum <= 0) {
      toast.error("Please enter an amount");
      return;
    }
    await sendEth({
      to: artistAddress,
      amount: ethAmount,
    });
  };

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-success/20">
          <Check className="size-10 text-success" />
        </div>

        <h2 className="mb-2 font-bold text-2xl">Tip Sent!</h2>
        <p className="mb-6 text-muted-foreground">
          {ethAmount} ETH sent to {artistName}
        </p>

        <div className="space-y-3">
          {hash && (
            <a
              className="flex items-center justify-center gap-2 text-brand text-sm hover:underline"
              href={`https://basescan.org/tx/${hash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View transaction <ExternalLink className="size-3" />
            </a>
          )}

          <Button
            className="w-full"
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Send Another Tip
          </Button>
        </div>
      </Card>
    );
  }

  // Main tip form
  return (
    <Card className="w-full max-w-md p-6">
      {/* Artist Info */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex justify-center">
          <ArtistAvatar avatarUrl={artistAvatar} name={artistName} size="sm" />
        </div>

        <h1 className="mb-2 font-bold text-2xl">Tip {artistName}</h1>
        <p className="mb-1 text-brand text-sm">{ensName}</p>
        {artistBio && (
          <p className="text-muted-foreground text-sm">{artistBio}</p>
        )}
      </div>

      {/* Amount Selection */}
      <div className="mb-4 space-y-3">
        <Label>Select Amount</Label>

        {/* Preset amounts */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
          {PRESET_AMOUNTS.map((preset) => {
            // Calculate USD value for this preset
            const presetUsdValue = preset * (ethPrice ?? 0);

            return (
              <button
                className={`flex flex-col items-center justify-center rounded-lg border px-3 py-3 transition-colors ${
                  selectedPreset === preset && !customAmount
                    ? "border-brand bg-brand/20 text-brand"
                    : "border-border hover:bg-accent"
                }`}
                key={preset}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomAmount("");
                }}
                type="button"
              >
                <span className="font-semibold text-sm">
                  {formatEth(preset)} ETH
                </span>
                {(() => {
                  if (isPriceLoading) {
                    return (
                      <span className="mt-0.5 text-muted-foreground text-xs">
                        ...
                      </span>
                    );
                  }
                  if (ethPrice) {
                    return (
                      <span className="mt-0.5 text-muted-foreground text-xs">
                        ~${formatUsd(presetUsdValue)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </button>
            );
          })}
        </div>

        {/* Custom amount */}
        <div className="space-y-2">
          <Label htmlFor="custom">Custom Amount (ETH)</Label>
          <Input
            id="custom"
            min="0"
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedPreset(null);
            }}
            placeholder="0.1"
            step="0.001"
            type="number"
            value={customAmount}
          />
        </div>

        {/* Amount display */}
        {ethAmountNum > 0 && (
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-muted-foreground text-sm">You're sending</p>
            <p className="mt-1 font-bold text-xl">
              {formatEth(ethAmountNum)} ETH
            </p>
            {(() => {
              if (isPriceLoading) {
                return <Skeleton className="mx-auto mt-1 h-4 w-20" />;
              }
              if (ethPrice) {
                return (
                  <p className="mt-1 text-muted-foreground text-xs">
                    ~${formatUsd(usdAmount)}
                  </p>
                );
              }
              return (
                <p className="mt-1 text-muted-foreground text-xs">
                  Price unavailable
                </p>
              );
            })()}
          </div>
        )}
      </div>

      {/* Send button */}
      {userAddress ? (
        <Button
          className="w-full"
          disabled={isPending || ethAmountNum <= 0}
          onClick={handleSend}
          size="lg"
        >
          {isPending ? (
            "Sending..."
          ) : (
            <>
              Send {formatEth(ethAmountNum)} ETH
              {ethPrice && ` (~$${formatUsd(usdAmount)})`}
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <AppKitButton size="md" />
          <p className="text-center text-muted-foreground text-xs">
            Connect your wallet to send a tip
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-4 text-center text-muted-foreground text-xs uppercase tracking-wide">
        Tips sent directly to artist
      </p>

      {/* QR Code Section - At bottom of form */}
      <div className="mt-6 overflow-hidden border-2 border-border bg-card">
        {/* Header */}
        <div className="flex items-center gap-2 border-border border-b-2 bg-muted px-4 py-3">
          <QrCode className="h-4 w-4" strokeWidth={2.5} />
          <span className="font-bold text-foreground text-sm uppercase tracking-wide">
            Wallet QR Code
          </span>
          <Sparkles className="ml-auto h-3 w-3" strokeWidth={2.5} />
        </div>

        {/* QR Code Content */}
        <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:gap-6">
          {/* QR Code */}
          <div className="relative flex-shrink-0">
            <div className="relative border-2 border-border bg-white p-3 shadow-md">
              <Cuer color="black" size={120} value={qrValue} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <p className="font-medium text-foreground text-sm">
                Direct wallet transfer
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                Scan with your crypto wallet to send ETH on Base
              </p>
            </div>

            {/* ENS Name */}
            <div className="rounded-lg border border-border/50 bg-background/50 px-3 py-2">
              <p className="font-medium text-brand text-xs uppercase tracking-wide">
                {ensName}
              </p>
            </div>

            {/* Wallet Address with copy */}
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2">
              <span className="flex-1 truncate font-mono text-muted-foreground text-xs">
                {formatAddress(artistAddress, 6, 4)}
              </span>
              <Button
                className="h-6 w-6 shrink-0"
                onClick={handleCopyAddress}
                size="icon"
                variant="ghost"
              >
                {copiedAddress ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
