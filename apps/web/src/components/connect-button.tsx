"use client";

import { type ComponentProps, useState } from "react";
import {
  type Connector,
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
} from "wagmi";
import { formatAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const COPIED_TIMEOUT_MS = 2000;

type ConnectButtonProps = {
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

export function ConnectButton({ size = "sm", className }: ConnectButtonProps) {
  const account = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const connectors = useConnectors();
  const [copied, setCopied] = useState(false);

  if (account.isConnected && account.address) {
    const address = account.address;
    const handleCopy = async () => {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    };
    return (
      <div className="flex items-center gap-2">
        <Button
          className={className}
          onClick={handleCopy}
          size={size}
          variant="outline"
        >
          {copied ? "✓ Copied!" : formatAddress(address)}
        </Button>
        <Button
          onClick={() => disconnect.disconnect()}
          size={size}
          variant="outline"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  const injectedConnectors = connectors.filter((c) => c.type === "injected");

  if (injectedConnectors.length === 0) {
    return (
      <Button className={className} disabled size={size} variant="outline">
        No wallet detected
      </Button>
    );
  }

  if (injectedConnectors.length === 1) {
    const connector = injectedConnectors[0];
    return (
      <Button
        className={className}
        onClick={() => connect.connect({ connector })}
        size={size}
        variant="outline"
      >
        {connect.isPending ? "Connecting..." : `Connect ${connector.name}`}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} size={size} variant="outline">
          {connect.isPending ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {injectedConnectors.map((connector) => (
          <DropdownMenuItem
            key={connector.uid}
            onSelect={() => connect.connect({ connector })}
          >
            <ConnectorIcon connector={connector} />
            <span>{connector.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ConnectorIcon({ connector }: { connector: Connector }) {
  if (!connector.icon) {
    return <div className="size-5 rounded bg-muted" />;
  }
  return (
    // biome-ignore lint/performance/noImgElement: data: URI from EIP-6963
    <img
      alt={`${connector.name} icon`}
      className="rounded"
      height={20}
      src={connector.icon}
      width={20}
    />
  );
}
