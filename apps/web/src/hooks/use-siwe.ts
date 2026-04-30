"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiweMessage } from "siwe";
import { toast } from "sonner";
import { useAccount, useChainId, useSignMessage } from "wagmi";

const SESSION_KEY = ["siwe", "session"] as const;

type SessionResponse = { wallet: string | null };

async function fetchSession(): Promise<SessionResponse> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) {
    return { wallet: null };
  }
  return (await res.json()) as SessionResponse;
}

async function fetchNonce(): Promise<string> {
  const res = await fetch("/api/auth/nonce", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch nonce");
  }
  const data = (await res.json()) as { nonce: string };
  return data.nonce;
}

export function useSiwe() {
  const account = useAccount();
  const chainId = useChainId();
  const signMessage = useSignMessage();
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchSession,
    staleTime: 30_000,
  });

  const signIn = useMutation({
    mutationFn: async () => {
      if (!account.address) {
        throw new Error("Connect your wallet first");
      }
      const nonce = await fetchNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: account.address,
        statement: "Sign in to Osopit",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
      });
      const prepared = message.prepareMessage();
      const signature = await signMessage.signMessageAsync({
        message: prepared,
      });
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prepared, signature }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Sign-in failed: ${body}`);
      }
      const data = (await res.json()) as { wallet: string };
      return data.wallet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      toast.success("Signed in");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
    },
  });

  const wallet = sessionQuery.data?.wallet ?? null;
  const isAuthenticated = Boolean(wallet);
  const isWalletMatched =
    isAuthenticated && account.address?.toLowerCase() === wallet?.toLowerCase();

  return {
    wallet,
    isAuthenticated,
    isWalletMatched,
    isLoading: sessionQuery.isLoading,
    signIn: signIn.mutate,
    signInAsync: signIn.mutateAsync,
    signOut: signOut.mutate,
    isSigningIn: signIn.isPending,
    isSigningOut: signOut.isPending,
  };
}
