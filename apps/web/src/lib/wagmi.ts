import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

/**
 * Public client for reading from the blockchain
 * Used for ENS resolution and other read-only operations
 */
export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});
