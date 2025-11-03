"use client";

import { useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { Button } from "./ui/button";

const COPIED_TIMEOUT_MS = 2000;
const ADDRESS_PREFIX_LENGTH = 6;
const ADDRESS_SUFFIX_LENGTH = 4;

export function ConnectButton() {
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
        <Button onClick={handleCopyAddress} size="sm" variant="outline">
          {copied ? "Copied!" : formatAddress(address)}
        </Button>
        <Button onClick={() => disconnect()} size="sm" variant="ghost">
          Disconnect
        </Button>
      </div>
    );
  }

  const portoConnector = connectors.find((c) => c.name === "Porto");

  if (!portoConnector) {
    return <div>No connector found</div>;
  }

  return (
    <Button
      onClick={() => connect({ connector: portoConnector })}
      size="sm"
      variant="outline"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
