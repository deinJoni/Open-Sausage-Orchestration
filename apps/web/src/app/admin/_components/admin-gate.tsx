import { ConnectButton } from "@/components/connect-button";
import { Card } from "@/components/ui/card";
import { ADDRESS_PREFIX_LENGTH, ADDRESS_SUFFIX_LENGTH } from "@/lib/constants";

export function DisconnectedGate() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
      <Card className="w-full border-border bg-background/80 p-8 backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-bold text-2xl text-foreground">Admin</h1>
          <p className="text-muted-foreground text-sm">
            Connect your wallet to access admin tools
          </p>
        </div>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </Card>
    </div>
  );
}

type UnauthorizedGateProps = {
  address: `0x${string}` | undefined;
};

export function UnauthorizedGate({ address }: UnauthorizedGateProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
      <Card className="w-full border-border bg-background/80 p-8 text-center backdrop-blur">
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Unauthorized
        </h1>
        <p className="mb-4 text-muted-foreground">
          Your wallet is not authorized to issue invites.
        </p>
        {address && (
          <p className="text-md text-muted-foreground">
            Connected as: {address.slice(0, ADDRESS_PREFIX_LENGTH)}...
            {address.slice(-ADDRESS_SUFFIX_LENGTH)}
          </p>
        )}
      </Card>
    </div>
  );
}

export function CheckingPermissionsGate() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
      <p className="text-muted-foreground">Checking permissions...</p>
    </div>
  );
}
