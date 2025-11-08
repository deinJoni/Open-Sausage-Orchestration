import { useAccount } from "wagmi";
import { useQuery as useGqtyQuery } from "@/gqty";

/**
 * Hook to detect which profile the connected wallet owns
 * Returns GQty User if wallet owns a profile, null otherwise
 */
export function useOwnedProfile() {
  const { address } = useAccount();
  // Disable suspense to get proper loading states
  const { user, $state } = useGqtyQuery({ suspense: false });

  if (!address) {
    return {
      data: null,
      isLoading: false,
      hasProfile: false,
      error: null,
    };
  }

  // Query user data - GQty will track this and trigger re-renders
  const userData = user({
    id: address.toLowerCase(),
  });

  // Access subdomain and textRecords to trigger GQty tracking
  const subdomainData = userData?.subdomain;
  const textRecordsData = subdomainData?.textRecords?.();

  const ensName = subdomainData?.name
    ? `${subdomainData.name}.osopit.eth`
    : null;

  console.log("useOwnedProfile:", {
    address,
    isLoading: $state.isLoading,
    userData,
    subdomainData,
    textRecordsData,
    ensName,
  });

  return {
    data: {
      user: userData,
      subdomain: subdomainData,
      textRecords: textRecordsData,
      ensName,
    },
    isLoading: $state.isLoading,
    hasProfile: !!userData,
    error: $state.error,
  };
}

export type OwnedProfile = NonNullable<
  Awaited<ReturnType<typeof useOwnedProfile>>["data"]
>;
