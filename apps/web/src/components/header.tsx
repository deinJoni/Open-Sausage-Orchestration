"use client";

import Link from "next/link";
import { useIsAdmin } from "@/hooks/use-is-admin";

export function Header() {
  const admin = useIsAdmin();
  const showAdmin = admin.isInviter;

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Logo block — small bordered mark + italic-serif wordmark */}
        <Link
          className="group flex items-center gap-3 transition-opacity hover:opacity-70"
          href="/"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-sm border border-foreground font-semibold text-[10px] tracking-[0.04em]"
          >
            Os
          </span>
          <span className="font-display text-xl italic leading-none tracking-tight">
            Osopit
          </span>
        </Link>

        {/* Right-side links — terracotta text-link primary, ink ghost for admin */}
        <div className="flex items-center gap-6">
          {showAdmin && (
            <Link
              className="font-semibold text-[11px] text-foreground uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
              href="/admin"
            >
              Admin
            </Link>
          )}
          <Link
            className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-brand uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
            href="/me"
          >
            Artist <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
