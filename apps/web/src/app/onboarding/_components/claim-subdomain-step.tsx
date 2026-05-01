import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADDRESS_PREFIX_LENGTH, ADDRESS_SUFFIX_LENGTH } from "@/lib/constants";
import { getEnsConfig } from "@/lib/ens-config";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

type ClaimSubdomainStepProps = {
  ensName: string;
  inviteData: InviteData;
  isRegistered: boolean;
  isPending: boolean;
  onClaim: () => void;
  onNext: () => void;
};

export function ClaimSubdomainStep({
  ensName,
  inviteData,
  isRegistered,
  isPending,
  onClaim,
  onNext,
}: ClaimSubdomainStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-secondary px-5 py-5">
        <p className="mu-eyebrow mb-2 text-brand">You're invited to claim</p>
        <p className="font-mono text-2xl text-foreground">
          {ensName}.{getEnsConfig().domain}
        </p>
        <p className="mt-2 text-muted-foreground text-xs">
          Invited by {inviteData.inviter.slice(0, ADDRESS_PREFIX_LENGTH)}...
          {inviteData.inviter.slice(-ADDRESS_SUFFIX_LENGTH)}
        </p>
      </div>

      {!(isRegistered || isPending) && (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            You'll be asked to sign or confirm in your wallet — gas is usually
            covered.
          </p>
          <Button className="w-full" onClick={onClaim} size="lg">
            Claim {ensName}.{getEnsConfig().domain}
          </Button>
        </div>
      )}

      {isPending && (
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-muted border-t-brand" />
          <p className="font-display text-2xl italic">Claiming subdomain...</p>
          <p className="text-muted-foreground text-sm">
            Sign in your wallet when prompted. This will only take a moment.
          </p>
        </div>
      )}

      {isRegistered && (
        <div className="space-y-4">
          <div className="rounded-md bg-secondary px-5 py-5 text-center">
            <p className="mu-eyebrow mb-2 inline-flex items-center gap-2 text-success">
              <Check className="size-4" strokeWidth={2} />
              Domain Claimed Successfully
            </p>
            <p className="font-mono text-foreground text-xl">
              {ensName}.{getEnsConfig().domain}
            </p>
          </div>
          <Button className="w-full" onClick={onNext} size="lg">
            Next: Setup Your Profile
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
