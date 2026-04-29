"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEthPrice } from "@/hooks/use-eth-price";
import { useSendEth } from "@/hooks/use-send-eth";

type SendMoneySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userBalance: number; // ETH balance
};

type Step = "recipient" | "amount" | "confirm" | "success";

type StepMetadata = {
  title: string;
  getDescription: (recipient?: string) => string;
};

const STEP_METADATA: Record<Step, StepMetadata> = {
  recipient: {
    title: "Send Money",
    getDescription: () => "Enter an ENS name or wallet address",
  },
  amount: {
    title: "Choose Amount",
    getDescription: (recipient) => `Sending to ${recipient}`,
  },
  confirm: {
    title: "Confirm",
    getDescription: () => "Review your transaction",
  },
  success: {
    title: "Sent!",
    getDescription: () => "Your payment was sent successfully",
  },
};

export function SendMoneySheet({
  open,
  onOpenChange,
  userBalance,
}: SendMoneySheetProps) {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const { sendEth, isPending, hash } = useSendEth({
    onSuccess: (_hash) => {
      setStep("success");
      toast.success("Transaction sent!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send transaction");
    },
  });

  const { ethPrice } = useEthPrice();
  const selectedAmount = customAmount || amount;
  const amountNum = Number.parseFloat(selectedAmount) || 0;

  const handleReset = () => {
    setStep("recipient");
    setRecipient("");
    setAmount("");
    setCustomAmount("");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleSend = async () => {
    if (ethPrice === null) {
      toast.error("Price feed unavailable. Try again in a moment.");
      return;
    }
    try {
      await sendEth({
        to: recipient,
        amount: (amountNum / ethPrice).toFixed(6), // Convert USD to ETH
      });
    } catch (_error) {
      // Error handled in hook
    }
  };

  const isValidRecipient = recipient.endsWith(".eth") || isAddress(recipient);
  const isValidAmount =
    ethPrice !== null && amountNum > 0 && amountNum <= userBalance * ethPrice;

  const stepMeta = STEP_METADATA[step];

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>{stepMeta.title}</DrawerTitle>
          <DrawerDescription>
            {stepMeta.getDescription(recipient)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto w-full max-w-sm space-y-6 p-6 pb-8">
          {step === "recipient" && (
            <RecipientStep
              isValidRecipient={isValidRecipient}
              onNext={() => setStep("amount")}
              recipient={recipient}
              setRecipient={setRecipient}
            />
          )}

          {step === "amount" && (
            <AmountStep
              amount={amount}
              amountNum={amountNum}
              customAmount={customAmount}
              ethPriceUSD={ethPrice}
              isValidAmount={isValidAmount}
              onBack={() => setStep("recipient")}
              onNext={() => setStep("confirm")}
              selectedAmount={selectedAmount}
              setAmount={setAmount}
              setCustomAmount={setCustomAmount}
            />
          )}

          {step === "confirm" && (
            <ConfirmStep
              amountNum={amountNum}
              ethPriceUSD={ethPrice}
              isPending={isPending}
              onBack={() => setStep("amount")}
              onSend={handleSend}
              recipient={recipient}
              selectedAmount={selectedAmount}
            />
          )}

          {step === "success" && (
            <SuccessStep
              hash={hash}
              onClose={handleClose}
              recipient={recipient}
              selectedAmount={selectedAmount}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type RecipientStepProps = {
  recipient: string;
  setRecipient: (value: string) => void;
  isValidRecipient: boolean;
  onNext: () => void;
};

function RecipientStep({
  recipient,
  setRecipient,
  isValidRecipient,
  onNext,
}: RecipientStepProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Input
          autoFocus
          id="recipient"
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="name.eth or 0x..."
          value={recipient}
        />
        {recipient && !isValidRecipient && (
          <p className="text-destructive text-sm">
            Invalid ENS name or address
          </p>
        )}
      </div>

      <Button
        className="w-full"
        disabled={!isValidRecipient}
        onClick={onNext}
        size="lg"
      >
        Next
      </Button>
    </>
  );
}

type AmountStepProps = {
  amount: string;
  customAmount: string;
  setAmount: (value: string) => void;
  setCustomAmount: (value: string) => void;
  selectedAmount: string;
  amountNum: number;
  ethPriceUSD: number | null;
  isValidAmount: boolean;
  onBack: () => void;
  onNext: () => void;
};

function AmountStep({
  amount,
  customAmount,
  setAmount,
  setCustomAmount,
  selectedAmount,
  amountNum,
  ethPriceUSD,
  isValidAmount,
  onBack,
  onNext,
}: AmountStepProps) {
  const PRESET_USD_AMOUNTS = [5, 10, 20, 50];

  return (
    <>
      <Button className="mb-4" onClick={onBack} size="sm" variant="ghost">
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {PRESET_USD_AMOUNTS.map((usdAmount) => (
            <button
              className={`rounded-lg border py-3 font-medium transition-colors ${
                amount === usdAmount.toString() && !customAmount
                  ? "border-brand bg-brand/20 text-brand"
                  : "border-border hover:bg-accent"
              }`}
              key={usdAmount}
              onClick={() => {
                setAmount(usdAmount.toString());
                setCustomAmount("");
              }}
              type="button"
            >
              ${usdAmount}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom">Custom Amount (USD)</Label>
          <Input
            id="custom"
            min="0"
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={customAmount}
          />
        </div>

        {selectedAmount && (
          <div className="rounded-lg bg-muted p-4 text-center text-sm">
            <p className="text-muted-foreground">You're sending</p>
            <p className="mt-1 font-bold text-2xl">${selectedAmount}</p>
            <p className="mt-1 text-muted-foreground text-xs">
              {ethPriceUSD === null
                ? "Loading price…"
                : `~${(amountNum / ethPriceUSD).toFixed(6)} ETH`}
            </p>
          </div>
        )}

        <Button
          className="w-full"
          disabled={!isValidAmount}
          onClick={onNext}
          size="lg"
        >
          Next
        </Button>

        {!isValidAmount && amountNum > 0 && ethPriceUSD !== null && (
          <p className="text-center text-destructive text-sm">
            Insufficient balance
          </p>
        )}
        {ethPriceUSD === null && (
          <p className="text-center text-muted-foreground text-sm">
            Waiting for ETH price…
          </p>
        )}
      </div>
    </>
  );
}

type ConfirmStepProps = {
  recipient: string;
  selectedAmount: string;
  amountNum: number;
  ethPriceUSD: number | null;
  isPending: boolean;
  onBack: () => void;
  onSend: () => void;
};

function ConfirmStep({
  recipient,
  selectedAmount,
  amountNum,
  ethPriceUSD,
  isPending,
  onBack,
  onSend,
}: ConfirmStepProps) {
  return (
    <>
      <Button className="mb-4" onClick={onBack} size="sm" variant="ghost">
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="space-y-4">
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">To</span>
            <span className="font-mono text-sm">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Amount</span>
            <div className="text-right">
              <p className="font-semibold">${selectedAmount}</p>
              <p className="text-muted-foreground text-xs">
                {ethPriceUSD === null
                  ? "Loading price…"
                  : `~${(amountNum / ethPriceUSD).toFixed(6)} ETH`}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={isPending || ethPriceUSD === null}
          onClick={onSend}
          size="lg"
        >
          {isPending ? "Sending..." : "Confirm & Send"}
        </Button>
      </div>
    </>
  );
}

type SuccessStepProps = {
  selectedAmount: string;
  recipient: string;
  hash: `0x${string}` | undefined;
  onClose: () => void;
};

function SuccessStep({
  selectedAmount,
  recipient,
  hash,
  onClose,
}: SuccessStepProps) {
  return (
    <>
      <div className="flex flex-col items-center space-y-4 py-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/20">
          <Check className="size-8 text-success" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">Payment Sent!</p>
          <p className="mt-2 text-muted-foreground text-sm">
            ${selectedAmount} sent to {recipient}
          </p>
        </div>
        {hash && (
          <a
            className="text-brand text-sm hover:underline"
            href={`https://basescan.org/tx/${hash}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View transaction
          </a>
        )}
      </div>

      <Button className="w-full" onClick={onClose} size="lg">
        Done
      </Button>
    </>
  );
}
