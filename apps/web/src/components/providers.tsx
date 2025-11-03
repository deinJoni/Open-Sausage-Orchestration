"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { Web3Provider } from "./web3-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </Web3Provider>
  );
}
