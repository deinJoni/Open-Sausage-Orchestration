import "server-only";

import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { env } from "@/env";

/**
 * Server-side viem clients for the gasless-onboarding relayer.
 *
 * `getRelayerWalletClient()` signs and broadcasts contract calls
 * (registerWithInvite + setNameForAddrWithSignature) on behalf of users
 * whose wallets don't expose paymaster capability.
 *
 * `getRelayerPublicClient()` waits for receipts so we can confirm the
 * register tx lands before submitting the dependent setName tx.
 *
 * Both throw at call-time if `RELAYER_PRIVATE_KEY` is unset — callers must
 * gate on `isRelayerEnabled()` first (the route handler does this).
 */

export function isRelayerEnabled(): boolean {
  return Boolean(env.RELAYER_PRIVATE_KEY);
}

function getRelayerAccount() {
  if (!env.RELAYER_PRIVATE_KEY) {
    throw new Error(
      "RELAYER_PRIVATE_KEY is not set — gasless relayer is disabled."
    );
  }
  return privateKeyToAccount(env.RELAYER_PRIVATE_KEY as `0x${string}`);
}

export function getRelayerWalletClient() {
  return createWalletClient({
    account: getRelayerAccount(),
    chain: base,
    transport: http(),
  });
}

export function getRelayerPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(),
  });
}

export function getRelayerAddress(): `0x${string}` {
  return getRelayerAccount().address;
}
