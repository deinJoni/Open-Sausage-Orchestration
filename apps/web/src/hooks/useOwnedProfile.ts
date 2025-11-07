import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_, type User } from "@/gqty/schema.generated";
import { useAccount } from "wagmi";

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
      subgraphError: _SubgraphErrorPolicy_.deny,
    }) ?? null;

  const ensName = data?.subdomain?.name
    ? `${data.subdomain.name}.catmisha.eth`
    : null;

  return {
    data,
    ensName,
    isLoading: false,
    hasProfile: !!data,
    error: null,
  };
}
