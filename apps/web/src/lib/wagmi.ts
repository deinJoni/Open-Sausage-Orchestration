import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
import { porto } from "wagmi/connectors";
import { env } from "../env";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    porto(),
    walletConnect({
      projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: "Osopit",
        description: "Music NFT platform",
        url: "https://osopit.com",
        icons: ["https://osopit.com/icon.png"],
      },
      showQrModal: true,
    }),
    injected({ target: "metaMask" }),
    coinbaseWallet({
      appName: "Osopit",
      appLogoUrl: "https://osopit.com/icon.png",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});
