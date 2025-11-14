"use client";

import { type ComponentProps, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { getOnboardingPermissions } from "@/lib/onboarding-permissions";
import { Button } from "./ui/button";

const COPIED_TIMEOUT_MS = 2000;
const ADDRESS_PREFIX_LENGTH = 6;
const ADDRESS_SUFFIX_LENGTH = 4;

type PortoConnectButtonProps = {
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

export function PortoConnectButton({
  size = "sm",
  className,
}: PortoConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    }
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, ADDRESS_PREFIX_LENGTH)}...${addr.slice(-ADDRESS_SUFFIX_LENGTH)}`;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={handleCopyAddress} size={size} variant="outline">
          {copied ? "Copied!" : formatAddress(address)}
        </Button>
        <Button onClick={() => disconnect()} size={size} variant="ghost">
          Disconnect
        </Button>
      </div>
    );
  }

  // Debug: Log available connectors
  console.log("[PortoConnectButton] Available connectors:", connectors.map(c => ({
    name: c.name,
    type: c.type,
    id: c.id,
  })));

  const portoConnector = connectors.find((c) => c.name === "Porto");

  console.log("[PortoConnectButton] Porto connector found:", !!portoConnector);
  console.log("[PortoConnectButton] Porto connector details:", portoConnector);

  if (!portoConnector) {
    console.error("[PortoConnectButton] Porto connector not found. Available connectors:", connectors.map(c => c.name));
    return (
      <div className="flex flex-col gap-2">
        <Button disabled size={size} variant="outline" className={className}>
          ⚡ Connect Wallet to Start
        </Button>
        <p className="text-destructive text-xs">
          Porto connector not available. Check console for details.
        </p>
      </div>
    );
  }

  return (
    <Button
      className={className}
      onClick={() => {
        console.log("[PortoConnectButton] Connect button clicked");
        console.log("[PortoConnectButton] Using connector:", portoConnector.name);
        connect({
          connector: portoConnector,
          // @ts-expect-error - TODO: fix this
          capabilities: {
            grantPermissions: getOnboardingPermissions(),
          },
        });
      }}
      size={size}
    >
      {isPending ? "Connecting..." : "⚡ Connect Wallet to Start"}
    </Button>
  );
}
