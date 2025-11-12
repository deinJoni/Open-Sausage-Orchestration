import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import { headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Providers from "@/components/providers";

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
            <div className="flex min-h-screen flex-col bg-[#f8f4ff] text-gray-950">
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
