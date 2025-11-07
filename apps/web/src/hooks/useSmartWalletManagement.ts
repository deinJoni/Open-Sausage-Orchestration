import { useEffect } from "react";
import { useAccount, useConnectors, useDisconnect } from "wagmi";
import { usePathname } from "next/navigation";

/**
 * Smart wallet management hook that auto-disconnects Porto
 * when users leave the onboarding page.
 *
 * This prevents Porto connections from persisting to pages
 * where only regular wallets (MetaMask, WalletConnect, etc.) should be used.
 */
export function useSmartWalletManagement() {
  const pathname = usePathname();
  const { connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  useEffect(() => {
    // Only act when leaving onboarding page
    if (pathname === "/onboarding") {
      return;
    }

    // Check if connected with Porto
    const isPortoConnected =
      isConnected && connector?.name === "Porto";

    if (isPortoConnected) {
      // Auto-disconnect Porto when leaving onboarding
      disconnect();
    }
  }, [pathname, connector, isConnected, disconnect]);

  return {
    isPortoConnected: isConnected && connector?.name === "Porto",
    disconnect,
  };
}
