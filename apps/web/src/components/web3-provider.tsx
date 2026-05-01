"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
    mutations: {
      onError: (error) => toast.error(`Error: ${error.message}`),
    },
  },
});

type Web3ProviderProps = {
  children: ReactNode;
  cookies: string | null;
};

export function Web3Provider({ children, cookies }: Web3ProviderProps) {
  const initialState = cookieToInitialState(wagmiConfig, cookies);
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
