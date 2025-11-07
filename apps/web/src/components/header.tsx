"use client";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const { isConnected } = useAccount();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          <Link href="/">Home</Link>
          {isConnected && <Link href="/me">Profile</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <appkit-button />
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
