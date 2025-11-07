"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { AppKitProvider } from "./appkit-provider";

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
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </AppKitProvider>
  );
}
