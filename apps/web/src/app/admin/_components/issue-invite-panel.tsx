"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerateInvite } from "@/hooks/use-generate-profile";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import {
  ADDRESSES,
  DEBOUNCE_TIME,
  SUBDOMAIN_VALIDATION,
  TIME,
} from "@/lib/constants";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";
import { getEnsConfig } from "@/lib/ens-config";
import { parseContractError } from "@/lib/parse-contract-error";

export function IssueInvitePanel() {
  const account = useAccount();
  const generateInvite = useGenerateInvite();

  const [label, setLabel] = useState("");
  const [expirationDays, setExpirationDays] = useState(
    String(TIME.DEFAULT_INVITE_EXPIRATION_DAYS)
  );
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [debouncedLabel] = useDebounceValue(label, DEBOUNCE_TIME);

  const availabilityQuery = useReadContract({
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    functionName: "available",
    args:
      debouncedLabel && debouncedLabel.length > 0
        ? [debouncedLabel]
        : undefined,
    query: {
      enabled: !!debouncedLabel && debouncedLabel.length > 0,
    },
  });

  const isChecking = label !== debouncedLabel && label.length > 0;

  const validateLabel = (value: string): string | null => {
    if (value.length < SUBDOMAIN_VALIDATION.MIN_LENGTH) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_SHORT;
    }
    if (value.length > SUBDOMAIN_VALIDATION.MAX_LENGTH) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_LONG;
    }
    if (!SUBDOMAIN_VALIDATION.PATTERN.test(value)) {
      return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.INVALID_CHARS;
    }
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
      return <p className="mt-1 text-destructive text-xs">{validationError}</p>;
    }
    if (!label || label.length === 0) {
      return (
        <p className="mt-1 text-muted-foreground text-xs">
          The subname to invite someone to register
        </p>
      );
    }
    if (availabilityQuery.isError) {
      return (
        <p className="mt-1 text-warning text-xs">
          ⚠️ Unable to check availability - subgraph error
        </p>
      );
    }
    if (isChecking) {
      return (
        <p className="mt-1 text-muted-foreground text-xs">
          Checking availability...
        </p>
      );
    }
    if (availabilityQuery.data === false) {
      return (
        <p className="mt-1 text-destructive text-xs">
          ✗ This subdomain is already taken
        </p>
      );
    }
    if (availabilityQuery.data === true) {
      return (
        <p className="mt-1 text-success text-xs">
          ✓ This subdomain is available
        </p>
      );
    }
    return null;
  };

  const handleGenerateInvite = () => {
    if (!(account.address && label)) {
      return;
    }
    const error = validateLabel(label);
    if (error) {
      toast.error(error);
      return;
    }
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

  return (
    <Card className="border-border bg-background/80 p-8 backdrop-blur">
      <div className="mb-6">
        <h2 className="mb-1 font-bold text-foreground text-xl">
          Issue Invite Code
        </h2>
        <p className="text-muted-foreground text-sm">
          Generate an invite URL for a new artist to register a subdomain
        </p>
      </div>

      {generatedInvite ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-success/20 bg-success/10 p-4">
            <p className="mb-2 font-medium text-md text-success">
              ✓ Invite Generated Successfully
            </p>
            <p className="text-muted-foreground text-xs">
              Share this URL with the person you want to invite
            </p>
          </div>

          <div>
            <Label>Invite URL</Label>
            <div className="mt-2 break-all rounded-md border border-border bg-background p-3 font-mono text-foreground text-xs">
              {generatedInvite}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleCopyInvite}>
              Copy URL
            </Button>
            <Button className="flex-1" onClick={handleReset} variant="outline">
              Generate Another
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-background/80 p-4">
            <p className="mb-2 font-medium text-foreground text-md">
              Invite Details
            </p>
            <div className="space-y-1 text-muted-foreground text-xs">
              <p>
                <span className="text-muted-foreground">Subdomain:</span>{" "}
                {label}.{getEnsConfig().domain}
              </p>
              <p>
                <span className="text-muted-foreground">Expires in:</span>{" "}
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
              <span className="-translate-y-1/2 absolute top-1/2 right-3 text-md text-muted-foreground">
                .{getEnsConfig().domain}
              </span>
            </div>
            {getAvailabilityMessage()}
          </div>

          <div>
            <Label htmlFor="expiration">Expiration</Label>
            <select
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-md focus:border-brand focus:outline-none"
              id="expiration"
              onChange={(e) => setExpirationDays(e.target.value)}
              value={expirationDays}
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
            <p className="mt-1 text-muted-foreground text-xs">
              How long the invite will be valid
            </p>
          </div>

          <Button
            className="w-full"
            disabled={
              !label ||
              generateInvite.isPending ||
              !!validationError ||
              availabilityQuery.data === false
            }
            onClick={handleGenerateInvite}
          >
            {generateInvite.isPending ? "Generating..." : "Generate Invite"}
          </Button>
        </div>
      )}
    </Card>
  );
}
