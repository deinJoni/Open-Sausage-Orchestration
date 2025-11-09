"use client";

import { useState } from "react";
import { useSendTip } from "@/hooks/use-send-tip";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type DonationModalProps = {
  artistEnsName: string;
  onClose: () => void;
};

const ONE_CENT = 0.01;
const ONE_FIFTY_CENTS = 0.5;
const ONE_DOLLAR = 1;
const FIVE_DOLLARS = 5;
const TEN_DOLLARS = 10;
const TWENTY_DOLLARS = 20;
const FIFTY_DOLLARS = 50;
const ONE_HUNDRED_DOLLARS = 100;
const PRESET_AMOUNTS = [
  ONE_CENT,
  ONE_FIFTY_CENTS,
  ONE_DOLLAR,
  FIVE_DOLLARS,
  TEN_DOLLARS,
  TWENTY_DOLLARS,
  FIFTY_DOLLARS,
  ONE_HUNDRED_DOLLARS,
];

export function DonationModal({ artistEnsName, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState("0.01");
  const [customAmount, setCustomAmount] = useState("");
  const { mutate, isPending } = useSendTip();

  const selectedAmount = customAmount || amount;

  const handleSend = async () => {
    await mutate(artistEnsName, selectedAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-md border-border bg-card p-6">
        <div className="mb-6">
          <h3 className="mb-2 font-bold text-white text-xl">
            💜 Send a Gift to {artistEnsName}
          </h3>
          <p className="text-muted-foreground text-sm">
            Support this artist with an ETH tip
          </p>
        </div>

        <div className="mb-6">
          <Label>Select Amount (ETH)</Label>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <button
                className={`rounded-lg border py-3 font-medium transition-colors ${
                  amount === presetAmount.toString() && !customAmount
                    ? "border-brand bg-brand/20 text-brand"
                    : "border-border text-muted-foreground hover:border-border"
                }`}
                key={presetAmount}
                onClick={() => {
                  setAmount(presetAmount.toString());
                  setCustomAmount("");
                }}
                type="button"
              >
                {presetAmount}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Label htmlFor="custom">Custom Amount</Label>
            <Input
              className="mt-2"
              id="custom"
              min="0"
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0.0"
              step="0.001"
              type="number"
              value={customAmount}
            />
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono font-semibold text-white">
                {selectedAmount} ETH
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            disabled={isPending}
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={
              isPending ||
              !selectedAmount ||
              Number.parseFloat(selectedAmount) <= 0
            }
            onClick={handleSend}
            variant="gradient"
          >
            {isPending ? "Sending..." : "Send Gift 💜"}
          </Button>
        </div>

        <p className="mt-4 text-center text-muted-foreground text-xs">
          This will send ETH directly to the artist's wallet
        </p>
      </Card>
    </div>
  );
}
