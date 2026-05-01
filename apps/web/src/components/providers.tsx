"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { Web3Provider } from "./web3-provider";

export default function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  return (
    <Web3Provider cookies={cookies}>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="default"
        disableTransitionOnChange
        enableSystem={false}
        themes={["default"]}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster position="top-right" />
      </ThemeProvider>
    </Web3Provider>
  );
}
