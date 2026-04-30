import { ArrowRight, Check } from "lucide-react";
import { PortoConnectButton } from "@/components/porto-connect-button";
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
  isPorto: boolean;
  isRegistered: boolean;
  isPending: boolean;
  onClaim: () => void;
  onNext: () => void;
};

export function ClaimSubdomainStep({
  ensName,
  inviteData,
  isPorto,
  isRegistered,
  isPending,
  onClaim,
  onNext,
}: ClaimSubdomainStepProps) {
  return (
    <div className="space-y-6">
      <div className="border-2 border-brand bg-card px-4 py-5 shadow-md">
        <p className="mb-1 font-bold text-brand text-sm uppercase tracking-wide">
          You're invited to claim
        </p>
        <p className="font-mono text-2xl text-brand">
          {ensName}.{getEnsConfig().domain}
        </p>
        <p className="mt-2 text-muted-foreground text-xs">
          Invited by {inviteData.inviter.slice(0, ADDRESS_PREFIX_LENGTH)}...
          {inviteData.inviter.slice(-ADDRESS_SUFFIX_LENGTH)}
        </p>
      </div>

      {!isPorto && (
        <div className="space-y-4 text-center">
          <PortoConnectButton className="mx-auto" size="lg" />
        </div>
      )}

      {isPorto && !isRegistered && !isPending && (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Ready to claim your domain! This won't require any popups.
          </p>
          <Button className="w-full" onClick={onClaim} size="lg">
            Claim {ensName}.{getEnsConfig().domain}
          </Button>
        </div>
      )}

      {isPorto && isPending && (
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-brand" />
          <p className="font-medium text-foreground">Claiming domain...</p>
          <p className="text-muted-foreground text-sm">
            This will only take a moment
          </p>
        </div>
      )}

      {isPorto && isRegistered && (
        <div className="space-y-4">
          <div className="border-2 border-success bg-card px-4 py-5 text-center shadow-md">
            <p className="mb-1 flex items-center justify-center gap-2 font-bold text-sm text-success uppercase tracking-wide">
              <Check className="size-4" strokeWidth={3} />
              Domain Claimed Successfully
            </p>
            <p className="font-mono text-success text-xl">
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
