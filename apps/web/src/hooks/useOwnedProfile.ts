import { useAccount } from "wagmi";
import { useQuery as useGqtyQuery } from "@/gqty";

/**
 * Hook to detect which profile the connected wallet owns
 * Returns GQty User if wallet owns a profile, null otherwise
 */
export function useOwnedProfile() {
  const { address } = useAccount();
  const query = useGqtyQuery();

  if (!address) {
    return {
      data: null,
      isLoading: false,
      hasProfile: false,
      error: null,
    };
  }

  const userData = query.user({
    id: address.toLowerCase(),
  });

  // Access subdomain and textRecords
  const subdomainData = userData?.subdomain;
  const textRecordsData = subdomainData?.textRecords?.();

  const ensName = subdomainData?.name
    ? `${subdomainData.name}.osopit.eth`
    : null;

  // If we have an address but data is still undefined (not null), query is loading
  const isLoading = userData === undefined;

  return {
    data: {
      user: userData,
      subdomain: subdomainData,
      textRecords: textRecordsData,
      ensName,
    },
    isLoading,
    hasProfile: !!userData,
    error: null,
  };
}

export type OwnedProfile = NonNullable<
  Awaited<ReturnType<typeof useOwnedProfile>>["data"]
>;
