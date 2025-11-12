import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import { headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Providers from "@/components/providers";
import { ThemeSwitcher } from "@/components/theme-switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "osopit",
  description: "osopit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Providers cookies={cookies}>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <main className="flex-1">{children}</main>
              {/* Fixed theme switcher - accessible from all pages */}
              <div className="fixed right-4 bottom-4 z-50">
                <ThemeSwitcher />
              </div>
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
