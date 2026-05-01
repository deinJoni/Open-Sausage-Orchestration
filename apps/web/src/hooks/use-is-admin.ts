"use client";

import { useAccount, useReadContract } from "wagmi";
import { L2RegistrarABI } from "@/lib/abi/l2-registrar";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";

export function useIsAdmin() {
  const account = useAccount();

  const inviterQuery = useReadContract({
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    functionName: "inviters",
    args: account.address ? [account.address] : undefined,
    query: { enabled: !!account.address },
  });

  return {
    address: account.address,
    isInviter: inviterQuery.data === true,
    isLoading: inviterQuery.isLoading,
  };
}
