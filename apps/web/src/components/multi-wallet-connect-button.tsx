"use client";

import { type ComponentProps, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const COPIED_TIMEOUT_MS = 2000;
const ADDRESS_PREFIX_LENGTH = 6;
const ADDRESS_SUFFIX_LENGTH = 4;

type MultiWalletConnectButtonProps = {
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

export function MultiWalletConnectButton({
  size = "sm",
  className,
}: MultiWalletConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // Filter out Porto connector - only show wallets for regular users
  const availableConnectors = connectors.filter((c) => c.name !== "Porto");

  if (availableConnectors.length === 0) {
    return <div>No wallets available</div>;
  }

  const handleConnect = (connectorId: string) => {
    const connector = availableConnectors.find((c) => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className={className} size={size}>
          {isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Choose a wallet</h4>
          <div className="space-y-2">
            {availableConnectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                variant="outline"
                className="w-full justify-start"
                disabled={isPending}
              >
                {connector.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
