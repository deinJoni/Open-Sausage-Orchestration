"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { useAccount, useDisconnect, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckSubdomainAvailability } from "@/hooks/use-check-subdomain-availability";
import { useGenerateInvite } from "@/hooks/use-generate-profile";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import {
  ADDRESS_PREFIX_LENGTH,
  ADDRESS_SUFFIX_LENGTH,
  ADDRESSES,
  DEBOUNCE_TIME,
  SUBDOMAIN_VALIDATION,
  TIME,
} from "@/lib/constants";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";
import { parseContractError } from "@/lib/parse-contract-error";

export default function InvitePage() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const isPorto = connector?.name === "Porto";

  const [label, setLabel] = useState("");
  const [expirationDays, setExpirationDays] = useState(
    String(TIME.DEFAULT_INVITE_EXPIRATION_DAYS)
  );
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const generateInvite = useGenerateInvite();

  // Debounce label to avoid excessive queries while typing
  const [debouncedLabel] = useDebounceValue(label, DEBOUNCE_TIME);

  // Check if subdomain is available
  const { isAvailable, error: availabilityError } =
    useCheckSubdomainAvailability(debouncedLabel);

  // Track if we're waiting for debounced value to update
  const isChecking = label !== debouncedLabel && label.length > 0;

  // Check if connected wallet is a whitelisted inviter
  const { data: isInviter, isLoading: isCheckingInviter } = useReadContract({
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    functionName: "inviters",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const validateLabel = (value: string): string | null => {
    // Check length
    if (value.length < SUBDOMAIN_VALIDATION.MIN_LENGTH) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_SHORT;
    }
    if (value.length > SUBDOMAIN_VALIDATION.MAX_LENGTH) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_LONG;
    }

    // Check character pattern (only lowercase letters, numbers, hyphens)
    if (!SUBDOMAIN_VALIDATION.PATTERN.test(value)) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.INVALID_CHARS;
    }

    // Check edge cases (cannot start or end with hyphen)
    if (value.startsWith("-") || value.endsWith("-")) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.INVALID_EDGES;
    }

    return null;
  };

  const handleLabelChange = (value: string) => {
    const lowercased = value.toLowerCase();
    setLabel(lowercased);
    const error = validateLabel(lowercased);
    setValidationError(error);
  };

  const getAvailabilityMessage = () => {
    if (validationError) {
      return <p className="mt-1 text-red-400 text-xs">{validationError}</p>;
    }

    if (!label || label.length === 0) {
      return (
        <p className="mt-1 text-xs text-zinc-500">
          The subname to invite someone to register
        </p>
      );
    }

    if (availabilityError) {
      return (
        <p className="mt-1 text-xs text-yellow-400">
          ⚠️ Unable to check availability - subgraph error
        </p>
      );
    }

    if (isChecking) {
      return (
        <p className="mt-1 text-xs text-zinc-400">Checking availability...</p>
      );
    }

    if (isAvailable === false) {
      return (
        <p className="mt-1 text-red-400 text-xs">
          ✗ This subdomain is already taken
        </p>
      );
    }

    if (isAvailable === true) {
      return (
        <p className="mt-1 text-green-400 text-xs">
          ✓ This subdomain is available
        </p>
      );
    }

    return null;
  };

  const handleGenerateInvite = () => {
    if (!(address && label)) {
      return;
    }

    // Validate label one more time
    const error = validateLabel(label);
    if (error) {
      toast.error(error);
      return;
    }

    // Call mutation with input data
    generateInvite.mutate(
      { label, expirationDays, recipientAddress: ADDRESSES.ZERO },
      {
        onSuccess: (inviteUrl) => {
          setGeneratedInvite(inviteUrl);
          toast.success("Invite generated successfully!");
        },
        onError: (inviteError) => {
          toast.error(parseContractError(inviteError));
        },
      }
    );
  };

  const handleCopyInvite = async () => {
    if (generatedInvite) {
      await navigator.clipboard.writeText(generatedInvite);
      toast.success("Invite URL copied to clipboard!");
    }
  };

  const handleReset = () => {
    setGeneratedInvite(null);
    setLabel("");
    setExpirationDays(String(TIME.DEFAULT_INVITE_EXPIRATION_DAYS));
  };

  // Show switch wallet message if connected with Porto
  if (isPorto) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">
            Switch Wallet Required
          </h1>
          <div className="mb-6 space-y-4">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="mb-2 text-sm text-yellow-400">
                ⚠️ You're connected with Porto wallet
              </p>
              <p className="text-xs text-zinc-400">
                Porto is for artists only. To generate invites, please
                disconnect and connect with your authorized inviter wallet
                (MetaMask, WalletConnect, etc.)
              </p>
            </div>
            <p className="text-sm text-zinc-500">
              Connected: {address?.slice(0, ADDRESS_PREFIX_LENGTH)}...
              {address?.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => disconnect()}
              size="lg"
              variant="outline"
            >
              Disconnect Porto
            </Button>
            <appkit-button size="md" />
          </div>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">
            Generate Invites
          </h1>
          <p className="mb-6 text-zinc-400">
            Connect your wallet to generate invite codes
          </p>
          <appkit-button size="md" />
        </Card>
      </div>
    );
  }

  if (isCheckingInviter) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <p className="text-zinc-400">Checking permissions...</p>
      </div>
    );
  }

  if (!isInviter) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">Unauthorized</h1>
          <p className="mb-4 text-zinc-400">
            Your wallet is not authorized to generate invites.
          </p>
          <p className="text-sm text-zinc-500">
            Connected as: {address?.slice(0, ADDRESS_PREFIX_LENGTH)}...
            {address?.slice(-ADDRESS_SUFFIX_LENGTH)}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl text-white">Generate Invites</h1>
        <p className="text-zinc-400">
          Create invite codes for new artists to join osopit
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">
        {generatedInvite ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <p className="mb-2 font-medium text-green-400 text-sm">
                ✓ Invite Generated Successfully
              </p>
              <p className="text-xs text-zinc-400">
                Share this URL with the person you want to invite
              </p>
            </div>

            <div>
              <Label>Invite URL</Label>
              <div className="mt-2 break-all rounded-md border border-zinc-700 bg-zinc-800 p-3 font-mono text-xs text-zinc-300">
                {generatedInvite}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                onClick={handleCopyInvite}
              >
                Copy URL
              </Button>
              <Button
                className="flex-1"
                onClick={handleReset}
                variant="outline"
              >
                Generate Another
              </Button>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
              <p className="mb-2 font-medium text-sm text-zinc-300">
                Invite Details
              </p>
              <div className="space-y-1 text-xs text-zinc-400">
                <p>
                  <span className="text-zinc-500">Subdomain:</span> {label}
                  .osopit.eth
                </p>
                <p>
                  <span className="text-zinc-500">Expires in:</span>{" "}
                  {expirationDays} days
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label htmlFor="label">Subdomain</Label>
              <div className="relative mt-2">
                <Input
                  className="pr-32"
                  id="label"
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="alice"
                  type="text"
                  value={label}
                />
                <span className="-translate-y-1/2 absolute top-1/2 right-3 text-sm text-zinc-500">
                  .osopit.eth
                </span>
              </div>
              {getAvailabilityMessage()}
            </div>

            <div>
              <Label htmlFor="expiration">Expiration</Label>
              <select
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                id="expiration"
                onChange={(e) => setExpirationDays(e.target.value)}
                value={expirationDays}
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
              <p className="mt-1 text-xs text-zinc-500">
                How long the invite will be valid
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              disabled={
                !label ||
                generateInvite.isPending ||
                !!validationError ||
                isAvailable === false
              }
              onClick={handleGenerateInvite}
            >
              {generateInvite.isPending ? "Generating..." : "Generate Invite"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
