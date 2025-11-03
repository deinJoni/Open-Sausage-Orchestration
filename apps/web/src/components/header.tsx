"use client";
import Link from "next/link";
import { ConnectButton } from "./connect-button";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          <Link href="/">Home</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ConnectButton />
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
