import { useAccount } from "wagmi";
import { useQuery as useGqtyQuery } from "@/gqty";
import type { User } from "@/gqty/schema.generated";

/**
 * Hook to detect which profile the connected wallet owns
 * Returns GQty User if wallet owns a profile, null otherwise
 */
export function useOwnedProfile() {
  const { address } = useAccount();
  const { user } = useGqtyQuery();

  if (!address) {
    return {
      data: null,
      ensName: null,
      isLoading: false,
      hasProfile: false,
      error: null,
    };
  }

  const data: User | null =
    user({
      id: address.toLowerCase(),
    }) ?? null;

  const ensName = data?.subdomain?.name
    ? `${data.subdomain.name}.osopit.eth`
    : null;

  // If we have an address but data is still undefined (not null), query is loading
  const isLoading = data === undefined;

  return {
    data,
    ensName,
    isLoading,
    hasProfile: !!data,
    error: null,
  };
}
