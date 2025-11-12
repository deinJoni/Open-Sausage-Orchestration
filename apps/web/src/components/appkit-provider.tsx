"use client";

import { base } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { projectId, wagmiAdapter } from "@/lib/appkit";

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    },
  },
});

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Osopit",
  description: "Music NFT platform for artists and fans",
  url: "https://osopit.com",
  icons: ["https://osopit.com/icon.png"],
};

// Create the AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata,
  features: {
    analytics: true,
  },
});

export function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
