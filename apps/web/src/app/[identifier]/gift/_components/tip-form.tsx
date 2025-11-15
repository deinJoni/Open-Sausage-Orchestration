"use client";

import { Cuer } from "cuer";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ArtistAvatar } from "@/components/artist-avatar";
import { PortoConnectButton } from "@/components/porto-connect-button";
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

const PRESET_AMOUNTS = [0.01, 0.05, 0.1, 0.5];

export function TipForm({
  artistName,
  ensName,
  artistAvatar,
  artistBio,
  artistAddress,
}: TipFormProps) {
  const { address: userAddress } = useAccount();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0.1);
  const [customAmount, setCustomAmount] = useState("");
  const [copiedENS, setCopiedENS] = useState(false);
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

  const ethAmount = customAmount || selectedPreset?.toString() || "0";
  const ethAmountNum = Number.parseFloat(ethAmount);
  const usdAmount = ethAmountNum * (ethPrice ?? 0);

  // EIP-681 format: ethereum:<address>@<chainId>
  // ChainId 8453 = Base mainnet
  const qrValue = `ethereum:${artistAddress}@8453`;

  const handleCopyENS = async () => {
    try {
      await navigator.clipboard.writeText(ensName);
      setCopiedENS(true);
      toast.success("ENS name copied!");
      setTimeout(() => setCopiedENS(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy");
    }
  };

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
        <Label>Select Amount (ETH)</Label>

        {/* Preset amounts */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              className={`rounded-lg border py-3 font-semibold transition-colors ${
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
              {preset}
            </button>
          ))}
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
            <p className="mt-1 font-bold text-xl">{ethAmount} ETH</p>
            {isPriceLoading ? (
              <Skeleton className="mx-auto mt-1 h-4 w-20" />
            ) : (
              <p className="mt-1 text-muted-foreground text-xs">
                {ethPrice
                  ? `~$${usdAmount.toFixed(2)} USD`
                  : "Price unavailable"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* QR Code Section */}
      <div className="space-y-3">
        <div className="flex justify-center rounded-lg bg-white p-4">
          <Cuer color="black" size={150} value={qrValue} />
        </div>

        {/* ENS Name with copy */}
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted p-3">
          <p className="flex-1 text-center font-medium text-brand text-xs uppercase tracking-wide">
            {ensName}
          </p>
          <Button
            className="size-8 shrink-0"
            onClick={handleCopyENS}
            size="icon"
            variant="ghost"
          >
            {copiedENS ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>

        {/* Wallet Address with copy */}
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted p-3">
          <p className="flex-1 text-center font-mono text-muted-foreground text-xs">
            {formatAddress(artistAddress, 10, 10)}
          </p>
          <Button
            className="size-8 shrink-0"
            onClick={handleCopyAddress}
            size="icon"
            variant="ghost"
          >
            {copiedAddress ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>

        <p className="text-center text-muted-foreground text-xs">
          Scan with your mobile wallet to send a tip on Base
        </p>
      </div>

      {/* Send button */}
      {userAddress ? (
        <Button
          className="w-full"
          disabled={isPending || ethAmountNum <= 0}
          onClick={handleSend}
          size="lg"
        >
          {isPending ? "Sending..." : `Send ${ethAmount} ETH`}
        </Button>
      ) : (
        <div className="space-y-3">
          <PortoConnectButton className="w-full" />
          <p className="text-center text-muted-foreground text-xs">
            Connect your wallet to send a tip
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-4 text-center text-muted-foreground text-xs">
        💸 Tips sent directly to artist
      </p>
    </Card>
  );
}
