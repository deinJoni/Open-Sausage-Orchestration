import type { Metadata } from "next";
import { Geist_Mono, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "../index.css";
import { headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Header } from "@/components/header";
import Providers from "@/components/providers";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
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
        className={`${hanken.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Providers cookies={cookies}>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              {/* Header - navigation and artist link */}
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
