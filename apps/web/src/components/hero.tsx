"use client";

import { ConnectButton } from "./connect-button";

export function Hero() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 text-6xl">🎵</div>
      <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text font-bold text-7xl text-transparent">
        OSOPIT
      </h1>
      <p className="mb-2 font-semibold text-2xl text-zinc-300">
        Tip artists. Support music.
      </p>
      <p className="mb-12 text-lg text-zinc-400">Built on Ethereum.</p>
      <ConnectButton
        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-8 text-lg hover:from-purple-600 hover:to-fuchsia-600"
        size="lg"
      />
    </div>
  );
}
