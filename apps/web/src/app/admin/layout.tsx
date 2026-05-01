"use client";

import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { useIsAdmin } from "@/hooks/use-is-admin";
import {
  CheckingPermissionsGate,
  DisconnectedGate,
  UnauthorizedGate,
} from "./_components/admin-gate";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const account = useAccount();
  const admin = useIsAdmin();

  if (!account.isConnected) {
    return <DisconnectedGate />;
  }

  if (admin.isLoading) {
    return <CheckingPermissionsGate />;
  }

  if (!admin.isInviter) {
    return <UnauthorizedGate address={account.address} />;
  }

  return <>{children}</>;
}
