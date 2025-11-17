import { base } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import {
  coinbaseWallet,
  injected,
  porto,
  walletConnect,
} from "wagmi/connectors";
import { env } from "../env";

// Get projectId from environment
export const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [base];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    porto({
      merchantUrl: "/api/porto/merchant",
    }),
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({
      appName: "Osopit",
      appLogoUrl: "https://osopit.com/icon.png",
    }),
  ],
  ssr: true,
  projectId,
  networks,
});

declare module "wagmi" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: <TODO>
  interface Register {
    config: typeof wagmiAdapter.wagmiConfig;
  }
}
