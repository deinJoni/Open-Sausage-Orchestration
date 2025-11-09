"use client";

import { AppKitProvider } from "./appkit-provider";
import { ColorThemeProvider } from "./color-theme-provider";
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
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <ColorThemeProvider>
          {children}
          <Toaster richColors />
        </ColorThemeProvider>
      </ThemeProvider>
    </AppKitProvider>
  );
}
