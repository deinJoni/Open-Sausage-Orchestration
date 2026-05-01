import { createPublicClient, http } from "viem";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  // Bumping the storage key invalidates pre-Porto-removal cookies
  // (which referenced now-removed connectors and caused stub-connector
  // crashes during rehydrate).
  storage: createStorage({ storage: cookieStorage, key: "osopit-wagmi" }),
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

declare module "wagmi" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: required by wagmi module augmentation
  interface Register {
    config: typeof wagmiConfig;
  }
}
