"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppKitProvider } from "./appkit-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  return (
    <AppKitProvider cookies={cookies}>
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
    </AppKitProvider>
  );
}
